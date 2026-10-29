import { Schema, model } from "mongoose";
import type { IAnimal } from "../../interfaces/animal.interface";

const animalSchema = new Schema<IAnimal> ({
    especie: {
        type: String,
        required: true,
        unique: true
    },
    racas: {
        type: [String],
        default: []
    }
});

export const Animal = model<IAnimal>("Animal", animalSchema);