function crmBaseUrl(): string {
  const baseUrl = process.env.CRM_API_URL
  if (!baseUrl) throw new Error("CRM_API_URL is not set")
  return baseUrl
}

// Thin passthrough to wn-conseil-api using the admin's own bearer token (not the
// partner API key — that key is POST-only server-to-server and can't list/browse).
export async function crmAdminFetch(path: string, token: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${crmBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init.headers,
    },
    cache: "no-store",
  })
}

export async function crmAdminJson<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  const res = await crmAdminFetch(path, token, init)
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const message = data && typeof data === "object" && "message" in data ? String(data.message) : res.statusText
    throw new Error(`CRM ${path} failed (${res.status}): ${message}`)
  }
  return data as T
}
