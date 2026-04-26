export interface AuthUser {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

export function saveAuth(data: AuthUser) {
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("user", JSON.stringify(data));
  // Sync cookie pour le middleware Next.js
  document.cookie = `accessToken=${data.accessToken}; path=/; max-age=900; SameSite=Lax`;
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export function logout() {
  localStorage.clear();
  document.cookie = "accessToken=; path=/; max-age=0";
  window.location.href = "/login";
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function hasRole(role: string): boolean {
  const user = getUser();
  return user?.role === role;
}