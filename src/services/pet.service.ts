import type { IPet } from "../interfaces/pet.interface";
import { Animal } from "../models/animal.model";
import { Pet } from "../models/pet.model";
import { Dono } from "../models/dono.model";
import { dataDeNascimentoValida } from "../utils/date.utils";
import { isObjectIdOrHexString } from "mongoose";

export async function acharTodosPets() {
  return Pet.find();
}

export async function acharPetPorId(id: string) {
  if (!isObjectIdOrHexString(id)) {
    throw new Error("ID do pet inválido");
  }
  const pet = await Pet.findById(id);
  if (!pet) {
    throw new Error("Pet não encontrado");
  }
  return pet;
}

export async function criarPet(dados: IPet) {
  // Nome
  if (dados.nome === "" || dados.nome.trim() === "") {
    throw new Error("Nome é obrigatório");
  }

  if (!/^[a-zA-Z\s]+$/.test(dados.nome)) {
    throw new Error("Nome deve conter apenas letras e espaços");
  }

  //  Nascimento

  if (
    !(dados.nascimento instanceof Date) ||
    Number.isNaN(dados.nascimento.getTime())
  ) {
    throw new Error("Data de nascimento inválida");
  }

  if (!dataDeNascimentoValida(dados.nascimento)) {
    throw new Error("Data de nascimento inválida");
  }

  //  Animal
  const animalValido = await Animal.exists({
    especie: dados.animal.especie,
    racas: dados.animal.raca,
  });

  if (!animalValido) {
    throw new Error("A espécie/raça não existe");
  }

  //  Dono
  const donoValido = await Dono.exists({
    nome: dados.dono.nome,
    cpf: dados.dono.cpf,
  });

  if (!donoValido) {
    throw new Error("O dono não existe ");
  }

  return await Pet.create(dados);
}

export async function atualizarPet(id: string, dados: Partial<IPet>) {
  const pet = await acharPetPorId(id);
  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    throw new Error("Dados de atualização inválidos");
  }
  if (
    Object.keys(dados).length === 0 ||
    Object.keys(dados).some(
      (campo) => !["nome", "nascimento", "animal", "dono"].includes(campo),
    )
  ) {
    throw new Error(
      "Informe apenas nome, nascimento, animal e/ou dono para atualizar",
    );
  }
  if ("nome" in dados) {
    if (
      typeof dados.nome !== "string" ||
      !dados.nome.trim() ||
      !/^[\p{L}\s]+$/u.test(dados.nome)
    ) {
      throw new Error(
        "Nome deve conter apenas letras e espaços e não pode ser vazio",
      );
    }
    pet.nome = dados.nome;
  }
  if ("nascimento" in dados) {
    if (
      !(dados.nascimento instanceof Date) ||
      !dataDeNascimentoValida(dados.nascimento)
    ) {
      throw new Error("Data de nascimento inválida ou futura");
    }
    pet.nascimento = dados.nascimento;
  }
  if ("animal" in dados) {
    if (
      !dados.animal ||
      typeof dados.animal.especie !== "string" ||
      typeof dados.animal.raca !== "string"
    ) {
      throw new Error("Informe a espécie e a raça do animal");
    }
    const animalValido = await Animal.exists({
      especie: dados.animal.especie,
      racas: dados.animal.raca,
    });
    if (!animalValido){
      throw new Error("A espécie/raça não existe");
    }
    pet.animal = { especie: dados.animal.especie, raca: dados.animal.raca };
  }
  if ("dono" in dados) {
    if (
      !dados.dono ||
      typeof dados.dono.nome !== "string" ||
      typeof dados.dono.cpf !== "string"
    ) {
      throw new Error("Informe o nome e o CPF do dono");
    }
    const donoValido = await Dono.exists({
      nome: dados.dono.nome,
      cpf: dados.dono.cpf,
    });
    if (!donoValido) throw new Error("O dono não existe");
    pet.dono = { nome: dados.dono.nome, cpf: dados.dono.cpf };
  }
  return pet.save();
}


export async function deletarPet(id: string) {
  const pet = await Pet.findByIdAndDelete(id);

  if (!pet) {
    throw new Error("Pet não encontrado");
  }

  return pet;
}
