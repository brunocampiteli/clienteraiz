"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { clearUserToken } from "@/lib/auth";
import { currentUser, achievements } from "@/lib/mockUserData";

function IconLogout(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  );
}

export default function AppProfilePage() {
  const router = useRouter();

  function logout() {
    clearUserToken();
    router.replace("/app/login");
  }

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const progressPct = Math.round((currentUser.pointsTotal / currentUser.nextLevelPoints) * 100);

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="overflow-hidden rounded-2xl bg-cr-dark-800 p-5 text-white text-center shadow-lg relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-cr-yellow-600/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cr-burgundy-800/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <div
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold text-cr-dark-800 shadow-lg ring-4 ring-cr-yellow-600/30"
            style={{ background: "#FBC02D" }}
          >
            {currentUser.name.charAt(0)}
          </div>
          <div className="mt-3 text-2xl font-display text-cr-cream-100 tracking-wider">{currentUser.name.toUpperCase()}</div>
          <div className="mt-0.5 text-sm text-cr-dark-400">{currentUser.email}</div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-cr-dark-700 px-4 py-1.5">
            <span className="text-sm">⭐</span>
            <span className="text-sm font-display text-cr-yellow-600 tracking-wider">{currentUser.level.toUpperCase()}</span>
          </div>

          {/* Level Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1 text-xs text-cr-dark-400">
              <span className="uppercase tracking-wider">{currentUser.level}</span>
              <span className="uppercase tracking-wider">{currentUser.nextLevel}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-cr-dark-600">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cr-yellow-600 to-cr-green-600"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="mt-1 text-[11px] text-cr-dark-400">
              {currentUser.pointsTotal.toLocaleString()} / {currentUser.nextLevelPoints.toLocaleString()} pontos
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-2xl border border-cr-dark-200 bg-white p-3 text-center shadow-sm">
          <div className="text-lg font-display text-cr-dark-800 tracking-wider">{currentUser.pointsTotal.toLocaleString()}</div>
          <div className="text-[9px] text-cr-dark-400 mt-0.5 font-bold uppercase tracking-wider">Pontos</div>
        </div>
        <div className="rounded-2xl border border-cr-dark-200 bg-white p-3 text-center shadow-sm">
          <div className="text-lg font-display text-cr-dark-800 tracking-wider">{currentUser.barsVisited}</div>
          <div className="text-[9px] text-cr-dark-400 mt-0.5 font-bold uppercase tracking-wider">Bares</div>
        </div>
        <div className="rounded-2xl border border-cr-dark-200 bg-white p-3 text-center shadow-sm">
          <div className="text-lg font-display text-cr-dark-800 tracking-wider">{currentUser.receiptsApproved}</div>
          <div className="text-[9px] text-cr-dark-400 mt-0.5 font-bold uppercase tracking-wider">Notas</div>
        </div>
        <div className="rounded-2xl border border-cr-dark-200 bg-white p-3 text-center shadow-sm">
          <div className="text-lg font-display text-cr-dark-800 tracking-wider">#7</div>
          <div className="text-[9px] text-cr-dark-400 mt-0.5 font-bold uppercase tracking-wider">Ranking</div>
        </div>
      </div>

      {/* Personal Info */}
      <Card>
        <div className="text-base font-display text-cr-dark-800 tracking-wider mb-3">INFORMACOES PESSOAIS</div>
        <div className="space-y-0">
          <div className="flex items-center justify-between py-2.5 border-b border-cr-dark-100">
            <div className="text-xs text-cr-dark-400 font-bold uppercase tracking-wider">Nome</div>
            <div className="text-sm font-semibold text-cr-dark-800">{currentUser.name}</div>
          </div>
          <div className="flex items-center justify-between py-2.5 border-b border-cr-dark-100">
            <div className="text-xs text-cr-dark-400 font-bold uppercase tracking-wider">E-mail</div>
            <div className="text-sm font-semibold text-cr-dark-800">{currentUser.email}</div>
          </div>
          <div className="flex items-center justify-between py-2.5 border-b border-cr-dark-100">
            <div className="text-xs text-cr-dark-400 font-bold uppercase tracking-wider">Telefone</div>
            <div className="text-sm font-semibold text-cr-dark-800">{currentUser.phone}</div>
          </div>
          <div className="flex items-center justify-between py-2.5 border-b border-cr-dark-100">
            <div className="text-xs text-cr-dark-400 font-bold uppercase tracking-wider">Cidade</div>
            <div className="text-sm font-semibold text-cr-dark-800">{currentUser.city}</div>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <div className="text-xs text-cr-dark-400 font-bold uppercase tracking-wider">Membro desde</div>
            <div className="text-sm font-semibold text-cr-dark-800">
              {new Date(currentUser.memberSince).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
            </div>
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-base font-display text-cr-dark-800 tracking-wider">CONQUISTAS</div>
          <Badge variant="gold">{unlockedCount}/{achievements.length}</Badge>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={[
                "rounded-2xl border p-3 text-center transition-all",
                a.unlocked
                  ? "border-cr-yellow-300 bg-white shadow-sm"
                  : "border-cr-dark-200 bg-cr-dark-50 opacity-50",
              ].join(" ")}
            >
              <div className="text-2xl">{a.emoji}</div>
              <div className="mt-1 text-[11px] font-bold text-cr-dark-700 leading-tight">{a.title}</div>
              {a.unlocked && a.date && (
                <div className="mt-0.5 text-[9px] text-cr-dark-400">
                  {new Date(a.date).toLocaleDateString("pt-BR")}
                </div>
              )}
              {!a.unlocked && (
                <div className="mt-0.5 text-[9px] text-cr-dark-400 uppercase tracking-wider">Bloqueado</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-cr-burgundy-300 bg-cr-burgundy-50 px-4 py-3 text-sm font-bold text-cr-burgundy-800 transition-all hover:bg-cr-burgundy-100 cursor-pointer uppercase tracking-wider"
      >
        <IconLogout className="h-4 w-4" />
        Sair da conta
      </button>

      <div className="h-2" />
    </div>
  );
}
