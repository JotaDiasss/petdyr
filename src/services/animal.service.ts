import type { IAnimal } from "../interfaces/animal.interface";
import { Animal } from "../models/animal.model"

export class AnimalService {
    static async criarAnimal(dados:IAnimal) {
        return await Animal.create(dados);
    };
};
