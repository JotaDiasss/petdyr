import type { IAnimal } from "../interfaces/animal.interface";
import { Animal } from "../models/animal.model";

export async function criarAnimal(dados: IAnimal) {
  return await Animal.create(dados);
}
