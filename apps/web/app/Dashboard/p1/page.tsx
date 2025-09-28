"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type Customer  = { id: string; name: string; abbName?: string | null };
type FiberType = { id: string; name: string };
type FiberColor = { id: string; name: string };

type P1 = {
  id: string;
  dateTime: string;
  baleNum?: number | null;
  roughWeight?: number | null;
  baleWeight?: number | null;
  conWeight?: number | null;
  moisture?: number | null;
  customer?: Customer | null;
  fiberType?: FiberType | null;
  fiberColor?: FiberColor | null;
};

// server action fetcher (works in your setup)
const f = (url: string) => apiFetch<any>(url);

// unwrap helper: handles both array and `{ items, total }`
function unwrapArray<T>(data: any): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && Array.isArray(data.items)) return data.items as T[];
  return [];
}

export default function P1IntakePage() {
  const { data: session } = useSession();
  const userId = (session as any)?.user?.id || (session as any)?.id; // make sure your session includes user.id

  // lists
  const { data: customersRaw } = useSWR("/customers?take=1000", f);
  const { data: typesRaw }     = useSWR("/fiber-types", f);
  const { data: colorsRaw }    = useSWR("/fiber-colors", f);
  const { data: recentRaw, mutate } = useSWR("/p1-stocks?take=20", f);

  const customers = unwrapArray<Customer>(customersRaw);
  const types     = unwrapArray<FiberType>(typesRaw);
  const colors    = unwrapArray<FiberColor>(colorsRaw);
  const recent    = unwrapArray<P1>(recentRaw);

  const [form, setForm] = useState<{
    customerId?: string;
    fiberTypeId?: string;
    fiberColorId?: string;
    baleNum?: number;
    roughWeight?: number;
    baleWeight?: number;
    conWeight?: number;
    moisture?: number;
  }>({});

  const canSubmit = useMemo(
    () => !!(form.customerId && form.fiberTypeId && form.fiberColorId && userId),
    [form, userId],
  );

  function n(v: string): number | undefined {
    if (v === "" || v == null) return undefined;
    const num = Number(v);
    return Number.isFinite(num) ? num : undefined;
  }

  async function submit() {
    try {
      if (!canSubmit) return toast.error("Талбар дутуу (эсвэл нэвтрээгүй).");

      const payload = {
        ...form,
        userId, // operator from session (UUID)
      };

      await apiFetch("/p1-stocks", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success("Хүлээн авалт бүртгэгдлээ");
      setForm({});
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  return (
    <div className="p-6 space-y-8">
      <Card>
        <CardHeader><CardTitle>P1 – Түүхий эд хүлээн авах</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Customer */}
          <div className="grid gap-1.5">
            <Label>Харилцагч</Label>
            <Select
              value={form.customerId}
              onValueChange={(v) => setForm((s) => ({ ...s, customerId: v }))}
            >
              <SelectTrigger><SelectValue placeholder="Сонгох" /></SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.abbName || c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fiber type */}
          <div className="grid gap-1.5">
            <Label>Ширхэгийн төрөл</Label>
            <Select
              value={form.fiberTypeId}
              onValueChange={(v) => setForm((s) => ({ ...s, fiberTypeId: v }))}
            >
              <SelectTrigger><SelectValue placeholder="Сонгох" /></SelectTrigger>
              <SelectContent>
                {types.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fiber color */}
          <div className="grid gap-1.5">
            <Label>Ширхэгийн өнгө</Label>
            <Select
              value={form.fiberColorId}
              onValueChange={(v) => setForm((s) => ({ ...s, fiberColorId: v }))}
            >
              <SelectTrigger><SelectValue placeholder="Сонгох" /></SelectTrigger>
              <SelectContent>
                {colors.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Numbers */}
          <div className="grid gap-1.5">
            <Label>Боодол (#)</Label>
            <Input
              type="number"
              value={form.baleNum ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, baleNum: n(e.target.value) }))}
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Бохир жин (кг)</Label>
            <Input
              type="number" step="0.001"
              value={form.roughWeight ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, roughWeight: n(e.target.value) }))}
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Боодол жин (кг)</Label>
            <Input
              type="number" step="0.001"
              value={form.baleWeight ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, baleWeight: n(e.target.value) }))}
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Тохируулсан жин (кг)</Label>
            <Input
              type="number" step="0.001"
              value={form.conWeight ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, conWeight: n(e.target.value) }))}
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Чийгшил (%)</Label>
            <Input
              type="number" step="0.001"
              value={form.moisture ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, moisture: n(e.target.value) }))}
            />
          </div>

          <div className="sm:col-span-3">
            <Button onClick={submit} disabled={!canSubmit}>Хадгалах</Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent table */}
      <Card>
        <CardHeader><CardTitle>Сүүлийн бүртгэлүүд</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-3 py-2">Огноо</th>
                  <th className="text-left px-3 py-2">Харилцагч</th>
                  <th className="text-left px-3 py-2">Төрөл</th>
                  <th className="text-left px-3 py-2">Өнгө</th>
                  <th className="text-right px-3 py-2">Бохир</th>
                  <th className="text-right px-3 py-2">Con</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2">{new Date(r.dateTime).toLocaleString()}</td>
                    <td className="px-3 py-2">{r.customer?.abbName || r.customer?.name || "-"}</td>
                    <td className="px-3 py-2">{r.fiberType?.name || "-"}</td>
                    <td className="px-3 py-2">{r.fiberColor?.name || "-"}</td>
                    <td className="px-3 py-2 text-right">{r.roughWeight ?? "-"}</td>
                    <td className="px-3 py-2 text-right">{r.conWeight ?? "-"}</td>
                  </tr>
                ))}
                {recent.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-center text-muted-foreground" colSpan={6}>
                      Хоосон
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
