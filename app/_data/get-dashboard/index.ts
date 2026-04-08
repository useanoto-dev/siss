import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";
import { TotalExpensePerCategory, TransactionPercentagePerType } from "./types";
import { auth } from "@clerk/nextjs/server";
import { endOfMonth, startOfMonth } from "date-fns";

export const getDashboard = async (month: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const currentYear = new Date().getFullYear();
  const monthDate = new Date(currentYear, parseInt(month) - 1, 1);
  const where = {
    userId,
    date: {
      gte: startOfMonth(monthDate),
      lte: endOfMonth(monthDate),
    },
  };

  // Run all 5 queries in parallel instead of sequentially
  const [
    depositsSumResult,
    investmentsSumResult,
    expensesSumResult,
    expensesByCategory,
    lastTransactions,
  ] = await Promise.all([
    db.transaction.aggregate({
      where: { ...where, type: "DEPOSIT" },
      _sum: { amount: true },
    }),
    db.transaction.aggregate({
      where: { ...where, type: "INVESTMENT" },
      _sum: { amount: true },
    }),
    db.transaction.aggregate({
      where: { ...where, type: "EXPENSE" },
      _sum: { amount: true },
    }),
    db.transaction.groupBy({
      by: ["category"],
      where: { ...where, type: TransactionType.EXPENSE },
      _sum: { amount: true },
    }),
    db.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      take: 15,
    }),
  ]);

  const depositsTotal = Number(depositsSumResult._sum.amount ?? 0);
  const investmentsTotal = Number(investmentsSumResult._sum.amount ?? 0);
  const expensesTotal = Number(expensesSumResult._sum.amount ?? 0);
  const balance = depositsTotal - investmentsTotal - expensesTotal;

  // Computed from existing data — no extra DB round trip needed
  const transactionsTotal = depositsTotal + investmentsTotal + expensesTotal;

  // Guard: avoid NaN when there are no transactions in the selected month
  const safeTotal = transactionsTotal === 0 ? 1 : transactionsTotal;
  const typesPercentage: TransactionPercentagePerType = {
    [TransactionType.DEPOSIT]: Math.round(
      (depositsTotal / safeTotal) * 100,
    ),
    [TransactionType.EXPENSE]: Math.round(
      (expensesTotal / safeTotal) * 100,
    ),
    [TransactionType.INVESTMENT]: Math.round(
      (investmentsTotal / safeTotal) * 100,
    ),
  };

  const safeExpensesTotal = expensesTotal === 0 ? 1 : expensesTotal;
  const totalExpensePerCategory: TotalExpensePerCategory[] = expensesByCategory.map(
    (category) => ({
      category: category.category,
      totalAmount: Number(category._sum.amount),
      percentageOfTotal: Math.round(
        (Number(category._sum.amount) / safeExpensesTotal) * 100,
      ),
    }),
  );

  return {
    balance,
    depositsTotal,
    investmentsTotal,
    expensesTotal,
    typesPercentage,
    totalExpensePerCategory,
    lastTransactions,
  };
};
