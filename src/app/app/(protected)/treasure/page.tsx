import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { treasureMissions } from "@/lib/mockUserData";

export default function AppTreasurePage() {
  return (
    <div className="space-y-4">
      <Card>
        <div className="text-sm font-semibold text-zinc-900">Caça ao tesouro</div>
        <div className="mt-2 text-sm text-zinc-700">
          Complete missões para ganhar bônus e evoluir no Cliente Raiz. (mock)
        </div>
      </Card>

      <div className="space-y-3">
        {treasureMissions.map((m) => {
          const pct = Math.round((m.progress / m.total) * 100);
          return (
            <Card key={m.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-zinc-900">{m.title}</div>
                  <div className="mt-1 text-sm text-zinc-600">{m.description}</div>
                </div>
                <Badge variant="neutral">
                  {m.progress}/{m.total}
                </Badge>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                <div className="h-full bg-zinc-900" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-2 text-xs text-zinc-500">{pct}%</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
