import type { IPet } from "../interfaces/pet.interface";
import { Animal } from "../models/animal.model";
import { Pet } from "../models/pet.model";
import { Dono } from "../models/dono.model";
import { dataDeNascimentoValida } from "../utils/date.utils"

export async function criarPet(dados: IPet) {
  // Nome
  if (dados.nome === "" || dados.nome.trim() === "") {
    throw new Error("Nome é obrigatorio");
  }

  if (!/^[a-zA-Z\s]+$/.test(dados.nome)) {
    throw new Error("Nome deve conter apenas letras e espaços");
  }

  //  Nascimento

  if (!(dados.nascimento instanceof Date) || Number.isNaN(dados.nascimento.getTime())) {
    throw new Error("Data de nascimento inválida")
  }

  if (!dataDeNascimentoValida(dados.nascimento)) {
    throw new Error("Data de nascimento inválida")
  }

  //  Animal
  const animaValido = await Animal.exists({
    especie: dados.animal.especie,
    racas: dados.animal.raca,
  });

  if (!animaValido) {
    throw new Error("Espécie ou raça inválida");
  }

  //  Dono
  const donoValido = await Dono.exists({
    nome: dados.dono.nome,
    cpf: dados.dono.cpf,
  })

  if (!donoValido) {
    throw new Error("Nome ou cpf inválido");
  }

  return await Pet.create(dados);
}