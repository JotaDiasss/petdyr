import type { IDono } from "../interfaces/dono.interface";
import { Dono } from "../models/dono.model";

export async function criarDono(dados: IDono) {
  return await Dono.create(dados);
}
