/* ─────────────────────────────────────────────────
   Utilitários de geolocalização para check-in
   ───────────────────────────────────────────────── */

/** Distância máxima aceitável (metros) para considerar GPS "match" */
export const GPS_MAX_DISTANCE_METERS = 200;

export type GeoPosition = {
  latitude: number;
  longitude: number;
};

export type GeoResult = {
  position: GeoPosition | null;
  status: "success" | "denied" | "unavailable" | "timeout";
  error?: string;
};

/**
 * Obtém a posição atual do usuário via browser Geolocation API.
 * Retorna um objeto com status e posição (ou null em caso de erro).
 */
export function getCurrentPosition(timeoutMs = 10000): Promise<GeoResult> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        position: null,
        status: "unavailable",
        error: "Geolocalização não suportada pelo navegador",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          position: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
          status: "success",
        });
      },
      (err) => {
        let status: GeoResult["status"] = "unavailable";
        let error = "Erro desconhecido ao obter localização";

        switch (err.code) {
          case err.PERMISSION_DENIED:
            status = "denied";
            error = "Permissão de localização negada. Ative nas configurações do navegador.";
            break;
          case err.POSITION_UNAVAILABLE:
            status = "unavailable";
            error = "Localização indisponível no momento";
            break;
          case err.TIMEOUT:
            status = "timeout";
            error = "Tempo esgotado ao obter localização";
            break;
        }

        resolve({ position: null, status, error });
      },
      {
        enableHighAccuracy: true,
        timeout: timeoutMs,
        maximumAge: 30000, // cache de 30s
      },
    );
  });
}

/**
 * Calcula a distância entre duas coordenadas usando a fórmula de Haversine.
 * Retorna a distância em metros.
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000; // raio da Terra em metros
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Verifica se a posição do usuário está dentro do raio aceitável do bar.
 */
export function isWithinRange(
  userLat: number,
  userLng: number,
  barLat: number,
  barLng: number,
  maxDistanceMeters: number = GPS_MAX_DISTANCE_METERS,
): boolean {
  const distance = calculateDistance(userLat, userLng, barLat, barLng);
  return distance <= maxDistanceMeters;
}

/**
 * Verifica geolocalização e retorna status formatado para o check-in.
 */
export function getGpsMatchStatus(
  userLat: number | undefined,
  userLng: number | undefined,
  barLat: number | undefined,
  barLng: number | undefined,
): { status: "match" | "no_match" | "unavailable"; distanceMeters: number } {
  if (
    userLat == null ||
    userLng == null ||
    barLat == null ||
    barLng == null
  ) {
    return { status: "unavailable", distanceMeters: 0 };
  }

  const distance = calculateDistance(userLat, userLng, barLat, barLng);
  const status = distance <= GPS_MAX_DISTANCE_METERS ? "match" : "no_match";

  return { status, distanceMeters: Math.round(distance) };
}
