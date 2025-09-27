// apps/web/lib/api.ts
"use server";

import { getSession } from "next-auth/react";

const API_BASE = process.env.BACKEND_BASE!;

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { noAuth?: boolean }
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers = new Headers(init?.headers);

  if (!init?.noAuth) {
    const session = await getSession();
    const token = (session as any)?.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}
