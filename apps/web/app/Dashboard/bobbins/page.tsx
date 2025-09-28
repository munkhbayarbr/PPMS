"use client";

import useSWR from "swr";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

type Bobbin = { id: string; name: string; weight: number };

const fetcher = (url: string) => apiFetch<Bobbin[]>(url);

export default function BobbinPage() {
  // NOTE: backend routes are singular: /bobbin
  const { data, isLoading, error, mutate } = useSWR<Bobbin[]>("/bobbin", fetcher);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Bobbin>>({ name: "", weight: 0.25 });

  const close = () => {
    setOpen(false);
    setEditingId(null);
    setForm({ name: "", weight: 0.25 });
  };

  const onEdit = (row: Bobbin) => {
    setEditingId(row.id);
    setForm({ name: row.name, weight: row.weight });
    setOpen(true);
  };

  const onSubmit = async () => {
    try {
      if (!form.name?.trim()) return toast.error("Нэр заавал");
      const payload = { name: form.name, weight: Number(form.weight) };
      if (Number.isNaN(payload.weight)) return toast.error("Жин буруу утга");

      if (editingId) {
        await apiFetch(`/bobbin/${editingId}`, { method: "PATCH", body: JSON.stringify(payload) });
        toast.success("Шинэчлэгдлээ");
      } else {
        await apiFetch(`/bobbin`, { method: "POST", body: JSON.stringify(payload) });
        toast.success("Амжилттай үүслээ");
      }
      close();
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  };

  const onDelete = async (id: string) => {
    try {
      await apiFetch(`/bobbin/${id}`, { method: "DELETE" });
      toast.success("Устгалаа");
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Боббин</h1>

        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) close(); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); setForm({ name: "", weight: 0.25 }); }}>
              <Plus className="mr-2 h-4 w-4" /> Шинээр нэмэх
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? "Боббин засах" : "Боббин нэмэх"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid gap-1.5">
                <Label>Нэр*</Label>
                <Input
                  value={form.name || ""}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Standard cone"
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Жин (кг)*</Label>
                <Input
                  type="number"
                  step="0.001"
                  value={form.weight ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, weight: Number(e.target.value) }))}
                  placeholder="0.250"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={close}>Болих</Button>
              <Button onClick={onSubmit}>{editingId ? "Хадгалах" : "Үүсгэх"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle>Жагсаалт</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-3 py-2">Нэр</th>
                  <th className="text-left px-3 py-2">Жин (кг)</th>
                  <th className="px-3 py-2 text-right">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td colSpan={3} className="px-3 py-6 text-center text-muted-foreground">Ачаалж байна…</td></tr>
                )}
                {error && !isLoading && (
                  <tr><td colSpan={3} className="px-3 py-6 text-center text-red-600">Алдаа: {String(error)}</td></tr>
                )}
                {data?.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-2 font-medium">{row.name}</td>
                    <td className="px-3 py-2">{Number(row.weight)}</td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => onEdit(row)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(row.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {!isLoading && !error && (data?.length ?? 0) === 0 && (
                  <tr><td colSpan={3} className="px-3 py-6 text-center text-muted-foreground">Хоосон</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
