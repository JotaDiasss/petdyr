import type { IDono } from "../interfaces/dono.interface";
import { Dono } from "../models/dono.model";
import { cpf } from "cpf-cnpj-validator";
import { isObjectIdOrHexString } from "mongoose";

export async function acharTodosDonos() {
  return Dono.find();
}

export async function acharDonoPorId(id: string) {
  if (!isObjectIdOrHexString(id)) throw new Error("ID de dono inválido");
  const dono = await Dono.findById(id);
  if (!dono) throw new Error("Dono não encontrado");
  return dono;
}

export async function atualizarDono(id: string, dados: Partial<IDono>) {
  const dono = await acharDonoPorId(id);
  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    throw new Error("Dados de atualização inválidos");
  }
  if (
    Object.keys(dados).length === 0 ||
    Object.keys(dados).some((campo) => !["nome", "cpf"].includes(campo))
  ) {
    throw new Error("Informe apenas nome e/ou cpf para atualizar");
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
    dono.nome = dados.nome;
  }
  if ("cpf" in dados) {
    if (typeof dados.cpf !== "string" || !cpf.isValid(dados.cpf)) {
      throw new Error("CPF inválido");
    }
    dono.cpf = dados.cpf;
  }
  return dono.save();
}

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

export async function deletarDono(id: string) {
  const dono = await Dono.findByIdAndDelete(id);

  if (!dono) {
    throw new Error("Dono não encontrado");
  }

  return dono;
}
