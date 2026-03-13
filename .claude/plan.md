# Plano: Premios Top N + Check-in com Geolocalizacao e Instagram

## FEATURE 1: Premios Top N Configuravel

### 1.1 Atualizar tipos e mock data (`src/lib/mockData.ts`)
- Mudar `Prize.topRank` de `1 | 2 | 3` para `number` (qualquer posicao)
- Adicionar campos: `description?: string`, `emoji?: string`
- Expandir array `prizes` com posicoes 1-5 de exemplo (nao apenas 3)

### 1.2 Redesign Admin Premios (`src/app/admin/prizes/page.tsx`)
- Trocar select de Top 1/2/3 por `<Input type="number" min={1}>` (qualquer posicao)
- Adicionar campo `description` (descricao do premio)
- Adicionar campo `emoji` (emoji do premio, default 🏆)
- Botao "+ Adicionar posicao" que auto-preenche a proxima posicao disponivel
- Tabela com colunas: Posicao | Emoji | Premio | Descricao | Acoes
- Badge com cores por posicao (ouro 1o, prata 2o, bronze 3o, neutro 4+)

### 1.3 Atualizar Admin Ranking (`src/app/admin/ranking/page.tsx`)
- Trocar lookup fixo `prizeTop1/prizeTop2/prizeTop3` por `Map<number, Prize>`
- Grid de premios dinamico (mostra N premios, nao apenas 3)
- Coluna "Premio" na tabela de ranking (mostra emoji+nome se posicao tem premio)

### 1.4 Atualizar User Ranking (`src/app/app/(protected)/ranking/page.tsx`)
- Importar premios (mock) e montar Map por posicao
- Secao "Premios do mes" abaixo do podium mostrando todos os premios
- Indicador de premio na lista completa (emoji ao lado de quem tem premio)
- Destacar premio do usuario se estiver em posicao premiada

---

## FEATURE 2: Check-in com Geolocalizacao + Instagram

### 2.1 Atualizar tipo Bar (`src/lib/mockData.ts`)
- Adicionar campos: `instagramHandle?: string`, `latitude?: number`, `longitude?: number`
- Atualizar array `bars` com dados de exemplo (Instagram e coordenadas de SP)

### 2.2 Atualizar tipo CheckIn (`src/lib/mockData.ts`)
- Adicionar: `userLatitude?: number`, `userLongitude?: number`, `gpsMatchStatus?: "match" | "no_match" | "unavailable"`, `distanceMeters?: number`
- Atualizar array `checkins` com dados GPS de exemplo

### 2.3 Atualizar mockUserData (`src/lib/mockUserData.ts`)
- Adicionar campos GPS ao tipo `UserCheckIn` e `AppBar`
- Atualizar arrays com dados de exemplo

### 2.4 Cadastro de Bar - Instagram e coordenadas (`src/app/admin/bars/new/page.tsx`)
- Campo "Instagram do bar" (placeholder @nomedobar)
- Campos "Latitude" e "Longitude" em grid 2 colunas
- Dica: "Busque as coordenadas no Google Maps"

### 2.5 Lista de Bares Admin (`src/app/admin/bars/page.tsx`)
- Coluna "Instagram" na tabela
- Incluir Instagram no filtro de busca

### 2.6 Utilitario de Geolocalizacao (NOVO: `src/lib/utils/geolocation.ts`)
- `getCurrentPosition()`: Promise wrapping browser Geolocation API
- `calculateDistance()`: formula Haversine (metros)
- `isWithinRange()`: comparar distancia com limite (default 200m)
- Tratamento de erros (GPS negado, timeout, indisponivel)

### 2.7 Novo fluxo de Check-in do usuario (`src/app/app/(protected)/checkin/page.tsx`)
- Adicionar botao "Novo Check-in" no topo da pagina
- Fluxo em etapas (tudo na mesma pagina com scroll):
  - **Selecionar bar**: lista/busca de bares com Instagram visivel
  - **Verificacao GPS**: captura automatica, mostra distancia e status (verde/amarelo/vermelho)
  - **Upload screenshot**: input de arquivo + preview + lembrete "@nomedobar"
  - **Confirmar e enviar**: resumo com bar + GPS + preview da foto
- Cards de GPS status no historico (verde=OK, amarelo=longe, cinza=sem GPS)

### 2.8 Moderacao Admin Check-in (`src/app/admin/checkins/page.tsx`)
- Nova coluna "GPS" na tabela com badge colorido
- No modal de detalhes: secao "Verificacao GPS" com:
  - Status match com cor
  - Distancia em metros
  - Coordenadas (usuario vs bar) para transparencia
  - Instagram esperado do bar vs @ do usuario

### 2.9 Schema SQL (`supabase/schema.sql` + nova migration)
- Tabela bars: `instagram_handle text`, `latitude numeric(10,7)`, `longitude numeric(10,7)`
- Tabela checkins: `user_latitude`, `user_longitude`, `gps_match_status`, `distance_meters`
- Tabela prizes: `description text`, `emoji text default '🏆'`, alterar constraint top_rank para 1-50

---

## Ordem de implementacao
1. Tipos e mock data (1.1, 2.1, 2.2, 2.3)
2. Utilitario geolocation (2.6)
3. Admin bar form + lista (2.4, 2.5)
4. Admin premios (1.2)
5. Admin ranking (1.3)
6. Admin checkins (2.8)
7. User checkin flow (2.7)
8. User ranking (1.4)
9. Schema SQL migration (2.9)
10. Build e teste
