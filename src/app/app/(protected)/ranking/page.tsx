import { Card } from "@/components/ui/Card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { ranking } from "@/lib/mockUserData";

export default function AppRankingPage() {
  const current = ranking.find((r) => r.isCurrentUser);

  return (
    <div className="space-y-4">
      {current ? (
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-cr-brown-600">Sua posição</div>
              <div className="mt-1 text-lg font-bold text-cr-brown-900 font-display">#{current.position}</div>
              <div className="mt-1 text-sm text-cr-brown-600">{current.points} pontos</div>
            </div>
            <Badge variant="neutral">Destaque</Badge>
          </div>
        </Card>
      ) : null}

      <Card>
        <div className="mb-3">
          <div className="text-sm font-semibold text-cr-brown-900">Ranking geral</div>
          <div className="mt-1 text-xs text-cr-brown-400">Top 20 (mock)</div>
        </div>

        <Table>
          <THead>
            <TR>
              <TH>#</TH>
              <TH>Usuário</TH>
              <TH>Pontos</TH>
            </TR>
          </THead>
          <TBody>
            {ranking.map((r) => (
              <TR key={r.position} className={r.isCurrentUser ? "bg-cr-cream-100" : undefined}>
                <TD className="whitespace-nowrap">{r.position}</TD>
                <TD className={r.isCurrentUser ? "font-semibold text-cr-brown-900" : undefined}>{r.userName}</TD>
                <TD className="whitespace-nowrap">{r.points}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
