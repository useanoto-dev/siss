import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transactionColumns } from "./_columns";
import AddTransactionButton from "../_components/add-transaction-button";
import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import MobileTransactionList from "./_components/mobile-transaction-list";
import Link from "next/link";

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
      <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
        </div>
        {/* Mobile: lista de cards */}
        <div className="sm:hidden">
          <MobileTransactionList transactions={transactions} />
        </div>

        {/* Desktop: tabela completa */}
        <div className="hidden overflow-x-auto rounded-md border sm:block">
          <DataTable columns={transactionColumns} data={transactions} />
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {skip + 1}–{Math.min(skip + PAGE_SIZE, totalCount)} de{" "}
              {totalCount} transações
            </span>
            <div className="flex gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/transactions?page=${currentPage - 1}`}
                  className="rounded border border-solid px-3 py-1 hover:bg-muted"
                >
                  Anterior
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={`/transactions?page=${currentPage + 1}`}
                  className="rounded border border-solid px-3 py-1 hover:bg-muted"
                >
                  Próxima
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TransactionsPage;
