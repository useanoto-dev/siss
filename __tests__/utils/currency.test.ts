import { describe, it, expect } from "vitest";
import { formatCurrency } from "@/app/_utils/currency";

describe("formatCurrency", () => {
  it("formata valor inteiro em BRL", () => {
    expect(formatCurrency(1000)).toBe("R$\u00a01.000,00");
  });

  it("formata valor com centavos", () => {
    expect(formatCurrency(19.99)).toBe("R$\u00a019,99");
  });

  it("formata zero", () => {
    expect(formatCurrency(0)).toBe("R$\u00a00,00");
  });

  it("formata valor negativo", () => {
    expect(formatCurrency(-500)).toBe("-R$\u00a0500,00");
  });

  it("formata valor grande", () => {
    expect(formatCurrency(1234567.89)).toBe("R$\u00a01.234.567,89");
  });
});
