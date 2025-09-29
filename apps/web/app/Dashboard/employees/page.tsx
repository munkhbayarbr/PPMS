"use client";

import useSWR from "swr";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type Employee = {
  id: string;
  email: string;
  name?: string | null;
  isActive: boolean;
};

const fetcher = (url: string) => apiFetch<any>(url);

export default function EmployeesPage() {
  const { data, error, isLoading, mutate } = useSWR<Employee[]>("/users", fetcher);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ email: string; password: string; name: string }>({
    email: "",
    password: "",
    name: "",
  });

  async function createEmployee() {
    try {
      if (!form.email || !form.password) return toast.error("Имэйл, нууц үг шаардлагатай");
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      toast.success("Ажилчин нэмэгдлээ");
      setForm({ email: "", password: "", name: "" });
      setOpen(false);
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  async function removeEmployee(id: string) {
    try {
      await apiFetch(`/users/${id}`, { method: "DELETE" });
      toast.success("Ажилчин устгагдлаа");
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Ажилчид</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Шинээр нэмэх
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ажилчин нэмэх</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div>
                <Label>Нэр</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                />
              </div>
              <div>
                <Label>Нууц үг</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Болих
              </Button>
              <Button onClick={createEmployee}>Хадгалах</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border">
        <div className="p-3 border-b text-sm text-muted-foreground">
          {isLoading ? "Ачаалж байна…" : error ? "Алдаа" : `${data?.length ?? 0} ажилчин`}
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-4 gap-2 p-3 font-medium text-sm">
            <div>Нэр</div>
            <div>Email</div>
            <div>Идэвхтэй</div>
            <div className="text-right">Үйлдэл</div>
          </div>
          {data?.map((u) => (
            <div key={u.id} className="grid grid-cols-4 gap-2 p-3 text-sm">
              <div>{u.name || "-"}</div>
              <div>{u.email}</div>
              <div>{u.isActive ? "Тийм" : "Үгүй"}</div>
              <div className="text-right">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeEmployee(u.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {data && data.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">Хоосон</div>
          )}
        </div>
      </div>
    </div>
  );
}
