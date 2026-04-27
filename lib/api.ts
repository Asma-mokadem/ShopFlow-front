const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  //  vérification SSR
  const token = typeof window !== "undefined"
    ? localStorage.getItem("accessToken")
    : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  } catch {
    // gérer les erreurs réseau (backend non démarré, CORS, etc.)
    throw new Error("Network error: unable to reach the server. Please check your connection.");
  }

  //  gérer le 401 → déconnexion automatique
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.clear();
      document.cookie = "accessToken=; path=/; max-age=0";
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const error = await response.json();
      // gérer les réponses d'erreur sous différentes formes
      const message = error.error || error.message
        || (typeof error === "string" ? error : `HTTP ${response.status}`);
      throw new Error(message);
    }
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  // gérer les réponses vides (ex: DELETE 204 No Content)
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}