import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import app from "../src/app";
import { Animal } from "../src/db/models/animal.model";
import { Dono } from "../src/db/models/dono.model";
import { Pet } from "../src/db/models/pet.model";

const testDatabaseUri = `mongodb://127.0.0.1:27017/petdyr_${randomUUID().replaceAll("-", "")}_test`;

async function criarAnimalEDono() {
  await request(app).post("/animais").send({
    especie: "Cachorro",
    racas: ["Labrador", "Poodle"],
  });
  await request(app).post("/dono").send({
    nome: "Joao Silva",
    cpf: "52998224725",
  });
}

beforeAll(async () => {
  const databaseName = new URL(testDatabaseUri).pathname.slice(1);
  if (!databaseName.endsWith("_test")) {
    throw new Error("Os testes exigem um banco terminado em _test");
  }
  await mongoose.connect(testDatabaseUri);
  await Promise.all([Animal.init(), Dono.init(), Pet.init()]);
});

beforeEach(async () => {
  await Promise.all([
    Animal.deleteMany({}),
    Dono.deleteMany({}),
    Pet.deleteMany({}),
  ]);
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState === 1 &&
        mongoose.connection.name === new URL(testDatabaseUri).pathname.slice(1)) {
      await mongoose.connection.dropDatabase();
    }
  } finally {
    await mongoose.disconnect();
  }
});

