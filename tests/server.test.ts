import { afterEach, beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  listen: vi.fn(),
  conectarBanco: vi.fn(),
}));
vi.mock("../src/app", () => ({ default: { listen: mocks.listen } }));
vi.mock("../src/db/database.js", () => ({ conectarBanco: mocks.conectarBanco }));
vi.mock("dotenv/config", () => ({}));

beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
  vi.stubEnv("PORT", "8080");
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

it("inicia HTTP somente depois de conectar ao banco", async () => {
  let liberar!: () => void;
  mocks.conectarBanco.mockImplementation(() => new Promise<void>((resolve) => { liberar = resolve; }));
  mocks.listen.mockImplementation((_port: string, callback: () => void) => callback());
  await import("../src/server");
  expect(mocks.listen).not.toHaveBeenCalled();
  liberar();
  await vi.waitFor(() => expect(mocks.listen).toHaveBeenCalledWith("8080", expect.any(Function)));
  expect(console.log).toHaveBeenCalledWith("servidor rodando em http://localhost:8080");
});

it("encerra com código 1 sem abrir HTTP quando a conexão falha", async () => {
  mocks.conectarBanco.mockRejectedValue(new Error("Conexão recusada"));
  const exit = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
  await import("../src/server");
  await vi.waitFor(() => expect(exit).toHaveBeenCalledWith(1));
  expect(mocks.listen).not.toHaveBeenCalled();
  expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Conexão recusada"));
});
