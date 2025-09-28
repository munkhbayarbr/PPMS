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

type Customer = {
  id: string;
  name: string;
  abbName?: string | null;
  email?: string | null;
  mobile?: string | null;
  address?: string | null;
  phone?: string | null;
  fax?: string | null;
};

const fetcher = (url: string) => apiFetch<Customer[]>(url);

export default function CustomersView() {
  // жагсаалтын параметрүүд
  const [q, setQ] = useState("");
  const [take, setTake] = useState(20);
  const [page, setPage] = useState(0);
  const skip = page * take;

  const key = useMemo(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (skip) params.set("skip", String(skip));
    if (take !== 20) params.set("take", String(take));
    const query = params.toString();
    return `/customers${query ? `?${query}` : ""}`;
  }, [q, skip, take]);

  const { data, isLoading, mutate, error } = useSWR<Customer[]>(key, fetcher);

  // модал + формын төлөв
  const [open, setOpen] = useState(false);
  const empty: Partial<Customer> = { name: "" };
  const [form, setForm] = useState<Partial<Customer>>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const closeDialog = () => {
    setOpen(false);
    setEditingId(null);
    setForm(empty);
  };

  const onSubmit = async () => {
    try {
      if (!form.name?.trim()) return toast.error("Нэр заавал бөглөнө үү");

      const payload = {
        name: form.name,
        abbName: form.abbName || null,
        email: form.email || null,
        mobile: form.mobile || null,
        address: form.address || null,
        phone: form.phone || null,
        fax: form.fax || null,
      };

      if (editingId) {
        await apiFetch(`/customers/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        toast.success("Харилцагч шинэчлэгдлээ.");
      } else {
        await apiFetch(`/customers`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Харилцагч амжилттай үүслээ.");
      }

      closeDialog();
      mutate(); // одоогийн хуудсыг дахин ачаалах
    } catch (e: any) {
      const msg = e?.message || "";
      if (msg.toLowerCase().includes("email") && msg.toLowerCase().includes("exists")) {
        toast.error("Имэйл аль хэдийн бүртгэлтэй байна.");
      } else {
        toast.error(msg || "Амжилтгүй");
      }
    }
  };

  const onEdit = (c: Customer) => {
    setEditingId(c.id);
    setForm(c);
    setOpen(true);
  };

  const onDelete = async (id: string) => {
    try {
      await apiFetch(`/customers/${id}`, { method: "DELETE" });
      toast.success("Харилцагч устгалаа.");
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  };

  // хуудаслалт
  const canPrev = page > 0;
  const canNext = (data?.length ?? 0) === take;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Харилцагчид</h1>

        <div className="flex w-full sm:w-auto items-center gap-2">
          <Input
            placeholder="Нэр/имэйл/утсаар хайх…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            className="sm:w-72"
          />
          <Dialog
            open={open}
            onOpenChange={(o) => {
              setOpen(o);
              if (!o) closeDialog();
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingId(null); setForm(empty); }}>
                <Plus className="mr-2 h-4 w-4" /> Шинэ харилцагч
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingId ? "Харилцагч засах" : "Шинэ харилцагч"}</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-2">
                <div className="grid gap-1.5">
                  <Label>Нэр</Label>
                  <Input
                    value={form.name || ""}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="ACME LLC"
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label>Товчлол</Label>
                  <Input
                    value={form.abbName || ""}
                    onChange={(e) => setForm((f) => ({ ...f, abbName: e.target.value }))}
                    placeholder="ACME"
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label>Имэйл</Label>
                  <Input
                    value={form.email || ""}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="contact@company.com"
                    type="email"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-1.5">
                    <Label>Утас</Label>
                    <Input
                      value={form.phone || ""}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="+976-xxxxxxx"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Гар утас</Label>
                    <Input
                      value={form.mobile || ""}
                      onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
                      placeholder="+976-xxxxxxx"
                    />
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <Label>Факс</Label>
                  <Input
                    value={form.fax || ""}
                    onChange={(e) => setForm((f) => ({ ...f, fax: e.target.value }))}
                    placeholder="+976-11-123456"
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label>Хаяг</Label>
                  <Input
                    value={form.address || ""}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    placeholder="Улаанбаатар…"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>Болих</Button>
                <Button onClick={onSubmit}>{editingId ? "Хадгалах" : "Үүсгэх"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-xl border">
        <div className="p-3 border-b text-sm text-muted-foreground flex items-center justify-between">
          <span>
            {isLoading
              ? "Ачаалж байна…"
              : error
                ? "Ачаалах үед алдаа гарлаа"
                : `${data?.length ?? 0} харилцагч`}
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
          <div className="grid grid-cols-8 gap-2 p-3 font-medium text-sm">
            <div>Нэр</div>
            <div>Товчлол</div>
            <div>Имэйл</div>
            <div>Утас</div>
            <div>Гар утас</div>
            <div>Факс</div>
            <div>Хаяг</div>
            <div className="text-right">Үйлдэл</div>
          </div>

          {data?.map((c) => (
            <div key={c.id} className="grid grid-cols-8 gap-2 p-3 text-sm">
              <div className="font-medium">{c.name}</div>
              <div>{c.abbName || "-"}</div>
              <div className="truncate">{c.email || "-"}</div>
              <div>{c.phone || "-"}</div>
              <div>{c.mobile || "-"}</div>
              <div>{c.fax || "-"}</div>
              <div className="truncate">{c.address || "-"}</div>
              <div className="flex items-center justify-end gap-2">
                <Button size="icon" variant="outline" onClick={() => onEdit(c)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => onDelete(c.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {!isLoading && !error && (data?.length ?? 0) === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Одоогоор харилцагч алга.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
