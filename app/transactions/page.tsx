import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transactionColumns } from "./_columns";
import AddTransactionButton from "../_components/add-transaction-button";
import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "../_components/ui/scroll-area";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";

const PAGE_SIZE = 50;

interface TransactionsPageProps {
  searchParams: { page?: string };
}

const TransactionsPage = async ({
  searchParams: { page },
}: TransactionsPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const currentPage = Math.max(1, parseInt(page ?? "1"));
  const skip = (currentPage - 1) * PAGE_SIZE;

  const [transactions, totalCount, userCanAddTransaction] = await Promise.all([
    db.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: PAGE_SIZE,
      skip,
    }),
    db.transaction.count({ where: { userId } }),
    canUserAddTransaction(),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <>
      <Navbar />
      <div className="space-y-6 overflow-hidden p-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
        </div>
        <ScrollArea>
          <DataTable columns={transactionColumns} data={transactions} />
        </ScrollArea>
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {skip + 1}–{Math.min(skip + PAGE_SIZE, totalCount)} de{" "}
              {totalCount} transações
            </span>
            <div className="flex gap-2">
              {currentPage > 1 && (
                <a
                  href={`/transactions?page=${currentPage - 1}`}
                  className="rounded border border-solid px-3 py-1 hover:bg-muted"
                >
                  Anterior
                </a>
              )}
              {currentPage < totalPages && (
                <a
                  href={`/transactions?page=${currentPage + 1}`}
                  className="rounded border border-solid px-3 py-1 hover:bg-muted"
                >
                  Próxima
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TransactionsPage;
