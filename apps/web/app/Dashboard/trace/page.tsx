"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";

import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type AnyObj = Record<string, any>;
const fetcher = (url: string) => apiFetch<any>(url);

export default function TracePage() {
  const [lot, setLot] = useState("");
  const [submittedLot, setSubmittedLot] = useState<string | null>(null);

  const key = useMemo(() => {
    if (!submittedLot) return null;
    return `/trace/lot/${encodeURIComponent(submittedLot)}`;
  }, [submittedLot]);

  const { data, error, isLoading, mutate } = useSWR<AnyObj>(key, fetcher);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!lot.trim()) return toast.error("Lot дугаар оруулна уу.");
    setSubmittedLot(lot.trim());
  }

  // Unpack by your actual response shape
  const p2Dyeing = (data?.sources?.p2Dyeing ?? []) as AnyObj[];
  const p2Blending = (data?.sources?.p2Blending ?? []) as AnyObj[];

  const p3 = (data?.flow?.p3Carding ?? []) as AnyObj[];
  const p4 = (data?.flow?.p4Spinning ?? []) as AnyObj[];
  const p5 = (data?.flow?.p5Winding ?? []) as AnyObj[];
  const p6 = (data?.flow?.p6Doubling ?? []) as AnyObj[];
  const p7 = (data?.flow?.p7Twisting ?? []) as AnyObj[];

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Мөрдөх (Trace) – Lot</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex gap-2 max-w-lg">
            <Input
              placeholder="Ж: LOT-2025-001 эсвэл 1"
              value={lot}
              onChange={(e) => setLot(e.target.value)}
            />
            <Button type="submit">Хайх</Button>
            {submittedLot && (
              <Button type="button" variant="outline" onClick={() => mutate()}>
                Дахин ачаалах
              </Button>
            )}
          </form>
          {submittedLot && (
            <div className="mt-3 text-sm text-muted-foreground">
              Хайлтын lot: <Badge variant="secondary">{submittedLot}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="p-4 text-red-600">
            Алдаа: {(error as any)?.message || "Unknown"}
          </CardContent>
        </Card>
      )}
      {isLoading && submittedLot && (
        <Card>
          <CardContent className="p-4">Ачаалж байна…</CardContent>
        </Card>
      )}

      {data && (
        <>
          {/* SOURCES */}
          <StageCard
            title="P2 — Будах (Dyeing) [Эх үүсвэр]"
            rows={p2Dyeing}
            columns={[
              { key: "dateTime", label: "Огноо", render: (r) => fmtDate(r.dateTime) },
              { key: "lotNum", label: "Lot" },
              { key: "color", label: "Өнгө", render: (r) => r.color?.abbName || r.color?.name || "-" },
              { key: "inRoughWeight", label: "In (kg)", render: (r) => num(r.inRoughWeight) },
              { key: "p2FiberWeight", label: "Fiber (kg)", render: (r) => num(r.p2FiberWeight) },
              { key: "p2Waste", label: "Waste (kg)", render: (r) => num(r.p2Waste) },
              { key: "operator", label: "Оператор", render: (r) => r.operator?.name || "-" },
            ]}
          />

          {/* Links inside P2 dyeing */}
          <LinksCard
            title="P1 → P2 (Dyeing-аас)"
            rows={flatten(p2Dyeing, "fromP1")}
            columns={[
              { key: "p1Id", label: "P1 ID" },
              { key: "p2Id", label: "P2 ID" },
              { key: "takenWeight", label: "Taken (kg)", align: "right", render: (r) => num(r.takenWeight) },
              { key: "moisture", label: "Moisture (%)", align: "right", render: (r) => num(r.moisture) },
              { key: "takenWeightCon", label: "Confirm (kg)", align: "right", render: (r) => num(r.takenWeightCon) },
            ]}
          />
          <LinksCard
            title="P2 → P3 (Dyeing-аас)"
            rows={flatten(p2Dyeing, "toP3")}
            columns={[
              { key: "p2Id", label: "P2 ID" },
              { key: "p3Id", label: "P3 ID" },
              { key: "takenWeight", label: "Taken (kg)", align: "right", render: (r) => num(r.takenWeight) },
              { key: "moisture", label: "Moisture (%)", align: "right", render: (r) => num(r.moisture) },
              { key: "takenWeightCon", label: "Confirm (kg)", align: "right", render: (r) => num(r.takenWeightCon) },
            ]}
          />

          {/* Optional: P2 Blending if present */}
          <StageCard
            title="P2 — Холих (Blending) [Эх үүсвэр]"
            rows={p2Blending}
            columns={[
              { key: "dateTime", label: "Огноо", render: (r) => fmtDate(r.dateTime) },
              { key: "lotNum", label: "Lot" },
              { key: "color", label: "Өнгө", render: (r) => r.color?.abbName || r.color?.name || "-" },
              { key: "inRoughWeight", label: "In (kg)", render: (r) => num(r.inRoughWeight) },
              { key: "p2FiberWeight", label: "Fiber (kg)", render: (r) => num(r.p2FiberWeight) },
              { key: "p2Waste", label: "Waste (kg)", render: (r) => num(r.p2Waste) },
              { key: "operator", label: "Оператор", render: (r) => r.operator?.name || "-" },
            ]}
          />

          {/* FLOW */}
          <StageCard
            title="P3 — Самнах (Carding)"
            rows={p3}
            columns={[
              { key: "dateTime", label: "Огноо", render: (r) => fmtDate(r.dateTime) },
              { key: "lotNum", label: "Lot" },
              { key: "batchNum", label: "Batch" },
              { key: "inRoughWeight", label: "In (kg)", render: (r) => num(r.inRoughWeight) },
              { key: "p3RovenWeight", label: "Roven (kg)", render: (r) => num(r.p3RovenWeight) },
              { key: "p3Waste", label: "Waste (kg)", render: (r) => num(r.p3Waste) },
              { key: "operator", label: "Оператор", render: (r) => r.operator?.name || "-" },
            ]}
          />
          <LinksCard
            title="P3 → P4"
            rows={flatten(p3, "toP4")}
            columns={[
              { key: "p3Id", label: "P3 ID" },
              { key: "p4Id", label: "P4 ID" },
              { key: "takenWeight", label: "Taken (kg)", align: "right", render: (r) => num(r.takenWeight) },
              { key: "moisture", label: "Moisture (%)", align: "right", render: (r) => num(r.moisture) },
              { key: "takenWeightCon", label: "Confirm (kg)", align: "right", render: (r) => num(r.takenWeightCon) },
            ]}
          />

          <StageCard
            title="P4 — Ээрэх (Spinning)"
            rows={p4}
            columns={[
              { key: "dateTime", label: "Огноо", render: (r) => fmtDate(r.dateTime) },
              { key: "lotNum", label: "Lot" },
              { key: "batchNum", label: "Batch" },
              { key: "p4RovenWeight", label: "Roven (kg)", render: (r) => num(r.p4RovenWeight) },
              { key: "p4DanUtas", label: "Дан утас (kg)", render: (r) => num(r.p4DanUtas) },
              { key: "p4Waste", label: "Waste (kg)", render: (r) => num(r.p4Waste) },
              { key: "operator", label: "Оператор", render: (r) => r.operator?.name || "-" },
            ]}
          />
          <LinksCard
            title="P4 → P5"
            rows={flatten(p4, "toP5")}
            columns={[
              { key: "p4Id", label: "P4 ID" },
              { key: "p5Id", label: "P5 ID" },
              { key: "takenWeight", label: "Taken (kg)", align: "right", render: (r) => num(r.takenWeight) },
              { key: "moisture", label: "Moisture (%)", align: "right", render: (r) => num(r.moisture) },
              { key: "takenWeightCon", label: "Confirm (kg)", align: "right", render: (r) => num(r.takenWeightCon) },
            ]}
          />

          <StageCard
            title="P5 — Ороох (Winding)"
            rows={p5}
            columns={[
              { key: "dateTime", label: "Огноо", render: (r) => fmtDate(r.dateTime) },
              { key: "lotNum", label: "Lot" },
              { key: "batchNum", label: "Batch" },
              { key: "inRoughWeight", label: "In (kg)", render: (r) => num(r.inRoughWeight) },
              { key: "p5OroosonUtas", label: "Ороосон утас (kg)", render: (r) => num(r.p5OroosonUtas) },
              { key: "operator", label: "Оператор", render: (r) => r.operator?.name || "-" },
            ]}
          />
          <LinksCard
            title="P5 → P6"
            rows={flatten(p5, "toP6")}
            columns={[
              { key: "p5Id", label: "P5 ID" },
              { key: "p6Id", label: "P6 ID" },
              { key: "takenWeight", label: "Taken (kg)", align: "right", render: (r) => num(r.takenWeight) },
              { key: "moisture", label: "Moisture (%)", align: "right", render: (r) => num(r.moisture) },
              { key: "takenWeightCon", label: "Confirm (kg)", align: "right", render: (r) => num(r.takenWeightCon) },
            ]}
          />

          <StageCard
            title="P6 — Давхардах (Doubling)"
            rows={p6}
            columns={[
              { key: "dateTime", label: "Огноо", render: (r) => fmtDate(r.dateTime) },
              { key: "lotNum", label: "Lot" },
              { key: "batchNum", label: "Batch" },
              { key: "inRoughWeight", label: "In (kg)", render: (r) => num(r.inRoughWeight) },
              { key: "p5DavharUtas", label: "Давхар утас (kg)", render: (r) => num(r.p5DavharUtas) },
              { key: "operator", label: "Оператор", render: (r) => r.operator?.name || "-" },
            ]}
          />
          <LinksCard
            title="P6 → P7"
            rows={flatten(p6, "toP7")}
            columns={[
              { key: "p6Id", label: "P6 ID" },
              { key: "p7Id", label: "P7 ID" },
              { key: "takenWeight", label: "Taken (kg)", align: "right", render: (r) => num(r.takenWeight) },
              { key: "moisture", label: "Moisture (%)", align: "right", render: (r) => num(r.moisture) },
              { key: "takenWeightCon", label: "Confirm (kg)", align: "right", render: (r) => num(r.takenWeightCon) },
            ]}
          />

          <StageCard
            title="P7 — Эрчлэх (Twisting)"
            rows={p7}
            columns={[
              { key: "dateTime", label: "Огноо", render: (r) => fmtDate(r.dateTime) },
              { key: "lotNum", label: "Lot" },
              { key: "batchNum", label: "Batch" },
              { key: "inRoughWeight", label: "In (kg)", render: (r) => num(r.inRoughWeight) },
              { key: "p5BelenUtas", label: "Бэлэн утас (kg)", render: (r) => num(r.p5BelenUtas) },
              { key: "operator", label: "Оператор", render: (r) => r.operator?.name || "-" },
            ]}
          />

          {/* Raw block for debugging */}
          <Card>
            <CardHeader><CardTitle>Raw JSON</CardTitle></CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto p-2 bg-muted rounded">
                {JSON.stringify(data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

/* ---------- Reusable table cards ---------- */

function StageCard({
  title,
  rows,
  columns,
}: {
  title: string;
  rows: AnyObj[];
  columns: { key: string; label: string; render?: (row: AnyObj) => string | number | null }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {title} <Badge variant="outline" className="ml-2">{rows?.length ?? 0}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="text-left px-3 py-2">{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows?.map((r, idx) => (
                <tr key={r.id ?? idx} className="border-t">
                  {columns.map((c) => (
                    <td key={c.key} className="px-3 py-2">
                      {c.render ? c.render(r) : fallback(r[c.key])}
                    </td>
                  ))}
                </tr>
              ))}
              {!rows?.length && (
                <tr>
                  <td className="px-3 py-6 text-center text-muted-foreground" colSpan={columns.length}>
                    Хоосон
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function LinksCard({
  title,
  rows,
  columns,
}: {
  title: string;
  rows: AnyObj[];
  columns: { key: string; label: string; align?: "left" | "right"; render?: (row: AnyObj) => string | number | null }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {title} <Badge variant="outline" className="ml-2">{rows?.length ?? 0}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className={`px-3 py-2 text-${c.align ?? "left"}`}>{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows?.map((r, idx) => (
                <tr key={r.id ?? idx} className="border-t">
                  {columns.map((c) => (
                    <td key={c.key} className={`px-3 py-2 text-${c.align ?? "left"}`}>
                      {c.render ? (c.render(r) ?? "-") : fallback(r[c.key])}
                    </td>
                  ))}
                </tr>
              ))}
              {!rows?.length && (
                <tr>
                  <td className="px-3 py-6 text-center text-muted-foreground" colSpan={columns.length}>
                    Хоосон
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------- utils ---------- */

function flatten(parents: AnyObj[], key: string): AnyObj[] {
  const out: AnyObj[] = [];
  for (const p of parents || []) {
    const arr = p?.[key] ?? [];
    for (const child of arr) out.push(child);
  }
  return out;
}

function fmtDate(v?: string) {
  try { return v ? new Date(v).toLocaleString() : "-"; } catch { return "-"; }
}

function num(v: any) {
  if (v === null || v === undefined || v === "") return "-";
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : String(v);
}

function fallback(v: any) {
  if (v === null || v === undefined || v === "") return "-";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return v;
  return JSON.stringify(v);
}