describe("aplicação completa com MongoDB", () => {
  const petValido = {
    nome: "Rex", nascimento: "2022-05-10",
    animal: { especie: "Cachorro", raca: "Labrador" },
    dono: { nome: "Joao Silva", cpf: "52998224725" },
  };

  it.each([
    ["/animais", {}], ["/animais", { especie: null, racas: [] }],
    ["/animais", { especie: 123, racas: ["Poodle"] }],
    ["/animais", { especie: "Gato", racas: [123] }],
    ["/animais", { especie: "Gato", racas: [" "] }],
    ["/animais", { especie: "Gato", racas: ["Raca1"] }],
    ["/dono", {}], ["/dono", { nome: null, cpf: "123" }],
    ["/dono", { nome: 123, cpf: "123" }],
    ["/dono", { nome: "Joao1", cpf: "52998224725" }],
    ["/dono", { nome: "Joao", cpf: 123 }],
    ["/pet", {}], ["/pet", { ...petValido, nome: null }],
    ["/pet", { ...petValido, nascimento: null }],
    ["/pet", { ...petValido, nascimento: "2999-01-01" }],
    ["/pet", { ...petValido, animal: null }],
    ["/pet", { ...petValido, animal: {} }],
    ["/pet", { ...petValido, dono: {} }],
    ["/pet", { ...petValido, dono: null }],
  ])("POST %s rejeita entrada inválida %#", async (path, body) => {
    const response = await request(app).post(path as string).send(body);
    expect(response.status).toBe(400);
    expect(response.body.err).toEqual(expect.any(String));
    expect(await Pet.countDocuments()).toBe(0);
  });

  it.each(["/animais", "/dono", "/pet"])("%s rejeita corpo ausente, array e JSON malformado", async (path) => {
    expect((await request(app).post(path)).status).toBe(400);
    expect((await request(app).post(path).send([])).status).toBe(400);
    expect((await request(app).post(path).set("Content-Type", "application/json").send("{")).status).toBe(400);
  });

  it.each(["/animais", "/dono", "/pet"])("%s retorna 404 para IDs inexistentes e inválidos", async (path) => {
    for (const id of ["invalido", new mongoose.Types.ObjectId().toHexString()]) {
      expect((await request(app).get(`${path}/${id}`)).status).toBe(404);
      expect((await request(app).patch(`${path}/${id}`).send(
        path === "/animais" ? { especie: "Gato" } : { nome: "Teste" },
      )).status).toBe(404);
      expect((await request(app).delete(`${path}/${id}`)).status).toBe(404);
    }
  });

  it("rejeita espécie e CPF duplicados na criação e na atualização", async () => {
    await criarAnimalEDono();
    expect((await request(app).post("/animais").send({ especie: "Cachorro", racas: ["Poodle"] })).status).toBe(409);
    expect((await request(app).post("/dono").send(petValido.dono)).status).toBe(409);
    const gato = await request(app).post("/animais").send({ especie: "Gato", racas: ["Siames"] });
    expect((await request(app).patch(`/animais/${gato.body._id}`).send({ especie: "Cachorro" })).status).toBe(409);
    const outro = await request(app).post("/dono").send({ nome: "Maria", cpf: "11144477735" });
    expect(outro.status).toBe(201);
    expect((await request(app).patch(`/dono/${outro.body._id}`).send({ cpf: "52998224725" })).status).toBe(409);
    expect((await Dono.findById(outro.body._id))?.cpf).toBe("11144477735");
  });

  it("rejeita atualizações inválidas e preserva os documentos", async () => {
    await criarAnimalEDono();
    const criado = await request(app).post("/pet").send(petValido);
    expect(criado.status).toBe(201);
    const animal = await Animal.findOne();
    const dono = await Dono.findOne();
    const casos = [
      { path: `/animais/${animal!._id}`, bodies: [{}, { extra: true }, { especie: "" }, { racas: [] }, { racas: [123] }] },
      { path: `/dono/${dono!._id}`, bodies: [{}, { extra: true }, { nome: "" }, { cpf: "123" }] },
      { path: `/pet/${criado.body._id}`, bodies: [{}, { extra: true }, { nome: "" }, { nascimento: "2999-01-01" }, { animal: {} }, { dono: {} }, { animal: { especie: "Gato", raca: "Siames" } }] },
    ];
    for (const caso of casos) {
      for (const body of caso.bodies) {
        expect((await request(app).patch(caso.path).send(body)).status).toBe(400);
      }
    }
    expect((await Pet.findById(criado.body._id))?.nome).toBe("Rex");
    expect((await Animal.findById(animal!._id))?.racas).toEqual(["Labrador", "Poodle"]);
  });

  it("atualiza os relacionamentos do pet e rejeita dono inexistente", async () => {
    await criarAnimalEDono();
    const criado = await request(app).post("/pet").send(petValido);
    expect(criado.status).toBe(201);
    const path = `/pet/${criado.body._id}`;
    const atualizado = await request(app).patch(path).send({ animal: { especie: "Cachorro", raca: "Poodle" }, dono: petValido.dono });
    expect(atualizado.status).toBe(200);
    expect((await Pet.findById(criado.body._id))?.animal.raca).toBe("Poodle");
    expect((await request(app).patch(path).send({ dono: { nome: "Ausente", cpf: "11144477735" } })).status).toBe(404);
  });
  it("responde na raiz", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("API funcionando");
  });

  it("executa criação, consulta, edição, listagem e exclusão de animal", async () => {
    const criado = await request(app).post("/animais").send({
      especie: "Cachorro",
      racas: ["Labrador", "Poodle"],
    });
    expect(criado.status).toBe(201);
    const id = criado.body._id as string;

    expect((await request(app).get(`/animais/${id}`)).status).toBe(200);
    const atualizado = await request(app)
      .patch(`/animais/${id}`)
      .send({ racas: ["Labrador", "Beagle"] });
    expect(atualizado.status).toBe(200);
    expect(atualizado.body.racas).toEqual(["Labrador", "Beagle"]);
    expect((await request(app).get("/animais")).body).toHaveLength(1);
    expect((await request(app).delete(`/animais/${id}`)).status).toBe(204);
    expect(await Animal.countDocuments()).toBe(0);
  });

  it("rejeita animal e ID inválidos", async () => {
    const criacao = await request(app)
      .post("/animais")
      .send({ especie: "", racas: ["Labrador"] });
    expect(criacao.status).toBe(400);
    expect((await request(app).get("/animais/id-invalido")).status).toBe(404);
  });

  it("executa criação, consulta, edição, listagem e exclusão de dono", async () => {
    const criado = await request(app)
      .post("/dono")
      .send({ nome: "Joao Silva", cpf: "52998224725" });
    expect(criado.status).toBe(201);
    const id = criado.body._id as string;

    expect((await request(app).get(`/dono/${id}`)).status).toBe(200);
    const atualizado = await request(app)
      .patch(`/dono/${id}`)
      .send({ nome: "Joao Dias" });
    expect(atualizado.status).toBe(200);
    expect(atualizado.body.nome).toBe("Joao Dias");
    expect((await request(app).get("/dono")).body).toHaveLength(1);
    expect((await request(app).delete(`/dono/${id}`)).status).toBe(204);
    expect(await Dono.countDocuments()).toBe(0);
  });

  it("rejeita CPF e ID de dono inválidos", async () => {
    const criacao = await request(app)
      .post("/dono")
      .send({ nome: "Joao Silva", cpf: "123" });
    expect(criacao.status).toBe(400);
    expect((await request(app).get("/dono/id-invalido")).status).toBe(404);
  });

  it("executa o ciclo completo de pet com animal e dono existentes", async () => {
    await criarAnimalEDono();
    const criado = await request(app).post("/pet").send({
      nome: "Rex",
      nascimento: "2022-05-10",
      animal: { especie: "Cachorro", raca: "Labrador" },
      dono: { nome: "Joao Silva", cpf: "52998224725" },
    });
    expect(criado.status).toBe(201);
    const id = criado.body._id as string;

    expect((await request(app).get(`/pet/${id}`)).status).toBe(200);
    const atualizado = await request(app)
      .patch(`/pet/${id}`)
      .send({ nome: "Rex Junior", nascimento: "2021-01-15" });
    expect(atualizado.status).toBe(200);
    expect(atualizado.body.nome).toBe("Rex Junior");
    expect(new Date(atualizado.body.nascimento).toISOString()).toBe(
      new Date("2021-01-15").toISOString(),
    );
    expect((await request(app).get("/pet")).body).toHaveLength(1);
    expect((await request(app).delete(`/pet/${id}`)).status).toBe(204);
    expect(await Pet.countDocuments()).toBe(0);
  });

  it("rejeita data de nascimento inválida", async () => {
    const response = await request(app).post("/pet").send({
      nome: "Rex",
      nascimento: "data-invalida",
      animal: { especie: "Cachorro", raca: "Labrador" },
      dono: { nome: "Joao Silva", cpf: "52998224725" },
    });
    expect(response.status).toBe(400);
  });

  it("rejeita pet quando a espécie ou raça não existe", async () => {
    await request(app)
      .post("/dono")
      .send({ nome: "Joao Silva", cpf: "52998224725" });
    const response = await request(app).post("/pet").send({
      nome: "Rex",
      nascimento: "2022-05-10",
      animal: { especie: "Cachorro", raca: "Labrador" },
      dono: { nome: "Joao Silva", cpf: "52998224725" },
    });
    expect(response.status).toBe(404);
    expect(await Pet.countDocuments()).toBe(0);
  });

  it("rejeita pet quando o dono não existe", async () => {
    await request(app)
      .post("/animais")
      .send({ especie: "Cachorro", racas: ["Labrador"] });
    const response = await request(app).post("/pet").send({
      nome: "Rex",
      nascimento: "2022-05-10",
      animal: { especie: "Cachorro", raca: "Labrador" },
      dono: { nome: "Joao Silva", cpf: "52998224725" },
    });
    expect(response.status).toBe(404);
    expect(await Pet.countDocuments()).toBe(0);
  });

  it("rejeita ID de pet inválido", async () => {
    expect((await request(app).get("/pet/id-invalido")).status).toBe(404);
  });
});
