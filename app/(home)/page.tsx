import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import { isMatch } from "date-fns";
import TransactionsPieChart from "./_components/transactions-pie-chart";
import { getDashboard } from "../_data/get-dashboard";
import ExpensesPerCategory from "./_components/expenses-per-category";
import LastTransactions from "./_components/last-transactions";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import AiReportButton from "./_components/ai-report-button";
import { getCurrentUser } from "../_lib/auth";

interface HomeProps {
  searchParams: {
    month: string;
  };
}

const Home = async ({ searchParams: { month } }: HomeProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }
  const monthIsInvalid = !month || !isMatch(month, "MM");
  if (monthIsInvalid) {
    redirect(`?month=${String(new Date().getMonth() + 1).padStart(2, "0")}`);
  }

  // Run dashboard data + user check in parallel; getCurrentUser is cached so
  // canUserAddTransaction (called inside) reuses the same Clerk API response.
  const [dashboard, userCanAddTransaction, user] = await Promise.all([
    getDashboard(month),
    canUserAddTransaction(),
    getCurrentUser(),
  ]);

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col space-y-4 overflow-auto p-4 sm:space-y-6 sm:p-6 lg:h-full lg:overflow-hidden">
        {/* Header: título + ações */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <AiReportButton
              month={month}
              hasPremiumPlan={
                user.publicMetadata.subscriptionPlan === "premium"
              }
            />
            <TimeSelect />
          </div>
        </div>
        {/* Grid principal: 1 coluna mobile, 2 colunas em lg */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:h-full lg:grid-cols-[2fr,1fr] lg:overflow-hidden">
          <div className="flex flex-col gap-4 sm:gap-6 lg:overflow-hidden">
            <SummaryCards
              month={month}
              {...dashboard}
              userCanAddTransaction={userCanAddTransaction}
            />
            {/* Pie chart + categorias: empilha em mobile, lado a lado em sm, 3 colunas em lg */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:h-full lg:grid-cols-3 lg:overflow-hidden">
              <TransactionsPieChart {...dashboard} />
              <ExpensesPerCategory
                expensesPerCategory={dashboard.totalExpensePerCategory}
              />
            </div>
          </div>
          <LastTransactions lastTransactions={dashboard.lastTransactions} />
        </div>
      </div>
    </>
  );
};

export default Home;
