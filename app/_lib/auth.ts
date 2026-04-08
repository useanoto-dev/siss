import { cache } from "react";
import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * Cached per-request Clerk user fetch.
 * Multiple calls within the same RSC render resolve from cache — only 1 API call.
 */
export const getCurrentUser = cache(async () => {
  const { userId } = await auth();
  if (!userId) return null;
  return clerkClient().users.getUser(userId);
});
