"use client";

import useSWR from "swr";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

type FiberType = { id: string; name: string };

const fetcher = (url: string) => apiFetch<FiberType[]>(url);

export default function FiberTypesPage() {
  const { data, isLoading, error, mutate } = useSWR<FiberType[]>("/fiber-types", fetcher);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<FiberType>>({ name: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const close = () => { setOpen(false); setEditingId(null); setForm({ name: "" }); };

  async function submit() {
    try {
      if (!form.name?.trim()) return toast.error("Нэр оруулна уу");
      if (editingId) {
        await apiFetch(`/fiber-types/${editingId}`, { method: "PATCH", body: JSON.stringify({ name: form.name }) });
        toast.success("Шинэчлэгдлээ");
      } else {
        await apiFetch(`/fiber-types`, { method: "POST", body: JSON.stringify({ name: form.name }) });
        toast.success("Нэмэгдлээ");
      }
      close();
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  async function remove(id: string) {
    try {
      await apiFetch(`/fiber-types/${id}`, { method: "DELETE" });
      toast.success("Устгалаа");
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Ширхэгийн төрөл (Fiber Types)</h1>
        <Dialog open={open} onOpenChange={(o)=>{ setOpen(o); if(!o) close(); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); setForm({ name: "" }); }}>
              <Plus className="mr-2 h-4 w-4" /> Нэмэх
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingId ? "Засах" : "Шинээр нэмэх"}</DialogTitle></DialogHeader>
            <div className="grid gap-3 py-2">
              <Label>Нэр</Label>
              <Input value={form.name || ""} onChange={e=>setForm(f=>({ ...f, name: e.target.value }))}/>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={close}>Болих</Button>
              <Button onClick={submit}>{editingId ? "Хадгалах" : "Үүсгэх"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border">
        <div className="p-3 border-b text-sm text-muted-foreground">
          {isLoading ? "Ачаалж байна…" : error ? "Алдаа" : `${data?.length ?? 0} төрөл`}
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-2 gap-2 p-3 font-medium text-sm">
            <div>Нэр</div><div className="text-right">Үйлдэл</div>
          </div>
          {data?.map((x)=>(
            <div key={x.id} className="grid grid-cols-2 gap-2 p-3 text-sm">
              <div className="font-medium">{x.name}</div>
              <div className="flex justify-end gap-2">
                <Button size="icon" variant="outline" onClick={()=>{ setEditingId(x.id); setForm({ name: x.name }); setOpen(true); }}>
                  <Pencil className="h-4 w-4"/>
                </Button>
                <Button size="icon" variant="destructive" onClick={()=>remove(x.id)}>
                  <Trash2 className="h-4 w-4"/>
                </Button>
              </div>
            </div>
          ))}
          {!isLoading && !error && (data?.length ?? 0) === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">Хоосон</div>
          )}
        </div>
      </div>
    </div>
  );
}
