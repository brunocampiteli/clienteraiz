export type Bar = {
  id: string;
  name: string;
  legalName: string;
  cnpj: string;
  city: string;
  state: string;
  neighborhood: string;
  address: string;
  cep: string;
  minimumSpend: number;
  active: boolean;
  instagramHandle?: string;
  latitude?: number;
  longitude?: number;
};

export type User = {
  id: string;
  name: string;
  cpf: string;
  email: string;
  whatsapp: string;
  createdAt: string;
  status: "active" | "blocked";
};

export type Receipt = {
  id: string;
  date: string;
  userName: string;
  barName: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "pending_validation" | "approved_auto" | "rejected_auto" | "needs_review";
  reason?: "DUPLICATE_ACCESS_KEY" | "CNPJ_MISMATCH" | "INVALID_OR_CANCELED" | "PROVIDER_UNAVAILABLE" | "UNREADABLE_QR";
  accessKey?: string;
  barCnpj?: string;
  issuerCnpj?: string;
  imageUrl?: string;
};

export const bars: Bar[] = [
  {
    id: "bar_1",
    name: "Bar do Centro",
    legalName: "Bar do Centro LTDA",
    cnpj: "12.345.678/0001-90",
    city: "São Paulo",
    state: "SP",
    neighborhood: "Centro",
    address: "Av. Principal, 123",
    cep: "01000-000",
    minimumSpend: 50,
    active: true,
    instagramHandle: "@bardocentro",
    latitude: -23.5505,
    longitude: -46.6333,
  },
  {
    id: "bar_2",
    name: "Vila Pub",
    legalName: "Vila Pub Comércio de Bebidas LTDA",
    cnpj: "98.765.432/0001-10",
    city: "Campinas",
    state: "SP",
    neighborhood: "Cambuí",
    address: "Rua das Flores, 55",
    cep: "13000-000",
    minimumSpend: 40,
    active: true,
    instagramHandle: "@vilapub",
    latitude: -22.9099,
    longitude: -47.0626,
  },
  {
    id: "bar_3",
    name: "Boteco da Praça",
    legalName: "Boteco da Praça ME",
    cnpj: "11.222.333/0001-44",
    city: "Rio de Janeiro",
    state: "RJ",
    neighborhood: "Botafogo",
    address: "Praça do Sol, 10",
    cep: "22250-000",
    minimumSpend: 35,
    active: false,
    instagramHandle: "@botecodapraca",
    latitude: -22.9519,
    longitude: -43.1858,
  },
  {
    id: "bar_4",
    name: "Chopp & Cia",
    legalName: "Chopp & Cia Serviços de Alimentação LTDA",
    cnpj: "55.666.777/0001-88",
    city: "Curitiba",
    state: "PR",
    neighborhood: "Batel",
    address: "Alameda Central, 900",
    cep: "80000-000",
    minimumSpend: 60,
    active: true,
    instagramHandle: "@choppecia",
    latitude: -25.4411,
    longitude: -49.2763,
  },
];

export type AdminRankingItem = {
  position: number;
  userName: string;
  points: number;
};

export const adminRanking: AdminRankingItem[] = Array.from({ length: 20 }).map((_, i) => {
  const position = i + 1;
  return {
    position,
    userName: `Usuário ${position}`,
    points: 2500 - position * 70,
  };
});

export const adminRankingByPeriod: Record<string, AdminRankingItem[]> = {
  "2026-01": adminRanking,
  "2025-12": Array.from({ length: 20 }).map((_, i) => {
    const position = i + 1;
    return {
      position,
      userName: `Usuário ${position}`,
      points: 2200 - position * 55,
    };
  }),
};

export function getAdminRanking(period: string): AdminRankingItem[] {
  return adminRankingByPeriod[period] ?? adminRanking;
}

export type Prize = {
  id: string;
  name: string;
  period: string;
  topRank?: number;
  description?: string;
  emoji?: string;
};

