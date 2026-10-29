import {
  acharTodosAnimais,
  acharAnimalPorId,
  criarAnimal,
  atualizarAnimal,
  deletarAnimal,
} from "../services/animal.service";
import type { Request, Response } from "express";
import type { IAnimal } from "../interfaces/animal.interface";

export async function acharTodosAnimaisController(req: Request, res: Response) {
  try {
    const animais = await acharTodosAnimais();
    res.status(200).json(animais);
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return res.status(409).json({ err: "Cadastro duplicado" });
    }
    res.status(500).json({ err: "Erro ao buscar animais" });
  }
}

export async function acharAnimalPorIdController(req: Request<{ id: string }>, res: Response) {
  try {
    const id = req.params.id;

    const animal = await acharAnimalPorId(id);

    res.status(200).json(animal);
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return res.status(409).json({ err: "Cadastro duplicado" });
    }
    if (err instanceof Error) {
      if (
        err.message === "Animal não encontrado" ||
        err.message === "ID do animal inválido"
      ) {
        return res.status(404).json({ err: err.message });
      }
    }
    res.status(500).json({ err: "Erro ao buscar animal" });
  }
}

export async function criarAnimalController(req: Request, res: Response) {
  try {
    const { especie, racas }: IAnimal = req.body;

    const animal = await criarAnimal({ especie, racas });
    if (!animal) {
      throw new Error("Erro ao criar animal");
    }

    res.status(201).json(animal);
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return res.status(409).json({ err: "Cadastro duplicado" });
    }
    if (err instanceof Error) {
      if (
        err.message === "Espécie é obrigatória" ||
        err.message === "Espécie deve conter apenas letras e espaços" ||
        err.message === "A lista de raças é obrigatória" ||
        err.message === "O animal deve conter pelo menos uma raça" ||
        err.message === "Raça deve ser uma string" ||
        err.message === "Raça deve conter apenas letras e espaços" ||
        err.message === "Nome da raça inválido"
      ) {
        return res.status(400).json({ err: err.message });
      }

      if (
        err.message === "Animal não encontrado" ||
        err.message === "Espécie não encontrada" ||
        err.message === "Raça não encontrada" ||
        err.message === "Erro ao buscar animal" ||
        err.message === "Erro ao buscar espécie" ||
        err.message === "Erro ao buscar raça" ||
        err.message === "ID do animal inválido"
      ) {
        return res.status(404).json({ err: err.message });
      }
    }
    res.status(500).json({ err: "Erro ao criar o animal" });
  }
}

export async function atualizarAnimalController(req: Request<{ id: string }>, res: Response) {
  try {
    const id = req.params.id;
    const { especie, racas }:Partial<IAnimal> = req.body;

    const dados:Partial<IAnimal> = {};

    if (especie !== undefined) {
      dados.especie = especie;
    }

    if (racas !== undefined) {
      dados.racas = racas;
    }

    const animal = await atualizarAnimal(id, dados);

    return res.status(200).json(animal);
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return res.status(409).json({ err: "Cadastro duplicado" });
    }
    if (err instanceof Error) {
      if (
        err.message === "Dados de atualização inválidos" ||
        err.message === "Informe apenas especie e/ou racas para atualizar" ||
        err.message === "Espécie deve conter apenas letras e espaços e não pode ser vazia" ||
        err.message === "Informe pelo menos uma raça" ||
        err.message === "Raça deve conter apenas letras e espaços e não pode ser vazia"
      ) {
        return res.status(400).json({ err: err.message });
      }
      
      if (
        err.message === "Animal não encontrado" ||
        err.message === "Espécie não encontrada" ||
        err.message === "Raça não encontrada" ||
        err.message === "Erro ao buscar animal" ||
        err.message === "Erro ao buscar espécie" ||
        err.message === "Erro ao buscar raça" ||
        err.message === "ID do animal inválido"
      ) {
        return res.status(404).json({ err: err.message });
      }
    }
    return res.status(500).json({ err: "Erro ao editar o animal" })
  }
}

export async function deletarAnimalController(req: Request<{id:string}>, res: Response) {
  try {
    const id = req.params.id
    
    await deletarAnimal(id)

    res.status(204).send()
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return res.status(409).json({ err: "Cadastro duplicado" });
    }
    if (err instanceof Error) {
      if (
        err.message === "Animal não encontrado" ||
        err.message === "ID do animal inválido"
      ) {
        return res.status(404).json({ err: err.message })
      }
    }
    res.status(500).json({ err: "Erro ao deletar professor" })
  }
}
