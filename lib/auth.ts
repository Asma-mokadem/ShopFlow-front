export interface AuthUser {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

//vérification SSR sur toutes les fonctions qui accèdent à window/document/localStorage
const isBrowser = typeof window !== "undefined";

export function saveAuth(data: AuthUser) {
  if (!isBrowser) return;

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("user", JSON.stringify(data));

  // durée du cookie alignée sur l'expiration du token (900s = 15 min)
  // et Secure en production
  const isProduction = window.location.protocol === "https:";
  const secureFlag = isProduction ? "; Secure" : "";
  document.cookie = `accessToken=${data.accessToken}; path=/; max-age=900; SameSite=Lax${secureFlag}`;
}

export function getUser(): AuthUser | null {
  if (!isBrowser) return null;
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    // BUG FIX: JSON.parse peut échouer si localStorage est corrompu
    localStorage.removeItem("user");
    return null;
  }
}

export function getToken(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem("accessToken");
}

export function logout() {
  if (!isBrowser) return;
  localStorage.clear();
  //  supprimer aussi le refreshToken cookie si utilisé
  document.cookie = "accessToken=; path=/; max-age=0; SameSite=Lax";
  window.location.href = "/login";
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function hasRole(role: string): boolean {
  const user = getUser();
  return user?.role === role;
}