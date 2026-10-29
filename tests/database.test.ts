import { afterEach, expect, it, vi } from "vitest";
vi.mock("mongoose", () => ({ default: { connect: vi.fn() } }));
import mongoose from "mongoose";
import { conectarBanco } from "../src/db/database";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.resetAllMocks();
});

it("exige MONGO_URI antes de tentar conexão", async () => {
  vi.stubEnv("MONGO_URI", "");
  await expect(conectarBanco()).rejects.toThrow("MONGO_URI");
  expect(mongoose.connect).not.toHaveBeenCalled();
});
it("conecta usando a URI configurada", async () => {
  vi.stubEnv("MONGO_URI", "mongodb://127.0.0.1:27017/exemplo_test");
  vi.spyOn(console, "log").mockImplementation(() => {});
  await conectarBanco();
  expect(mongoose.connect).toHaveBeenCalledWith("mongodb://127.0.0.1:27017/exemplo_test");
});
it("propaga a falha de conexão para a inicialização do servidor", async () => {
  vi.stubEnv("MONGO_URI", "mongodb://127.0.0.1:27017/exemplo_test");
  vi.mocked(mongoose.connect).mockRejectedValue(new Error("Conexão recusada"));
  await expect(conectarBanco()).rejects.toThrow("Conexão recusada");
});
