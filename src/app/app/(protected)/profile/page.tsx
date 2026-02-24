"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { clearUserToken } from "@/lib/auth";
import { currentUser } from "@/lib/mockUserData";

export default function AppProfilePage() {
  const router = useRouter();

  function logout() {
    clearUserToken();
    router.replace("/app/login");
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="text-sm font-medium text-cr-brown-600">Nome</div>
        <div className="mt-1 text-base font-bold text-cr-brown-900 font-display">{currentUser.name}</div>

        <div className="mt-4 text-sm font-medium text-cr-brown-600">Telefone</div>
        <div className="mt-1 text-base font-bold text-cr-brown-900 font-display">{currentUser.phone}</div>

        <div className="mt-4 text-sm font-medium text-cr-brown-600">Cidade</div>
        <div className="mt-1 text-base font-bold text-cr-brown-900 font-display">{currentUser.city}</div>
      </Card>

      <Button className="w-full" variant="secondary" onClick={logout} type="button">
        Sair
      </Button>
    </div>
  );
}
