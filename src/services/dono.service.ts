import type { IDono } from "../interfaces/dono.interface";
import { Dono } from "../models/dono.model";
import { cpf } from "cpf-cnpj-validator";

export async function criarDono(dados: IDono) {
  //  Nome
  if (dados.nome === "" || dados.nome.trim() === "") {
    throw new Error("Nome do dono é obrigatório");
  }

  if (!/^[a-zA-Z\s]+$/.test(dados.nome)) {
    throw new Error("Nome deve conter apenas letras e espaços");
  }

  //  CPF
  if (!cpf.isValid(dados.cpf)) {
    throw new Error("CPF inválido");
  }

  return await Dono.create(dados);
}
