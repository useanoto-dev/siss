import AddTransactionButton from "@/app/_components/add-transaction-button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
  size?: "small" | "large";
  userCanAddTransaction?: boolean;
}

const SummaryCard = ({
  icon,
  title,
  amount,
  size = "small",
  userCanAddTransaction,
}: SummaryCardProps) => {
  return (
    <Card>
      <CardHeader
        className={`flex-row items-center gap-4 ${size === "small" ? "p-4 sm:p-6" : ""}`}
      >
        {icon}
        <p
          className={`${size === "small" ? "text-muted-foreground" : "text-white opacity-70"}`}
        >
          {title}
        </p>
      </CardHeader>
      <CardContent
        className={
          size === "large"
            ? "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            : "p-4 pt-0 sm:p-6 sm:pt-0"
        }
      >
        <p
          className={`font-bold ${size === "small" ? "text-xl sm:text-2xl" : "text-3xl sm:text-4xl"}`}
        >
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(amount)}
        </p>

        {size === "large" && (
          <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
