import type { IAnimal } from "../interfaces/animal.interface";
import { Animal } from "../models/animal.model";
import { isObjectIdOrHexString } from "mongoose";

export async function acharTodosAnimais() {
  return Animal.find();
}

export async function acharAnimalPorId(id: string) {
  if (!isObjectIdOrHexString(id)) throw new Error("ID de animal inválido");
  const animal = await Animal.findById(id);
  if (!animal) throw new Error("Animal não encontrado");
  return animal;
}

export async function criarAnimal(dados: IAnimal) {
  //  Especie
  if (dados.especie === "" || dados.especie.trim() === "") {
    throw new Error("Espécie é obrigatória");
  }

  if (!/^[a-zA-Z\s]+$/.test(dados.especie)) {
    throw new Error("Espécie deve conter apenas letras e espaços");
  }

  //  Raça
  if (!Array.isArray(dados.racas)) {
    throw new Error("A lista de raças é obrigatória");
  }

  if (dados.racas.length === 0) {
    throw new Error("O animal deve conter pelo menos uma raça");
  }

  for (const raca of dados.racas) {
    if (typeof raca !== "string") {
      throw new Error("Raça deve ser uma");
    }

    if (!/^[\p{L}\s]+$/u.test(raca)) {
      throw new Error("Raça deve conter apenas letras e espaços");
    }

    if (raca === "" || raca.trim() === "") {
      throw new Error("Nome da Raça invalido");
    }
  }

  return await Animal.create(dados);
}

export async function atualizarAnimal(id: string, dados: Partial<IAnimal>) {
  const animal = await acharAnimalPorId(id);
  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    throw new Error("Dados de atualização inválidos");
  }
  if (
    Object.keys(dados).length === 0 ||
    Object.keys(dados).some((campo) => !["especie", "racas"].includes(campo))
  ) {
    throw new Error("Informe apenas especie e/ou racas para atualizar");
  }

  if ("especie" in dados) {
    if (
      typeof dados.especie !== "string" ||
      !dados.especie.trim() ||
      !/^[\p{L}\s]+$/u.test(dados.especie)
    ) {
      throw new Error(
        "Espécie deve conter apenas letras e espaços e não pode ser vazia",
      );
    }
    animal.especie = dados.especie;
  }
  if ("racas" in dados) {
    if (!Array.isArray(dados.racas) || dados.racas.length === 0) {
      throw new Error("Informe pelo menos uma raça");
    }
    for (const raca of dados.racas) {
      if (
        typeof raca !== "string" ||
        !raca.trim() ||
        !/^[\p{L}\s]+$/u.test(raca)
      ) {
        throw new Error(
          "Raça deve conter apenas letras e espaços e não pode ser vazia",
        );
      }
    }
    animal.racas = dados.racas;
  }
  return animal.save();
}

export async function deletarAnimal(id: string) {
  const animal = await Animal.findByIdAndDelete(id);

  if (!animal) {
    throw new Error("Animal não encontrado");
  }

  return animal;
}
