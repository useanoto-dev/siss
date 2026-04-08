"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteSchema = z.object({
  transactionId: z.string().uuid("ID de transação inválido."),
});

export const deleteTransaction = async (transactionId: string) => {
  deleteSchema.parse({ transactionId });
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  await db.transaction.delete({
    where: { id: transactionId, userId },
  });
  revalidatePath("/transactions");
  revalidatePath("/");
};
