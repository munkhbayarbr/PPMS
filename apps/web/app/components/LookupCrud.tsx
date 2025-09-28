// apps/web/components/LookupCrud.tsx
"use client";

import useSWR from "swr";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Props<T> = {
  title: string;
  swrKey: string;
  list: () => Promise<T[]>;
  create: (data: any) => Promise<T>;
  remove: (id: string) => Promise<any>;
  // rendering
  columns: { key: keyof T; label: string }[];
  createFields: { key: string; label: string; type?: string }[]; // ex: [{key:'name',label:'Name'}]
  idKey?: keyof T; // default 'id'
};

export default function LookupCrud<T extends Record<string, any>>({
  title, swrKey, list, create, remove, columns, createFields, idKey = "id",
}: Props<T>) {
  const { data, isLoading, error, mutate } = useSWR<T[]>(swrKey, () => list());
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  async function onCreate() {
    try {
      await create(form);
      setOpen(false);
      setForm({});
      mutate();
      toast.success("Created");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to create");
    }
  }

  async function onDelete(id: string) {
    try {
      await remove(id);
      mutate();
      toast.success("Deleted");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to delete");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button onClick={() => setOpen(true)}>New</Button>
      </div>

      {isLoading && <div>Loading…</div>}
      {error && <div className="text-red-600">Failed to load</div>}

      <div className="border rounded-md">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              {columns.map((c) => (<th key={String(c.key)} className="text-left p-3">{c.label}</th>))}
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((row) => (
              <tr key={String(row[idKey])} className="border-t">
                {columns.map((c) => (<td key={String(c.key)} className="p-3">{String(row[c.key] ?? "—")}</td>))}
                <td className="p-3 text-right">
                  <Button variant="ghost" onClick={() => onDelete(String(row[idKey]))}>Delete</Button>
                </td>
              </tr>
            ))}
            {data?.length === 0 && (
              <tr><td className="p-6 text-center text-muted-foreground" colSpan={columns.length + 1}>Empty</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New {title}</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            {createFields.map(f => (
              <div key={f.key}>
                <Label>{f.label}</Label>
                <Input
                  type={f.type ?? "text"}
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={onCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
