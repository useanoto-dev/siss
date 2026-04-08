import { describe, it, expect } from "vitest";
import { generateAiReportSchema } from "@/app/(home)/_actions/generate-ai-report/schema";

describe("generateAiReportSchema", () => {
  it("aceita meses válidos com zero à esquerda", () => {
    for (let m = 1; m <= 12; m++) {
      const month = String(m).padStart(2, "0");
      expect(() => generateAiReportSchema.parse({ month })).not.toThrow();
    }
  });

  it("rejeita mês sem zero à esquerda", () => {
    expect(() => generateAiReportSchema.parse({ month: "1" })).toThrow();
  });

  it("rejeita mês inválido", () => {
    expect(() => generateAiReportSchema.parse({ month: "13" })).toThrow();
  });

  it("rejeita string arbitrária", () => {
    expect(() => generateAiReportSchema.parse({ month: "ab" })).toThrow();
  });

  it("rejeita campo ausente", () => {
    expect(() => generateAiReportSchema.parse({})).toThrow();
  });
});
