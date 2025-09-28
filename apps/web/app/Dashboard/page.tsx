"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type WipResp = {
  window: { from: string; to: string };
  counts: {
    p1?: number; p2Dyeing?: number; p2Blending?: number;
    p3?: number; p4?: number; p5?: number; p6?: number; p7?: number;
  };
};

type ThResp = {
  window: { from: string; to: string };
  kg: {
    p2Dyeing_out?: number | string;
    p3Carding_out?: number | string;
    p4Spinning_roven?: number | string;
    p4Spinning_singleYarn?: number | string;
    p5Winding_out?: number | string;
    p6Doubling_out?: number | string;
    p7Twisting_out?: number | string;
  };
};

type WsResp = {
  window: { from: string; to: string };
  kg: {
    p2Dyeing?: number | string;
    p3Carding?: number | string;
    p4Spinning?: number | string;
  };
};

const fetcher = (url: string) => apiFetch<any>(url);

const STAGE_LABELS: Record<string, string> = {
  p1: "P1 Хүлээн авалт",
  p2Dyeing: "P2 Будах",
  p2Blending: "P2 Холих",
  p3: "P3 Самнах",
  p4: "P4 Ээрэх",
  p5: "P5 Ороох",
  p6: "P6 Давхарлах",
  p7: "P7 Эрчлэх",
};

export default function DashboardHome() {
  // default window = last 30 days
  const [from, setFrom] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 30);
    return d.toISOString();
  });
  const [to, setTo] = useState(() => new Date().toISOString());

  const qp = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set("from", from);
    qs.set("to", to);
    return `?${qs.toString()}`;
  }, [from, to]);

  const { data: wip, isLoading: wipLoading, error: wipErr } =
    useSWR<WipResp>(`/reports/wip${qp}`, fetcher);
  const { data: th, isLoading: thLoading, error: thErr } =
    useSWR<ThResp>(`/reports/throughput${qp}`, fetcher);
  const { data: ws, isLoading: wsLoading, error: wsErr } =
    useSWR<WsResp>(`/reports/waste${qp}`, fetcher);

  // Helpers
  const n = (v: number | string | undefined) => (v == null ? 0 : Number(v) || 0);

  const wipRows = useMemo(() => {
    const c = wip?.counts ?? {};
    return Object.entries(c)
      .map(([k, v]) => ({ key: k, label: STAGE_LABELS[k] ?? k, count: v ?? 0 }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [wip]);

  const thRows = useMemo(() => {
    const kg = th?.kg ?? {};
    const rows = [
      ["p2Dyeing_out", "P2 Dyeing (гарсан)"],
      ["p3Carding_out", "P3 Carding (Roven out)"],
      ["p4Spinning_roven", "P4 Spinning (Roven)"],
      ["p4Spinning_singleYarn", "P4 Spinning (Дан утас)"],
      ["p5Winding_out", "P5 Winding (Гарсан)"],
      ["p6Doubling_out", "P6 Doubling (Гарсан)"],
      ["p7Twisting_out", "P7 Twisting (Гарсан)"],
    ] as const;
    return rows.map(([key, label]) => ({ key, label, kg: n((kg as any)[key]) }));
  }, [th]);

  const wsRows = useMemo(() => {
    const kg = ws?.kg ?? {};
    const rows = [
      ["p2Dyeing", "P2 Dyeing хаягдал"],
      ["p3Carding", "P3 Carding хаягдал"],
      ["p4Spinning", "P4 Spinning хаягдал"],
    ] as const;
    return rows.map(([key, label]) => ({ key, label, kg: n((kg as any)[key]) }));
  }, [ws]);

  const totalThroughput = thRows.reduce((s, r) => s + r.kg, 0);
  const totalWaste = wsRows.reduce((s, r) => s + r.kg, 0);
  const wastePct = totalThroughput > 0 ? ((totalWaste / totalThroughput) * 100).toFixed(2) : "-";

  return (
    <div className="p-6 space-y-8">
      {/* Date range */}
      <Card>
        <CardHeader><CardTitle>Хугацааны тохиргоо</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="grid gap-1.5">
            <Label>Эхлэх</Label>
            <Input
              type="datetime-local"
              value={new Date(from).toISOString().slice(0, 16)}
              onChange={(e) => setFrom(new Date(e.target.value).toISOString())}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Дуусах</Label>
            <Input
              type="datetime-local"
              value={new Date(to).toISOString().slice(0, 16)}
              onChange={(e) => setTo(new Date(e.target.value).toISOString())}
            />
          </div>
          <div className="flex items-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const d = new Date(); d.setDate(d.getDate() - 7);
                setFrom(d.toISOString()); setTo(new Date().toISOString());
              }}
            >
              Сүүлийн 7 өдөр
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const d = new Date(); d.setDate(d.getDate() - 30);
                setFrom(d.toISOString()); setTo(new Date().toISOString());
              }}
            >
              Сүүлийн 30 өдөр
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* WIP */}
      <Card>
        <CardHeader><CardTitle>Ажлын урсгал (WIP)</CardTitle></CardHeader>
        <CardContent>
          {wipLoading ? "Ачаалж байна…" : wipErr ? "Алдаа" : (
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr><th className="text-left px-3 py-2">Шат</th><th className="text-right px-3 py-2">тоо</th></tr>
                </thead>
                <tbody>
                  {wipRows.map(r => (
                    <tr key={r.key} className="border-t">
                      <td className="px-3 py-2">{r.label}</td>
                      <td className="px-3 py-2 text-right">{r.count}</td>
                    </tr>
                  ))}
                  {wipRows.length === 0 && (
                    <tr><td className="px-3 py-6 text-center text-muted-foreground" colSpan={2}>Мэдээлэл алга</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Throughput + Waste */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Дамжин өнгөрөлт (кг)</CardTitle></CardHeader>
          <CardContent>
            {thLoading ? "Ачаалж байна…" : thErr ? "Алдаа" : (
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr><th className="text-left px-3 py-2">Шат</th><th className="text-right px-3 py-2">кг</th></tr>
                  </thead>
                  <tbody>
                    {thRows.map(r => (
                      <tr key={r.key} className="border-t">
                        <td className="px-3 py-2">{r.label}</td>
                        <td className="px-3 py-2 text-right">{r.kg}</td>
                      </tr>
                    ))}
                    <tr className="border-t font-medium">
                      <td className="px-3 py-2">Нийт</td>
                      <td className="px-3 py-2 text-right">{totalThroughput}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Хаягдал (кг)</CardTitle></CardHeader>
          <CardContent>
            {wsLoading ? "Ачаалж байна…" : wsErr ? "Алдаа" : (
              <>
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr><th className="text-left px-3 py-2">Шат</th><th className="text-right px-3 py-2">кг</th></tr>
                    </thead>
                    <tbody>
                      {wsRows.map(r => (
                        <tr key={r.key} className="border-t">
                          <td className="px-3 py-2">{r.label}</td>
                          <td className="px-3 py-2 text-right">{r.kg}</td>
                        </tr>
                      ))}
                      <tr className="border-t font-medium">
                        <td className="px-3 py-2">Нийт</td>
                        <td className="px-3 py-2 text-right">{totalWaste}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Хаягдлын хувь: <span className="font-medium">
                    {typeof wastePct === "string" ? wastePct : "-"}%
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
