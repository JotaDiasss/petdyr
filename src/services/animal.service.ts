import type { IAnimal } from "../interfaces/animal.interface";
import { Animal } from "../models/animal.model";

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
      throw new Error("Raça deve ser uma")
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
