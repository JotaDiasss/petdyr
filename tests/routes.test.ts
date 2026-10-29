import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/services/animal.service", () => ({
  acharTodosAnimais: vi.fn(),
  acharAnimalPorId: vi.fn(),
  criarAnimal: vi.fn(),
  atualizarAnimal: vi.fn(),
  deletarAnimal: vi.fn(),
}));

vi.mock("../src/services/dono.service", () => ({
  acharTodosDonos: vi.fn(),
  acharDonoPorId: vi.fn(),
  criarDono: vi.fn(),
  atualizarDono: vi.fn(),
  deletarDono: vi.fn(),
}));

vi.mock("../src/services/pet.service", () => ({
  acharTodosPets: vi.fn(),
  acharPetPorId: vi.fn(),
  criarPet: vi.fn(),
  atualizarPet: vi.fn(),
  deletarPet: vi.fn(),
}));

import app from "../src/app";
import * as animalService from "../src/services/animal.service";
import * as donoService from "../src/services/dono.service";
import * as petService from "../src/services/pet.service";

const id = "507f1f77bcf86cd799439011";

beforeEach(() => {
  vi.resetAllMocks();
});

describe("falhas de infraestrutura", () => {
  const animal = { especie: "Gato", racas: ["Siames"] };
  const dono = { nome: "Joao", cpf: "52998224725" };
  const pet = { nome: "Rex", nascimento: "2022-01-01", animal: { especie: "Gato", raca: "Siames" }, dono };
  const recursos = [
    { path: "/animais", body: animal, services: Object.values(animalService) },
    { path: "/dono", body: dono, services: Object.values(donoService) },
    { path: "/pet", body: pet, services: Object.values(petService) },
  ];
  for (const recurso of recursos) {
    it.each(["get", "post", "patch", "delete"] as const)(
      `retorna 500 quando o banco falha em %s ${recurso.path}`,
      async (method) => {
        for (const service of recurso.services) {
          vi.mocked(service).mockRejectedValue(new Error("Falha de conexão com o banco"));
        }
        const path = method === "patch" || method === "delete" ? `${recurso.path}/${id}` : recurso.path;
        const response = await request(app)[method](path).send(recurso.body);
        expect(response.status).toBe(500);
        expect(response.body.err).toEqual(expect.any(String));
        expect(JSON.stringify(response.body)).not.toContain("Falha de conexão");
      },
    );
    it(`retorna 500 ao consultar ID com banco indisponível em ${recurso.path}`, async () => {
      for (const service of recurso.services) {
        vi.mocked(service).mockRejectedValue(new Error("Banco indisponível"));
      }
      expect((await request(app).get(`${recurso.path}/${id}`)).status).toBe(500);
    });
  }
});

