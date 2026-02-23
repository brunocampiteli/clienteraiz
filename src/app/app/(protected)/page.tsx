import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { currentUser, bars as appBars } from "@/lib/mockUserData";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function AppHomePage() {
  const recommended = appBars.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="text-sm font-medium text-zinc-600">Seus pontos</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
            {currentUser.pointsTotal}
          </div>
          <div className="mt-1 text-xs text-zinc-500">Total acumulado (mock)</div>
        </Card>

        <Card>
          <div className="text-sm font-medium text-zinc-600">Nível atual</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
            {currentUser.level}
          </div>
          <div className="mt-1 text-xs text-zinc-500">Evolua pontuando nos bares</div>
        </Card>
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-zinc-900">Próximos bares recomendados</div>
            <div className="mt-1 text-xs text-zinc-500">Mock (3 itens)</div>
          </div>
          <Link href="/app/bars">
            <Button variant="secondary">Ver todos</Button>
          </Link>
        </div>

        <div className="space-y-3">
          {recommended.map((b) => (
            <div key={b.id} className="rounded-xl border border-zinc-200 bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-zinc-900">{b.name}</div>
                  <div className="mt-1 text-xs text-zinc-500">
                    {b.neighborhood} • {b.city} • {b.distanceKm.toFixed(1)} km
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-500">Consumo mínimo</div>
                  <div className="text-sm font-semibold text-zinc-900">{formatCurrency(b.minimumSpend)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-zinc-900">Ver rotas prontas</div>
            <div className="mt-1 text-xs text-zinc-500">Rotas para pontuar mais rápido</div>
          </div>
          <Link href="/app/routes">
            <Button>Ver</Button>
          </Link>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-zinc-900">Caça ao tesouro</div>
            <div className="mt-1 text-xs text-zinc-500">Missões e progresso (mock)</div>
          </div>
          <Link href="/app/treasure">
            <Button>Jogar</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
