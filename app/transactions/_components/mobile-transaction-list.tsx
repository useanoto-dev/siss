import { Transaction, TransactionType } from "@prisma/client";
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_LABELS,
} from "@/app/_constants/transactions";
import EditTransactionButton from "./edit-transaction-button";
import DeleteTransactionButton from "./delete-transaction-button";

const BRL_FORMATTER = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface MobileTransactionListProps {
  transactions: Transaction[];
}

const MobileTransactionList = ({
  transactions,
}: MobileTransactionListProps) => {
  if (transactions.length === 0) {
    return (
      <div className="rounded-md border">
        <p className="py-12 text-center text-sm text-muted-foreground">
          Nenhuma transação encontrada.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      {transactions.map((transaction) => {
        const isDeposit = transaction.type === TransactionType.DEPOSIT;
        const isExpense = transaction.type === TransactionType.EXPENSE;

        const dotColor = isDeposit
          ? "bg-primary"
          : isExpense
            ? "bg-danger"
            : "bg-white";

        const amountColor = isDeposit
          ? "text-primary"
          : isExpense
            ? "text-danger"
            : "text-white";

        const prefix = isDeposit ? "+" : "-";

        return (
          <div
            key={transaction.id}
            className="flex items-center justify-between gap-3 border-b px-4 py-3 last:border-0"
          >
            {/* Esquerda: dot + nome + meta */}
            <div className="flex min-w-0 items-start gap-3">
              <div
                className={`mt-[5px] h-2 w-2 shrink-0 rounded-full ${dotColor}`}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold leading-snug">
                  {transaction.name}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {TRANSACTION_CATEGORY_LABELS[transaction.category]}
                  {" · "}
                  {TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod]}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Direita: valor + ações */}
            <div className="flex shrink-0 flex-col items-end gap-1">
              <p className={`text-sm font-bold tabular-nums ${amountColor}`}>
                {prefix}
                {BRL_FORMATTER.format(Number(transaction.amount))}
              </p>
              <div className="-mr-2 flex">
                <EditTransactionButton transaction={transaction} />
                <DeleteTransactionButton transactionId={transaction.id} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MobileTransactionList;