describe("rotas de animais", () => {
  it("GET /animais lista os animais", async () => {
    vi.mocked(animalService.acharTodosAnimais).mockResolvedValue([]);
    const response = await request(app).get("/animais");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("GET /animais/:id encaminha o ID da URL", async () => {
    vi.mocked(animalService.acharAnimalPorId).mockResolvedValue({ especie: "Cachorro", racas: ["Labrador"] } as never);
    const response = await request(app).get(`/animais/${id}`);
    expect(response.status).toBe(200);
    expect(animalService.acharAnimalPorId).toHaveBeenCalledWith(id);
  });

  it("POST /animais cria um animal", async () => {
    const body = { especie: "Cachorro", racas: ["Labrador"] };
    vi.mocked(animalService.criarAnimal).mockResolvedValue(body as never);
    const response = await request(app).post("/animais").send(body);
    expect(response.status).toBe(201);
    expect(animalService.criarAnimal).toHaveBeenCalledWith(body);
  });

  it("PATCH /animais/:id atualiza um animal", async () => {
    const body = { racas: ["Labrador", "Poodle"] };
    vi.mocked(animalService.atualizarAnimal).mockResolvedValue(body as never);
    const response = await request(app).patch(`/animais/${id}`).send(body);
    expect(response.status).toBe(200);
    expect(animalService.atualizarAnimal).toHaveBeenCalledWith(id, body);
  });

  it("DELETE /animais/:id exclui um animal", async () => {
    vi.mocked(animalService.deletarAnimal).mockResolvedValue({} as never);
    const response = await request(app).delete(`/animais/${id}`);
    expect(response.status).toBe(204);
    expect(animalService.deletarAnimal).toHaveBeenCalledWith(id);
  });
});

describe("rotas de donos", () => {
  it("GET /dono lista os donos", async () => {
    vi.mocked(donoService.acharTodosDonos).mockResolvedValue([]);
    const response = await request(app).get("/dono");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("GET /dono/:id encaminha o ID da URL", async () => {
    vi.mocked(donoService.acharDonoPorId).mockResolvedValue({ nome: "Joao", cpf: "52998224725" } as never);
    const response = await request(app).get(`/dono/${id}`);
    expect(response.status).toBe(200);
    expect(donoService.acharDonoPorId).toHaveBeenCalledWith(id);
  });

  it("POST /dono cria um dono", async () => {
    const body = { nome: "Joao", cpf: "52998224725" };
    vi.mocked(donoService.criarDono).mockResolvedValue(body as never);
    const response = await request(app).post("/dono").send(body);
    expect(response.status).toBe(201);
    expect(donoService.criarDono).toHaveBeenCalledWith(body);
  });

  it("PATCH /dono/:id atualiza um dono", async () => {
    const body = { nome: "Joao Dias" };
    vi.mocked(donoService.atualizarDono).mockResolvedValue(body as never);
    const response = await request(app).patch(`/dono/${id}`).send(body);
    expect(response.status).toBe(200);
    expect(donoService.atualizarDono).toHaveBeenCalledWith(id, body);
  });

  it("DELETE /dono/:id exclui um dono", async () => {
    vi.mocked(donoService.deletarDono).mockResolvedValue({} as never);
    const response = await request(app).delete(`/dono/${id}`);
    expect(response.status).toBe(204);
    expect(donoService.deletarDono).toHaveBeenCalledWith(id);
  });
});

describe("rotas de pets", () => {
  it("GET /pet lista os pets", async () => {
    vi.mocked(petService.acharTodosPets).mockResolvedValue([]);
    const response = await request(app).get("/pet");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("GET /pet/:id encaminha o ID da URL", async () => {
    vi.mocked(petService.acharPetPorId).mockResolvedValue({ nome: "Rex" } as never);
    const response = await request(app).get(`/pet/${id}`);
    expect(response.status).toBe(200);
    expect(petService.acharPetPorId).toHaveBeenCalledWith(id);
  });

  it("POST /pet cria um pet e converte a data", async () => {
    const body = {
      nome: "Rex",
      nascimento: "2022-05-10",
      animal: { especie: "Cachorro", raca: "Labrador" },
      dono: { nome: "Joao", cpf: "52998224725" },
    };
    vi.mocked(petService.criarPet).mockResolvedValue(body as never);
    const response = await request(app).post("/pet").send(body);
    expect(response.status).toBe(201);
    expect(petService.criarPet).toHaveBeenCalledWith({
      ...body,
      nascimento: new Date(body.nascimento),
    });
  });

  it("PATCH /pet/:id atualiza um pet", async () => {
    const body = { nome: "Rex Junior" };
    vi.mocked(petService.atualizarPet).mockResolvedValue(body as never);
    const response = await request(app).patch(`/pet/${id}`).send(body);
    expect(response.status).toBe(200);
    expect(petService.atualizarPet).toHaveBeenCalledWith(id, body);
  });

  it("DELETE /pet/:id exclui um pet", async () => {
    vi.mocked(petService.deletarPet).mockResolvedValue({} as never);
    const response = await request(app).delete(`/pet/${id}`);
    expect(response.status).toBe(204);
    expect(petService.deletarPet).toHaveBeenCalledWith(id);
  });
});
