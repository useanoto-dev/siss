import { auth, clerkClient } from "@clerk/nextjs/server";
import Navbar from "../_components/navbar";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "../_components/ui/card";
import { CheckIcon, XIcon } from "lucide-react";
import AcquirePlanButton from "./_components/acquire-plan-button";
import { Badge } from "../_components/ui/badge";
import { getCurrentMonthTransactions } from "../_data/get-current-month-transactions";

const SubscriptionPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }
  const user = await clerkClient().users.getUser(userId);
  const currentMonthTransactions = await getCurrentMonthTransactions();
  const hasPremiumPlan = user.publicMetadata.subscriptionPlan === "premium";
  return (
    <>
      <Navbar />
      <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
        <h1 className="text-2xl font-bold">Assinatura</h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:max-w-3xl">
          <Card>
            <CardHeader className="border-b border-solid py-6 sm:py-8">
              <h2 className="text-center text-xl font-semibold sm:text-2xl">
                Plano Básico
              </h2>
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-3xl sm:text-4xl">R$</span>
                <span className="text-5xl font-semibold sm:text-6xl">0</span>
                <div className="text-xl text-muted-foreground sm:text-2xl">
                  /mês
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 py-6 sm:space-y-6 sm:py-8">
              <div className="flex items-center gap-2">
                <CheckIcon className="shrink-0 text-primary" />
                <p className="text-sm sm:text-base">
                  Apenas 10 transações por mês ({currentMonthTransactions}/10)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <XIcon className="shrink-0" />
                <p className="text-sm sm:text-base">Relatórios de IA</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="relative border-b border-solid py-6 sm:py-8">
              {hasPremiumPlan && (
                <Badge className="absolute left-4 top-4 bg-primary/10 text-primary">
                  Ativo
                </Badge>
              )}
              <h2 className="text-center text-xl font-semibold sm:text-2xl">
                Plano Premium
              </h2>
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-3xl sm:text-4xl">R$</span>
                <span className="text-5xl font-semibold sm:text-6xl">19</span>
                <div className="text-xl text-muted-foreground sm:text-2xl">
                  /mês
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 py-6 sm:space-y-6 sm:py-8">
              <div className="flex items-center gap-2">
                <CheckIcon className="shrink-0 text-primary" />
                <p className="text-sm sm:text-base">Transações ilimitadas</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="shrink-0 text-primary" />
                <p className="text-sm sm:text-base">Relatórios de IA</p>
              </div>
              <AcquirePlanButton />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;
