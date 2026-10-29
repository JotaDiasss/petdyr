import { Schema, model } from "mongoose";
import type { IPet } from "../../interfaces/pet.interface";

const petSchema = new Schema<IPet>({
  nome: {
    type: String,
    required: true,
  },
  nascimento: {
    type: Date,
    require: true,
  },
  animal: {
    especie: {
      type: String,
      required: true,
    },
    raca: {
      type: String,
      required: true,
    },
  },
  dono: {
    nome: {
      type: String,
      required: true,
    },
    cpf: {
      type: String,
      required: true,
      unique: true,
    },
  },
});

export const Pet = model<IPet>("Pet", petSchema);
