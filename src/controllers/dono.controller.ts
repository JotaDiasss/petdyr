import {
  acharTodosDonos,
  acharDonoPorId,
  criarDono,
  atualizarDono,
  deletarDono,
} from "../services/dono.service";
import type { Request, Response } from "express";
import type { IDono } from "../interfaces/dono.interface"

export async function acharTodosDonosController(req: Request, res: Response) {
  try {
    const donos = await acharTodosDonos();
    res.status(200).json(donos);
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return res.status(409).json({ err: "Cadastro duplicado" });
    }
    res.status(500).json({ err: "Erro ao buscar donos" })
  }
}

export async function acharDonoPorIdController(req: Request<{id:string}>, res: Response) {
  try {
    const id = req.params.id
    const dono = await acharDonoPorId(id);

    res.status(200).json(dono);
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return res.status(409).json({ err: "Cadastro duplicado" });
    }
    if (err instanceof Error) {
      if (
        err.message === "Dono não encontrado" ||
        err.message === "ID do dono inválido"
      ) {
        return res.status(404).json({ err: err.message })
      }
    }
    res.status(500).json({ err: "Erro ao buscar o dono" })
  }
}

export async function criarDonoController(req: Request, res: Response) {
  try {
    const { nome, cpf }:IDono = req.body

    const dono = await criarDono({ nome, cpf })
    if (!dono) {
      throw new Error("Erro ao criar dono")
    }

    res.status(201).json(dono)
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return res.status(409).json({ err: "Cadastro duplicado" });
    }
    if (err instanceof Error) {
      if (
        err.message === "Nome do dono é obrigatório" ||
        err.message === "Nome deve conter apenas letras e espaços" ||
        err.message === "CPF inválido ou já existente"
      ) {
        return res.status(400).json({ err: err.message })
      }
      
      if (
        err.message === "Dono não encontrado" ||
        err.message === "ID do dono inválido"
      ) {
        return res.status(404).json({ err: err.message })
      }
    }
    res.status(500).json({ err: "Erro ao criar o dono" })
  }
}

export async function atualizarDonoController(req: Request<{id:string}>, res: Response) {
  try {
    const id = req.params.id
    const { nome, cpf }:Partial<IDono> = req.body

    const dados:Partial<IDono> = {}

    if (nome !== undefined) {
      dados.nome = nome
    }

    if (cpf !== undefined) {
      dados.cpf = cpf
    }

    const dono = await atualizarDono(id, dados)

    return res.status(200).json(dono)
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return res.status(409).json({ err: "Cadastro duplicado" });
    }
    if (err instanceof Error) {
      if (
        err.message === "Dados de atualização inválidos" ||
        err.message === "Informe apenas nome e/ou cpf para atualizar" ||
        err.message === "Nome deve conter apenas letras e espaços e não pode ser vazio" ||
        err.message === "CPF inválido ou já existente"
      ) {
        return res.status(400).json({ err: err.message })
      }
      
      if (
        err.message === "Dono não encontrado" ||
        err.message === "ID do dono inválido"
      ) {
        return res.status(404).json({ err: err.message })
      }
    }

    res.status(500).json({ err: "Erro ao editar o dono"})
  }
}

export async function deletarDonoController(req: Request<{id:string}>, res: Response) {
  try {
    const id = req.params.id

    await deletarDono(id)

    res.status(204).send()
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return res.status(409).json({ err: "Cadastro duplicado" });
    }
    if (err instanceof Error) {
      if (
        err.message === "ID do dono inválido" ||
        err.message === "Dono não encontrado"
      ) {
        return res.status(404).json({ err: err.message })
      }
    }
    res.status(500).json({ err: "Erro ao deletar dono"})
  }
}
