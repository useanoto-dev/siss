"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const planSchema = z.object({
  targetUserId: z.string().min(1),
  plan: z.enum(["premium"]).nullable(),
});

const assertAdmin = async (): Promise<void> => {
  const { userId } = await auth();
  const adminUserId = process.env.ADMIN_USER_ID;

  if (!userId) throw new Error("Unauthorized");
  if (!adminUserId || userId !== adminUserId)
    throw new Error("Forbidden: acesso restrito a administradores.");
};

export const setUserPlan = async (
  targetUserId: string,
  plan: "premium" | null,
): Promise<void> => {
  planSchema.parse({ targetUserId, plan });
  await assertAdmin();

  await clerkClient().users.updateUser(targetUserId, {
    publicMetadata: {
      subscriptionPlan: plan ?? null,
    },
  });

  // Revalida todas as páginas que dependem do plano do usuário
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/subscription");
};
