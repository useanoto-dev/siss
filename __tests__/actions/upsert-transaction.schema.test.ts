import { describe, it, expect } from "vitest";
import { upsertTransactionSchema } from "@/app/_actions/upsert-transaction/schema";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";

const validTransaction = {
  name: "Salário",
  amount: 5000,
  type: TransactionType.DEPOSIT,
  category: TransactionCategory.SALARY,
  paymentMethod: TransactionPaymentMethod.BANK_TRANSFER,
  date: new Date("2026-04-01"),
};

describe("upsertTransactionSchema", () => {
  it("aceita uma transação válida", () => {
    expect(() => upsertTransactionSchema.parse(validTransaction)).not.toThrow();
  });

  it("rejeita nome vazio", () => {
    expect(() =>
      upsertTransactionSchema.parse({ ...validTransaction, name: "" }),
    ).toThrow();
  });

  it("rejeita nome só com espaços", () => {
    expect(() =>
      upsertTransactionSchema.parse({ ...validTransaction, name: "   " }),
    ).toThrow();
  });

  it("rejeita valor zero", () => {
    expect(() =>
      upsertTransactionSchema.parse({ ...validTransaction, amount: 0 }),
    ).toThrow();
  });

  it("rejeita valor negativo", () => {
    expect(() =>
      upsertTransactionSchema.parse({ ...validTransaction, amount: -100 }),
    ).toThrow();
  });

  it("rejeita tipo inválido", () => {
    expect(() =>
      upsertTransactionSchema.parse({ ...validTransaction, type: "INVALID" }),
    ).toThrow();
  });

  it("rejeita categoria inválida", () => {
    expect(() =>
      upsertTransactionSchema.parse({
        ...validTransaction,
        category: "INVALID",
      }),
    ).toThrow();
  });

  it("rejeita método de pagamento inválido", () => {
    expect(() =>
      upsertTransactionSchema.parse({
        ...validTransaction,
        paymentMethod: "INVALID",
      }),
    ).toThrow();
  });

  it("rejeita data inválida", () => {
    expect(() =>
      upsertTransactionSchema.parse({
        ...validTransaction,
        date: "not-a-date",
      }),
    ).toThrow();
  });
});
