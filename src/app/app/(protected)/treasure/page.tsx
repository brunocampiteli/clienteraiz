import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { treasureMissions } from "@/lib/mockUserData";

export default function AppTreasurePage() {
  return (
    <div className="space-y-4">
      <Card>
        <div className="text-sm font-semibold text-cr-brown-900">Caça ao tesouro</div>
        <div className="mt-2 text-sm text-cr-brown-600">
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
                  <div className="text-sm font-semibold text-cr-brown-900">{m.title}</div>
                  <div className="mt-1 text-sm text-cr-brown-600">{m.description}</div>
                </div>
                <Badge variant="neutral">
                  {m.progress}/{m.total}
                </Badge>
              </div>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-cr-cream-200">
                <div className="h-full rounded-full bg-gradient-to-r from-cr-green-700 to-cr-gold-500 transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-2 text-xs text-cr-brown-400">{pct}%</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
