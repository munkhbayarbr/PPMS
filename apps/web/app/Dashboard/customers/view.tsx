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
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

type Customer = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  isActive: boolean;
  createdAt: string;
};

export default function CustomersView() {
 const fetcher = (url: string) => apiFetch<Customer[]>(url);

const { data, isLoading, mutate, error } = useSWR<Customer[]>("/customers", fetcher);


  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Customer>>({ name: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const onSubmit = async () => {
    try {
      if (!form.name?.trim()) return toast.error("Name is required");
      if (editingId) {
        await apiFetch(`/customers/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify({
            name: form.name,
            email: form.email || null,
            phone: form.phone || null,
            address: form.address || null,
          }),
        });
        toast.success("Customer updated.");
      } else {
        await apiFetch(`/customers`, {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email || null,
            phone: form.phone || null,
            address: form.address || null,
          }),
        });
        toast.success("Customer created.");
      }
      setOpen(false);
      setForm({ name: "" });
      setEditingId(null);
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Failed");
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
      toast.success("Customer deleted.");
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditingId(null); setForm({ name: "" }); } }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); setForm({ name: "" }); }}>
              <Plus className="mr-2 h-4 w-4" /> New Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Customer" : "New Customer"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid gap-1.5">
                <Label>Name</Label>
                <Input
                  value={form.name || ""}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="ACME LLC"
                />
              </div>

              <div className="grid gap-1.5">
                <Label>Email</Label>
                <Input
                  value={form.email || ""}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="contact@company.com"
                />
              </div>

              <div className="grid gap-1.5">
                <Label>Phone</Label>
                <Input
                  value={form.phone || ""}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+976-xxxxxxx"
                />
              </div>

              <div className="grid gap-1.5">
                <Label>Address</Label>
                <Input
                  value={form.address || ""}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="Ulaanbaatar…"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={onSubmit}>{editingId ? "Save" : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border">
        <div className="p-3 border-b text-sm text-muted-foreground">
          {isLoading ? "Loading…" : error ? "Failed to load" : `${data?.length ?? 0} customers`}
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-6 gap-2 p-3 font-medium text-sm">
            <div>Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Address</div>
            <div>Created</div>
            <div className="text-right">Actions</div>
          </div>

          {data?.map((c) => (
            <div key={c.id} className="grid grid-cols-6 gap-2 p-3 text-sm">
              <div className="font-medium">{c.name}</div>
              <div>{c.email || "-"}</div>
              <div>{c.phone || "-"}</div>
              <div className="truncate">{c.address || "-"}</div>
              <div>{new Date(c.createdAt).toLocaleDateString()}</div>
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
            <div className="p-6 text-center text-sm text-muted-foreground">No customers yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
