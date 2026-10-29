import { afterEach, describe, expect, it, vi } from "vitest";
import { calcularIdade, dataDeNascimentoValida } from "../src/utils/date.utils";

afterEach(() => vi.useRealTimers());
describe("datas", () => {
  it("calcula idade antes, no dia e depois do aniversário", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 29, 12));
    expect(calcularIdade(new Date(2020, 9, 30))).toBe(5);
    expect(calcularIdade(new Date(2020, 9, 29))).toBe(6);
    expect(calcularIdade(new Date(2020, 8, 29))).toBe(6);
  });
  it("aceita passado e hoje, rejeita futuro, data inválida e outro tipo", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-29T12:00:00Z"));
    expect(dataDeNascimentoValida(new Date("2020-01-01"))).toBe(true);
    expect(dataDeNascimentoValida(new Date("2026-10-29"))).toBe(true);
    expect(dataDeNascimentoValida(new Date("2026-10-30"))).toBe(false);
    expect(dataDeNascimentoValida(new Date("invalida"))).toBe(false);
    expect(dataDeNascimentoValida("2020-01-01" as unknown as Date)).toBe(false);
  });
});
