// apps/web/components/crud/CrudList.tsx
"use client";

import useSWR from "swr";
import { useState } from "react";
import {  Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
type Column<T> = { key: keyof T; label: string };
type Field = { name: string; label: string; type?: "text" | "number" };

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then(r => {
  if (!r.ok) throw new Error("Failed");
  return r.json();
});

type Props<T> = {
  /** e.g. "/api/proxy/fiber-types" */
  base: string;
  /** unique swr key, usually same as base */
  swrKey?: string;
  title: string;
  columns: Column<T>[];
  createFields: Field[];
};

export default function CrudList<T extends { id: string | number }>({
  base,
  swrKey = base,
  title,
  columns,
  createFields,
}: Props<T>) {
  const { data, error, isLoading, mutate } = useSWR<T[]>(swrKey, fetcher);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});

  async function createItem() {
    const res = await fetch(base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    if (!res.ok) throw new Error(await res.text());
    setOpen(false);
    setForm({});
    mutate(); // refresh
  }

  async function removeItem(id: string | number) {
    const res = await fetch(`${base}/${id}`, { method: "DELETE", credentials: "include" });
    if (!res.ok) throw new Error(await res.text());
    mutate();
  }

  if (error) return <div className="p-4 text-red-600">Алдаа: {String(error)}</div>;
  if (isLoading) return <div className="p-4">Түр хүлээнэ үү…</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button onClick={() => setOpen(true)}>Шинээр нэмэх</Button>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              {columns.map(c => (
                <th key={String(c.key)} className="text-left px-3 py-2 font-medium">{c.label}</th>
              ))}
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {data?.map(row => (
              <tr key={String(row.id)} className="border-t">
                {columns.map(c => (
                  <td key={String(c.key)} className="px-3 py-2">
                    {String(row[c.key])}
                  </td>
                ))}
                <td className="px-3 py-2 text-right">
                  <Button variant="destructive" size="sm" onClick={() => removeItem(row.id)}>
                    Устгах
                  </Button>
                </td>
              </tr>
            ))}
            {!data?.length && (
              <tr><td className="px-3 py-6 text-center text-muted-foreground" colSpan={columns.length+1}>Хоосон</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Нэмэх</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {createFields.map(f => (
              <div key={f.name} className="space-y-1">
                <label className="text-sm">{f.label}</label>
                <Input
                  type={f.type ?? "text"}
                  value={form[f.name] ?? ""}
                  onChange={e => setForm(s => ({ ...s, [f.name]: f.type === "number" ? Number(e.target.value) : e.target.value }))}
                />
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Болих</Button>
              <Button onClick={createItem}>Хадгалах</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
