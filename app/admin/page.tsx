import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/app/_lib/prisma";
import UsersTable, { UserRow } from "./_components/users-table";

const AdminPage = async () => {
  // Fetch users from Clerk
  const clerkUsers = await clerkClient().users.getUserList({ limit: 100 });

  // Aggregate transaction counts per userId from the database
  const transactionCounts = await db.transaction.groupBy({
    by: ["userId"],
    _count: { id: true },
  });

  const countByUserId = new Map(
    transactionCounts.map((row) => [row.userId, row._count.id]),
  );

  const users: UserRow[] = clerkUsers.data.map((user) => {
    const primaryEmail =
      user.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId,
      )?.emailAddress ?? "—";

    const plan =
      user.publicMetadata?.subscriptionPlan === "premium" ? "premium" : null;

    return {
      id: user.id,
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "—",
      email: primaryEmail,
      plan,
      createdAt: new Date(user.createdAt),
      transactionCount: countByUserId.get(user.id) ?? 0,
    };
  });

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">Administração</h1>
        <p className="text-muted-foreground">
          Gerencie os usuários e planos do Vaultly.
        </p>
      </div>

      <div className="rounded-lg border">
        <div className="border-b px-4 py-4 sm:px-6">
          <h2 className="font-semibold">
            Usuários{" "}
            <span className="text-muted-foreground">
              ({clerkUsers.data.length})
            </span>
          </h2>
        </div>
        <div className="overflow-x-auto p-2">
          <UsersTable users={users} />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
