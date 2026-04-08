"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import { upsertTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { canUserAddTransaction } from "@/app/_data/can-user-add-transaction";

interface UpsertTransactionParams {
  id?: string;
  name: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
}

export const upsertTransaction = async (params: UpsertTransactionParams) => {
  upsertTransactionSchema.parse(params);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const isCreating = !params.id;

  // Enforce free plan limit on the server — cannot be bypassed from the client
  if (isCreating) {
    const userCanAdd = await canUserAddTransaction();
    if (!userCanAdd) {
      throw new Error(
        "Você atingiu o limite de transações do plano gratuito. Atualize para o plano premium.",
      );
    }
  }

  if (!isCreating) {
    const existing = await db.transaction.findFirst({
      where: { id: params.id, userId },
    });
    if (!existing) {
      throw new Error("Transação não encontrada.");
    }
  }

  await db.transaction.upsert({
    update: { ...params, userId },
    create: { ...params, userId },
    where: { id: params.id ?? "" },
  });

  revalidatePath("/transactions");
  revalidatePath("/");
};
