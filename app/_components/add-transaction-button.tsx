"use client";

import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import UpsertTransactionDialog from "./upsert-transaction-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface AddTransactionButtonProps {
  userCanAddTransaction?: boolean;
}

const AddTransactionButton = ({
  userCanAddTransaction,
}: AddTransactionButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <div className="flex w-full flex-col gap-1 sm:w-auto sm:items-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="w-full rounded-full font-bold sm:w-auto"
                onClick={() => setDialogIsOpen(true)}
                disabled={!userCanAddTransaction}
              >
                Adicionar transação
                <ArrowDownUpIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {!userCanAddTransaction &&
                "Você atingiu o limite de transações. Atualize seu plano para criar transações ilimitadas."}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {!userCanAddTransaction && (
          <p className="text-xs text-muted-foreground md:hidden">
            Limite atingido. Atualize seu plano.
          </p>
        )}
      </div>
      <UpsertTransactionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </>
  );
};

export default AddTransactionButton;
