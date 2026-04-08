import { describe, it, expect } from "vitest";
import { startOfMonth, endOfMonth } from "date-fns";

// Testa a lógica de cálculo de intervalo de datas do dashboard
// (extraída para teste sem depender do banco)
function buildDateRange(month: string) {
  const currentYear = new Date().getFullYear();
  const monthDate = new Date(currentYear, parseInt(month) - 1, 1);
  return {
    gte: startOfMonth(monthDate),
    lte: endOfMonth(monthDate),
  };
}

describe("buildDateRange (lógica de filtro do dashboard)", () => {
  it("usa o ano atual, não 2024", () => {
    const { gte } = buildDateRange("04");
    expect(gte.getFullYear()).toBe(new Date().getFullYear());
  });

  it("mês 01 começa em 1º de janeiro", () => {
    const { gte } = buildDateRange("01");
    expect(gte.getMonth()).toBe(0);
    expect(gte.getDate()).toBe(1);
  });

  it("mês 02 termina no último dia correto (28 ou 29)", () => {
    const { lte } = buildDateRange("02");
    const year = new Date().getFullYear();
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    expect(lte.getDate()).toBe(isLeap ? 29 : 28);
  });

  it("mês 12 termina no dia 31", () => {
    const { lte } = buildDateRange("12");
    expect(lte.getDate()).toBe(31);
  });

  it("intervalo gte <= lte", () => {
    const { gte, lte } = buildDateRange("06");
    expect(gte.getTime()).toBeLessThanOrEqual(lte.getTime());
  });
});
