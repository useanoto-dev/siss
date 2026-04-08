"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const assertAdmin = async (): Promise<void> => {
  const { userId } = await auth();
  const adminUserId = process.env.ADMIN_USER_ID;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!adminUserId || userId !== adminUserId) {
    throw new Error("Forbidden: acesso restrito a administradores.");
  }
};

export const setUserPlan = async (
  targetUserId: string,
  plan: "premium" | null,
): Promise<void> => {
  await assertAdmin();

  await clerkClient().users.updateUser(targetUserId, {
    publicMetadata: {
      subscriptionPlan: plan ?? undefined,
    },
  });

  revalidatePath("/admin");
};
