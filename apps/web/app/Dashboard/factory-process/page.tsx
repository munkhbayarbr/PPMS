"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
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

type FactoryProcess = {
  id: string;
  nameEn: string;
  nameMn?: string | null;
  abbre?: string | null;
};

const fetcher = (url: string) => apiFetch<FactoryProcess[]>(url);

export default function FactoryProcessPage() {
  const { data, isLoading, error, mutate } = useSWR<FactoryProcess[]>("/factory-process", fetcher);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const empty: Partial<FactoryProcess> = { nameEn: "", nameMn: "", abbre: "" };
  const [form, setForm] = useState<Partial<FactoryProcess>>(empty);

  const title = useMemo(
    () => (editingId ? "Процесс засах" : "Процесс нэмэх"),
    [editingId]
  );

  const close = () => {
    setOpen(false);
    setEditingId(null);
    setForm(empty);
  };

  const onEdit = (row: FactoryProcess) => {
    setEditingId(row.id);
    setForm({
      nameEn: row.nameEn,
      nameMn: row.nameMn ?? "",
      abbre: row.abbre ?? "",
    });
    setOpen(true);
  };

  const onSubmit = async () => {
    try {
      if (!form.nameEn?.trim()) return toast.error("English name (nameEn) заавал");

      const payload = {
        nameEn: form.nameEn,
        nameMn: form.nameMn || null,
        abbre: form.abbre || null,
      };

      if (editingId) {
        await apiFetch(`/factory-process/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        toast.success("Процесс шинэчлэгдлээ");
      } else {
        await apiFetch(`/factory-process`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Процесс үүслээ");
      }
      close();
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  };

  const onDelete = async (id: string) => {
    try {
      await apiFetch(`/factory-process/${id}`, { method: "DELETE" });
      toast.success("Устгалаа");
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Үйлдвэрлэлийн процесс</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) close(); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); setForm(empty); }}>
              <Plus className="mr-2 h-4 w-4" /> Шинээр нэмэх
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-1.5">
                <Label>Нэр (EN)*</Label>
                <Input
                  value={form.nameEn || ""}
                  onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                  placeholder="Carding / Spinning / Winding ..."
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Нэр (MN)</Label>
                <Input
                  value={form.nameMn || ""}
                  onChange={(e) => setForm((f) => ({ ...f, nameMn: e.target.value }))}
                  placeholder="Самнах / Ээрэх / Ороох ..."
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Товчлол</Label>
                <Input
                  value={form.abbre || ""}
                  onChange={(e) => setForm((f) => ({ ...f, abbre: e.target.value }))}
                  placeholder="P1 / P2 / P3 ..."
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
                  <th className="text-left px-3 py-2">Нэр (EN)</th>
                  <th className="text-left px-3 py-2">Нэр (MN)</th>
                  <th className="text-left px-3 py-2">Товчлол</th>
                  <th className="px-3 py-2 text-right">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">Ачаалж байна…</td></tr>
                )}
                {error && !isLoading && (
                  <tr><td colSpan={4} className="px-3 py-6 text-center text-red-600">Алдаа: {String(error)}</td></tr>
                )}
                {data?.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-2 font-medium">{row.nameEn}</td>
                    <td className="px-3 py-2">{row.nameMn || "-"}</td>
                    <td className="px-3 py-2">{row.abbre || "-"}</td>
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
                  <tr><td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">Хоосон</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
