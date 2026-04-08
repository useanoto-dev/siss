"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { upsertTransactionSchema, UpsertTransactionParams } from "./schema";
import { revalidatePath } from "next/cache";
import { canUserAddTransaction } from "@/app/_data/can-user-add-transaction";

export const upsertTransaction = async (params: UpsertTransactionParams) => {
  upsertTransactionSchema.parse(params);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const isCreating = !params.id;

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
