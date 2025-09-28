// apps/web/lib/lookups.ts
import { apiFetch } from "@/lib/api";

export type FiberType = { id: string; name: string };
export type FiberColor = { id: string; name: string };
export type OutColor  = { id: string; name: string; abbName?: string | null };

export const lookups = {
  // Fiber Types
  listFiberTypes: () => apiFetch<FiberType[]>("/fiber-types"),
  createFiberType: (data: { name: string }) =>
    apiFetch<FiberType>("/fiber-types", { method: "POST", body: JSON.stringify(data) }),
  deleteFiberType: (id: string) =>
    apiFetch(`/fiber-types/${id}`, { method: "DELETE" }),

  // Fiber Colors
  listFiberColors: () => apiFetch<FiberColor[]>("/fiber-colors"),
  createFiberColor: (data: { name: string }) =>
    apiFetch<FiberColor>("/fiber-colors", { method: "POST", body: JSON.stringify(data) }),
  deleteFiberColor: (id: string) =>
    apiFetch(`/fiber-colors/${id}`, { method: "DELETE" }),

  // Out Colors
  listOutColors: () => apiFetch<OutColor[]>("/out-colors"),
  createOutColor: (data: { name: string; abbName?: string }) =>
    apiFetch<OutColor>("/out-colors", { method: "POST", body: JSON.stringify(data) }),
  deleteOutColor: (id: string) =>
    apiFetch(`/out-colors/${id}`, { method: "DELETE" }),
};
