"use client";

import { TrashIcon } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog";
import { deleteTransaction } from "@/app/_actions/delete-transaction";
import { toast } from "sonner";

interface DeleteTransactionButtonProps {
  transactionId: string;
}

const DeleteTransactionButton = ({
  transactionId,
}: DeleteTransactionButtonProps) => {
  const handleConfirmDelete = async () => {
    try {
      await deleteTransaction(transactionId);
      toast.success("Transação excluída com sucesso.");
    } catch {
      toast.error("Erro ao excluir transação.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          aria-label="Excluir transação"
        >
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir transação</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta transação? Esta ação não pode
            ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete}>
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTransactionButton;
