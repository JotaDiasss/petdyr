import {
  acharTodosPets,
  acharPetPorId,
  criarPet,
  atualizarPet,
  deletarPet,
} from "../services/pet.service";
import type { Request, Response } from "express";
import type { IPet } from "../interfaces/pet.interface"

export async function acharTodosPetsController(req: Request, res: Response) {
  try {
    const pets = await acharTodosPets()
    res.status(200).json(pets)
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return res.status(409).json({ err: "Cadastro duplicado" });
    }
    res.status(500).json({ err: "Erro ao buscar pets"})
  }
}

export async function acharPetPorIdController(req: Request<{id:string}>, res: Response) {
  try {
    const id = req.params.id
    const pet = await acharPetPorId(id)

    res.status(200).json(pet)
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return res.status(409).json({ err: "Cadastro duplicado" });
    }
    if (err instanceof Error) {
      if (
        err.message === "ID do pet inválido" ||
        err.message === "Pet não encontrado"
      ) {
        return res.status(404).json({ err: err.message })
      }
    }
    res.status(500).json({ err: "Erro ao buscar o pet"})
  }
}

export async function criarPetController(req: Request, res: Response) {
  try {
    const { nome, nascimento, animal, dono }:IPet = req.body;

    const dados: IPet = {
      nome,
      nascimento: new Date(nascimento),
      animal,
      dono,
    };

    const pet = await criarPet(dados);

    return res.status(201).json(pet);
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return res.status(409).json({ err: "Cadastro duplicado" });
    }
    if (err instanceof Error) {
      if (
        err.message === "Nome é obrigatório" ||
        err.message === "Nome deve conter apenas letras e espaços" ||
        err.message === "Data de nascimento inválida"
      ) {
        return res.status(400).json({ err: err.message})
      }

      if (
        err.message === "ID do pet inválido" ||
        err.message === "Pet não encontrado" ||
        err.message === "A espécie/raça não existe" ||
        err.message === "O dono não existe"
      ) {
        return res.status(404).json({ err: err.message })
      }
    }
    res.status(500).json({ err: "Erro ao criar o pet"})
  }
}

export async function atualizarPetController(req: Request<{id:string}>, res: Response) {
  try {
    const id = req.params.id
    const { nome, nascimento, animal, dono }:Partial<IPet> = req.body;

    const dados:Partial<IPet> = {}

    if (nome !== undefined) {
      dados.nome = nome
    }

    if (nascimento !== undefined) {
      dados.nascimento = new Date(nascimento)
    }

    if (animal !== undefined) {
      dados.animal = animal
    }

    if (dono !== undefined) {
      dados.dono = dono
    }

    const pet = await atualizarPet(id, dados)

    return res.status(200).json(pet)
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return res.status(409).json({ err: "Cadastro duplicado" });
    }
    if (err instanceof Error) {
      if (
        err.message === "Dados de atualização inválidos" ||
        err.message === "Informe apenas nome, nascimento, animal e/ou dono para atualizar" ||
        err.message === "Nome deve conter apenas letras e espaços e não pode ser vazio" ||
        err.message === "Data de nascimento inválida ou futura" ||
        err.message === "Informe a espécie e a raça do animal" ||
        err.message === "A espécie/raça não existe" ||
        err.message === "Informe o nome e o CPF do dono"
      ) {
        return res.status(400).json({ err: err.message })
      }
      if (
        err.message === "O dono não existe" ||
        err.message === "ID do pet inválido" ||
        err.message === "Pet não encontrado"
      ) {
        return res.status(404).json({ err: err.message })
      }
    }
    res.status(500).json({ err: "Erro ao atualizar o pet"})
  }
}

export async function deletarAnimalController(req: Request<{id:string}>, res: Response ) {
  try {
    const id = req.params.id

    await deletarPet(id)

    res.status(204).send()
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return res.status(409).json({ err: "Cadastro duplicado" });
    }
    if (err instanceof Error) {
      if (
        err.message === "ID do pet inválido" ||
        err.message === "Pet não encontrado"
      ) {
        return res.status(404).json({ err: err.message })
      }
    }
    res.status(500).json({ err: "Erro ao deletar pet"})
  }
}