export const prizes: Prize[] = [
  { id: "prize_1", name: "Kit Cliente Raiz Premium", period: "2026-01", topRank: 1, emoji: "🏆", description: "Kit completo com camiseta, copo, abridor e boné" },
  { id: "prize_2", name: "Balde de Cerveja Eisenbahn", period: "2026-01", topRank: 2, emoji: "🍺", description: "Balde com 6 cervejas premium" },
  { id: "prize_3", name: "Camiseta + Copo CR", period: "2026-01", topRank: 3, emoji: "🥉", description: "Camiseta oficial + copo personalizado" },
  { id: "prize_6", name: "Vale Chopp R$50", period: "2026-01", topRank: 4, emoji: "🍻", description: "Vale consumo em qualquer bar parceiro" },
  { id: "prize_7", name: "Abridor Cliente Raiz", period: "2026-01", topRank: 5, emoji: "🎁", description: "Abridor exclusivo personalizado" },
  { id: "prize_4", name: "Boné Cliente Raiz", period: "2025-12", topRank: 1, emoji: "🏆", description: "Boné exclusivo edição limitada" },
  { id: "prize_5", name: "Copo personalizado", period: "2025-12", topRank: 2, emoji: "🍺", description: "Copo 500ml com logo CR" },
];

export type Challenge = {
  id: string;
  title: string;
  description: string;
  week: string;
  appliesToAllBars: boolean;
  barIds: string[];
  rewardName: string;
  rankingPoints: number;
  active: boolean;
};

export type AdminRoute = {
  id: string;
  name: string;
  description: string;
  barIds: string[];
  durationDays: number;
  startDate: string;
  prize: string;
  bonusPoints: number;
  difficulty: "fácil" | "médio" | "difícil";
  active: boolean;
  participantsCount: number;
  completedCount: number;
};

export const challenges: Challenge[] = [
  {
    id: "ch_1",
    title: "Visite 3 bares diferentes essa semana",
    description: "Complete check-in e envie nota em 3 bares diferentes durante a semana.",
    week: "2026-W04",
    appliesToAllBars: true,
    barIds: [],
    rewardName: "Copo Cliente Raiz",
    rankingPoints: 150,
    active: true,
  },
  {
    id: "ch_2",
    title: "Gaste acima de R$100 em bares raiz",
    description: "Some R$100+ em notas válidas durante a semana.",
    week: "2026-W04",
    appliesToAllBars: false,
    barIds: ["bar_1", "bar_2"],
    rewardName: "Vale petiscos",
    rankingPoints: 250,
    active: true,
  },
];

export const users: User[] = [
  {
    id: "usr_1",
    name: "Ana Paula",
    cpf: "123.456.789-10",
    email: "ana@cliente-raiz.com",
    whatsapp: "+55 11 98888-7777",
    createdAt: "2026-01-18",
    status: "active",
  },
  {
    id: "usr_2",
    name: "Bruno Lima",
    cpf: "987.654.321-00",
    email: "bruno@cliente-raiz.com",
    whatsapp: "+55 19 97777-6666",
    createdAt: "2026-01-17",
    status: "active",
  },
  {
    id: "usr_3",
    name: "Carla Souza",
    cpf: "111.222.333-44",
    email: "carla@cliente-raiz.com",
    whatsapp: "+55 21 96666-5555",
    createdAt: "2026-01-15",
    status: "blocked",
  },
  {
    id: "usr_4",
    name: "Diego Fernandes",
    cpf: "555.666.777-88",
    email: "diego@cliente-raiz.com",
    whatsapp: "+55 41 95555-4444",
    createdAt: "2026-01-12",
    status: "active",
  },
];

export const adminRoutes: AdminRoute[] = [
  {
    id: "ar_1",
    name: "Rota do Centro",
    description: "Explore os melhores bares do centro em uma semana.",
    barIds: ["bar_1", "bar_3", "bar_2"],
    durationDays: 7,
    startDate: "2026-02-17",
    prize: "1 Balde Eisenbahn",
    bonusPoints: 200,
    difficulty: "fácil",
    active: true,
    participantsCount: 142,
    completedCount: 38,
  },
  {
    id: "ar_2",
    name: "Happy Hour Raiz",
    description: "A rota perfeita para sexta-feira. 4 bares, drinks e petiscos.",
    barIds: ["bar_2", "bar_1", "bar_4", "bar_3"],
    durationDays: 7,
    startDate: "2026-02-20",
    prize: "2 Baldes Eisenbahn + Camiseta",
    bonusPoints: 350,
    difficulty: "médio",
    active: true,
    participantsCount: 89,
    completedCount: 12,
  },
  {
    id: "ar_3",
    name: "Maratona Raiz",
    description: "Para os mais dedicados! 5 bares em um fim de semana.",
    barIds: ["bar_1", "bar_2", "bar_4", "bar_3", "bar_1"],
    durationDays: 14,
    startDate: "2026-03-01",
    prize: "Kit Raiz Premium + 3 Baldes",
    bonusPoints: 500,
    difficulty: "difícil",
    active: false,
    participantsCount: 0,
    completedCount: 0,
  },
  {
    id: "ar_4",
    name: "Tour Cervejeiro",
    description: "Visitou 3 bares com cervejas artesanais e completou a rota.",
    barIds: ["bar_4", "bar_1", "bar_2"],
    durationDays: 7,
    startDate: "2026-02-10",
    prize: "Caneca Exclusiva CR",
    bonusPoints: 150,
    difficulty: "fácil",
    active: false,
    participantsCount: 210,
    completedCount: 87,
  },
];

