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
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

type OutColor = { id: string; name: string; abbName?: string | null };
type OutColorList = { items: OutColor[]; total: number; skip: number; take: number };

const fetcher = (url: string) => apiFetch<OutColorList>(url);

export default function OutColorsPage() {
  // simple paging (optional – can remove if you don’t need it yet)
  const [take, setTake] = useState(20);
  const [page, setPage] = useState(0);
  const skip = page * take;

  const key = useMemo(() => {
    const params = new URLSearchParams();
    if (skip) params.set("skip", String(skip));
    if (take !== 20) params.set("take", String(take));
    const q = params.toString();
    return `/out-colors${q ? `?${q}` : ""}`;
  }, [skip, take]);

  const { data, isLoading, error, mutate } = useSWR<OutColorList>(key, fetcher);

  const list = data?.items ?? [];
  const total = data?.total ?? 0;

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<OutColor>>({ name: "", abbName: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const close = () => {
    setOpen(false);
    setEditingId(null);
    setForm({ name: "", abbName: "" });
  };

  async function submit() {
    try {
      if (!form.name?.trim()) return toast.error("Нэр оруулна уу");
      const payload = { name: form.name, abbName: form.abbName || null };

      if (editingId) {
        await apiFetch(`/out-colors/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch(`/out-colors`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      toast.success("OK");
      close();
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  async function remove(id: string) {
    try {
      await apiFetch(`/out-colors/${id}`, { method: "DELETE" });
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  const canPrev = page > 0;
  const canNext = skip + list.length < total;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Гаралтын өнгө (Out Colors)</h1>
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) close();
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", abbName: "" });
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Нэмэх
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Засах" : "Шинээр нэмэх"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="grid gap-1.5">
                <Label>Нэр</Label>
                <Input
                  value={form.name || ""}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Товчлол</Label>
                <Input
                  value={form.abbName || ""}
                  onChange={(e) => setForm((f) => ({ ...f, abbName: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={close}>
                Болих
              </Button>
              <Button onClick={submit}>{editingId ? "Хадгалах" : "Үүсгэх"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border">
        <div className="p-3 border-b text-sm text-muted-foreground flex items-center justify-between">
          <span>
            {isLoading ? "Ачаалж байна…" : error ? "Алдаа" : `${total} өнгө`}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!canPrev}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Өмнөх
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!canNext}
              onClick={() => setPage((p) => p + 1)}
            >
              Дараах
            </Button>
            <Input
              type="number"
              value={take}
              min={5}
              max={100}
              onChange={(e) => {
                const v = Number(e.target.value || 20);
                setTake(v);
                setPage(0);
              }}
              className="w-20"
            />
          </div>
        </div>

        <div className="divide-y">
          <div className="grid grid-cols-3 gap-2 p-3 font-medium text-sm">
            <div>Нэр</div>
            <div>Товчлол</div>
            <div className="text-right">Үйлдэл</div>
          </div>

          {list.map((x) => (
            <div key={x.id} className="grid grid-cols-3 gap-2 p-3 text-sm">
              <div className="font-medium">{x.name}</div>
              <div>{x.abbName || "-"}</div>
              <div className="flex justify-end gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    setEditingId(x.id);
                    setForm({ name: x.name, abbName: x.abbName || "" });
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => remove(x.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {!isLoading && !error && list.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Хоосон
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
