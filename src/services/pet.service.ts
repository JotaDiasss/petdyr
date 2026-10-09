import type { IPet } from "../interfaces/pet.interface";
import { Animal } from "../models/animal.model";
import { Pet } from "../models/pet.model";

export class PetService {
    static async criarPet(dados: IPet) {
        if (dados.nome === "" || dados.nome.trim() === "") {
            throw new Error("Nome é obrigatorio")
        }

        if (!/^[a-zA-Z\s]+$/.test(dados.nome)) {
            throw new Error("Nome deve conter apenas letras e espaços")
        }

        if (!Number.isFinite(dados.idade)) {
            throw new Error("idade deve conter apenas numeros")
        }

        const animaValido = await Animal.exists ({
            especie: dados.animal.especie,
            racas: dados.animal.raca,
        });
        if (!animaValido) {
            throw new Error("Espécie ou raça inválida")
        };

        return await Pet.create(dados);
    };
};
