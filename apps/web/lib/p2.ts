// apps/web/lib/p2.ts
import { apiFetch } from "@/lib/api";

export type P2Dyeing = {
  id: string;
  lotNum: string;
  colorId?: string | null;
  dateTime: string;
  inRoughWeight?: string | null;
  p2FiberWeight?: string | null;
  p2Waste?: string | null;
};

export const p2Api = {
  listOutColors: () => apiFetch<{ id: string; name: string }[]>("/out-colors"),
  listP2: () => apiFetch<P2Dyeing[]>("/p2-dyeings"),
  createP2: (data: { lotNum: string; colorId?: string; inRoughWeight?: string; p2FiberWeight?: string; p2Waste?: string }) =>
    apiFetch<P2Dyeing>("/p2-dyeings", { method: "POST", body: JSON.stringify(data) }),

  // P1 -> P2 link
  linkP1ToP2: (data: { p1Id: string; p2Id: string; takenWeight?: string; moisture?: string; takenWeightCon?: string; roughWeight?: string }) =>
    apiFetch("/p1-to-p2", { method: "POST", body: JSON.stringify(data) }),
};
