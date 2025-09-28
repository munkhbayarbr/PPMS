// apps/web/lib/p1.ts
import { apiFetch } from "@/lib/api";

export type Customer = { id: string; name: string };
export type P1Stock = {
  id: string;
  customerId: string;
  orderAbb?: string | null;
  dateTime: string;
  fiberTypeId: string;
  fiberColorId: string;
  baleNum?: number | null;
  roughWeight?: string | null; // Decimal -> string
  baleWeight?: string | null;
  conWeight?: string | null;
  moisture?: string | null;
};

export const p1Api = {
  listCustomersSimple: () => apiFetch<Customer[]>("/customers"), // you can expose a /customers?take=... if needed
  listFiberTypes: () => apiFetch<{ id: string; name: string }[]>("/fiber-types"),
  listFiberColors: () => apiFetch<{ id: string; name: string }[]>("/fiber-colors"),

  listP1: () => apiFetch<P1Stock[]>("/p1-stocks"),
  createP1: (data: Omit<P1Stock, "id" | "dateTime"> & { dateTime?: string }) =>
    apiFetch<P1Stock>("/p1-stocks", { method: "POST", body: JSON.stringify(data) }),
  deleteP1: (id: string) => apiFetch(`/p1-stocks/${id}`, { method: "DELETE" }),
};
