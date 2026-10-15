import { Schema, model } from "mongoose";
import type { IDono } from "../interfaces/dono.interface";

const donoSchema = new Schema<IDono>({
  nome: {
    type: String,
    required: true,
  },
  cpf: {
    type: Number,
    required: true,
    unique: true,
  },
});

export const Dono = model<IDono>("Dono", donoSchema);
