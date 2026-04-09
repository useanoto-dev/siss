import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const TARGET_EMAIL = "dublinclientes@gmail.com";

/**
 * Rota de setup único — promove dublinclientes@gmail.com a premium.
 * Protegida pelo ADMIN_USER_ID como secret.
 *
 * Chamada: GET /api/admin/seed?secret=<ADMIN_USER_ID>
 */
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const adminId = process.env.ADMIN_USER_ID;

  if (!adminId || secret !== adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await clerkClient().users.getUserList({
    emailAddress: [TARGET_EMAIL],
  });

  if (users.data.length === 0) {
    return NextResponse.json(
      { error: `Usuário ${TARGET_EMAIL} não encontrado no Clerk` },
      { status: 404 },
    );
  }

  const user = users.data[0];

  if (user.publicMetadata?.subscriptionPlan === "premium") {
    return NextResponse.json({
      message: `${TARGET_EMAIL} já é premium`,
      userId: user.id,
    });
  }

  await clerkClient().users.updateUser(user.id, {
    publicMetadata: {
      ...user.publicMetadata,
      subscriptionPlan: "premium",
    },
  });

  return NextResponse.json({
    message: `${TARGET_EMAIL} promovido a premium com sucesso`,
    userId: user.id,
  });
}
