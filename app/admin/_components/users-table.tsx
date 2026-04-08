"use client";

import { useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { setUserPlan } from "../_actions/manage-plan";
import { toast } from "sonner";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  plan: "premium" | null;
  createdAt: Date;
  transactionCount: number;
}

interface UsersTableProps {
  users: UserRow[];
}

const UsersTable = ({ users }: UsersTableProps) => {
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSetPlan = (userId: string, plan: "premium" | null) => {
    setLoadingUserId(userId);
    startTransition(async () => {
      try {
        await setUserPlan(userId, plan);
        toast.success(
          plan === "premium"
            ? "Usuário promovido a Premium."
            : "Plano Premium removido.",
        );
      } catch (error) {
        console.error("Erro ao atualizar plano:", error);
        toast.error("Erro ao atualizar plano. Tente novamente.");
      } finally {
        setLoadingUserId(null);
      }
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Plano</TableHead>
          <TableHead>Cadastro</TableHead>
          <TableHead className="text-right">Transações</TableHead>
          <TableHead className="text-right">Ação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const isPremium = user.plan === "premium";
          const isLoading = loadingUserId === user.id && isPending;

          return (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell>
                {isPremium ? (
                  <Badge className="bg-green-500 text-white hover:bg-green-500/80">
                    Premium
                  </Badge>
                ) : (
                  <Badge variant="secondary">Free</Badge>
                )}
              </TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell className="text-right">
                {user.transactionCount}
              </TableCell>
              <TableCell className="text-right">
                {isPremium ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => handleSetPlan(user.id, null)}
                  >
                    {isLoading ? "Removendo..." : "Remover Premium"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={isLoading}
                    onClick={() => handleSetPlan(user.id, "premium")}
                  >
                    {isLoading ? "Promovendo..." : "Promover a Premium"}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}

        {users.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={6}
              className="py-8 text-center text-muted-foreground"
            >
              Nenhum usuário encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
