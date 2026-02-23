# Cliente Raiz — Admin Dashboard

Projeto base em **Next.js (App Router) + TypeScript + Tailwind**, com layout de dashboard admin e autenticação mock.

## Requisitos

- Node.js 18+

## Como rodar

```bash
npm install
npm run dev
```

Acesse:

- `/login`
- `/admin`

## Autenticação (mock)

- A página `/login` salva um token mock no `localStorage`.
- Rotas `/admin/*` são protegidas **client-side** via `AuthGuard`.

Arquivos:

- `src/lib/auth.ts`

## Mock data

Dados mockados em:

- `src/lib/mockData.ts` (`bars[]`, `users[]`, `receipts[]`)

## Rotas

- `/login`
- `/admin` (home)
- `/admin/bars`
- `/admin/bars/new`
- `/admin/users`
- `/admin/users/new`
- `/admin/ranking`
- `/admin/receipts`
- `/admin/social`
- `/admin/routes`
- `/admin/prizes`
- `/admin/minimum-spend`
