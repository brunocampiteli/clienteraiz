export const TOKEN_ADMIN_STORAGE_KEY = "cliente-raiz:token_admin";
export const TOKEN_USER_STORAGE_KEY = "cliente-raiz:token_user";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_ADMIN_STORAGE_KEY);
}

export function setAdminToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_ADMIN_STORAGE_KEY, token);
}

export function clearAdminToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_ADMIN_STORAGE_KEY);
}

export function getUserToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_USER_STORAGE_KEY);
}

export function setUserToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_USER_STORAGE_KEY, token);
}

export function clearUserToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_USER_STORAGE_KEY);
}

export const TOKEN_STORAGE_KEY = TOKEN_ADMIN_STORAGE_KEY;

export function getToken(): string | null {
  return getAdminToken();
}

export function setToken(token: string) {
  setAdminToken(token);
}

export function clearToken() {
  clearAdminToken();
}