export type CheckIn = {
  id: string;
  date: string;
  userName: string;
  barName: string;
  barId: string;
  imageUrl: string;
  instagramHandle?: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  userLatitude?: number;
  userLongitude?: number;
  gpsMatchStatus?: "match" | "no_match" | "unavailable";
  distanceMeters?: number;
};

export const checkins: CheckIn[] = [
  {
    id: "ck_1",
    date: "2026-02-23",
    userName: "Ana Paula",
    barName: "Bar do Centro",
    barId: "bar_1",
    imageUrl: "https://images.unsplash.com/photo-1546622891-02c72c1537b6?auto=format&fit=crop&w=800&q=60",
    instagramHandle: "@anapaula_cr",
    status: "pending",
    userLatitude: -23.5508,
    userLongitude: -46.6335,
    gpsMatchStatus: "match",
    distanceMeters: 45,
  },
  {
    id: "ck_2",
    date: "2026-02-22",
    userName: "Bruno Lima",
    barName: "Vila Pub",
    barId: "bar_2",
    imageUrl: "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=800&q=60",
    instagramHandle: "@brunolima",
    status: "approved",
    userLatitude: -22.9101,
    userLongitude: -47.0628,
    gpsMatchStatus: "match",
    distanceMeters: 30,
  },
  {
    id: "ck_3",
    date: "2026-02-21",
    userName: "Carla Souza",
    barName: "Chopp & Cia",
    barId: "bar_4",
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=60",
    instagramHandle: "@carlasouza",
    status: "rejected",
    rejectionReason: "Story não mostra marcação do bar",
    userLatitude: -25.4500,
    userLongitude: -49.2800,
    gpsMatchStatus: "no_match",
    distanceMeters: 1050,
  },
  {
    id: "ck_4",
    date: "2026-02-20",
    userName: "Diego Fernandes",
    barName: "Bar do Centro",
    barId: "bar_1",
    imageUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=60",
    status: "approved",
    gpsMatchStatus: "unavailable",
  },
];

export const receipts: Receipt[] = [
  {
    id: "rec_1",
    date: "2026-01-23",
    userName: "Ana Paula",
    barName: "Bar do Centro",
    amount: 89.9,
    status: "approved_auto",
    accessKey: "35260112345678000190550010000000011000000019",
    barCnpj: "12.345.678/0001-90",
    issuerCnpj: "12.345.678/0001-90",
    imageUrl:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=60",
  },
  {
    id: "rec_2",
    date: "2026-01-22",
    userName: "Bruno Lima",
    barName: "Vila Pub",
    amount: 52.5,
    status: "pending_validation",
    accessKey: "35260198765432000110550010000000021000000026",
    barCnpj: "98.765.432/0001-10",
    imageUrl:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=60",
  },
  {
    id: "rec_3",
    date: "2026-01-21",
    userName: "Carla Souza",
    barName: "Chopp & Cia",
    amount: 120,
    status: "rejected_auto",
    reason: "CNPJ_MISMATCH",
    accessKey: "35260155666777000188550010000000031000000033",
    barCnpj: "55.666.777/0001-88",
    issuerCnpj: "11.222.333/0001-44",
    imageUrl:
      "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1400&q=60",
  },
  {
    id: "rec_4",
    date: "2026-01-20",
    userName: "Diego Fernandes",
    barName: "Bar do Centro",
    amount: 64,
    status: "needs_review",
    reason: "PROVIDER_UNAVAILABLE",
    accessKey: "35260112345678000190550010000000041000000048",
    barCnpj: "12.345.678/0001-90",
    imageUrl:
      "https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=1400&q=60",
  },
];
