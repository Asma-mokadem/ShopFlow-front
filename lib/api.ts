const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("accessToken")
    : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    // Gérer les réponses non-JSON (ex: 401 texte brut)
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const error = await response.json();
      throw new Error(error.error || "Something went wrong");
    }
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}