"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Link2, Plus, Trash2 } from "lucide-react";

type OutColor = { id: string; name: string; abbName?: string | null };
type P2 = { id: string; lotNum: string; dateTime: string; color?: OutColor | null; inRoughWeight?: number | null; p2FiberWeight?: number | null; p2Waste?: number | null; };
type P1 = { id: string; code?: string; dateTime: string; customer?: { name: string; abbName?: string | null } | null; roughWeight?: number | null };

const f = (url: string) => apiFetch<any>(url);

export default function P2DyeingPage() {
  const { data: colors } = useSWR<OutColor[]>("/out-colors", f);
  const { data: list, mutate } = useSWR<P2[]>("/p2-dyeings?take=50", f);
  const { data: p1 } = useSWR<P1[]>("/p1-stocks?take=50", f);

  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState<{ lotNum?: string; colorId?: string; inRoughWeight?: number; p2FiberWeight?: number; p2Waste?: number; }>({});

  const [openLink, setOpenLink] = useState(false);
  const [linkForm, setLinkForm] = useState<{ p2Id?: string; p1Id?: string; takenWeight?: number; moisture?: number; takenWeightCon?: number; roughWeight?: number; }>({});

  async function createP2() {
    try {
      if (!form.lotNum?.trim()) return toast.error("LotNum оруулна уу");
      await apiFetch("/p2-dyeings", { method: "POST", body: JSON.stringify(form) });
      toast.success("P2 Dyeing үүслээ");
      setForm({}); setOpenCreate(false); mutate();
    } catch(e:any){ toast.error(e?.message || "Амжилтгүй"); }
  }

  async function removeP2(id: string) {
    try { await apiFetch(`/p2-dyeings/${id}`, { method: "DELETE" }); mutate(); }
    catch(e:any){ toast.error(e?.message || "Амжилтгүй"); }
  }

  async function linkP1toP2() {
    try {
      if (!linkForm.p2Id || !linkForm.p1Id) return toast.error("P1/P2-оо сонго");
      await apiFetch("/p1-to-p2", { method: "POST", body: JSON.stringify(linkForm) });
      toast.success("Холболт нэмэгдлээ");
      setLinkForm({}); setOpenLink(false);
    } catch(e:any){ toast.error(e?.message || "Амжилтгүй"); }
  }

  const canCreate = useMemo(()=>!!form.lotNum, [form]);
  const canLink = useMemo(()=>!!(linkForm.p1Id && linkForm.p2Id), [linkForm]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">P2 – Будах (Dyeing)</h1>
        <div className="flex gap-2">
          <Dialog open={openLink} onOpenChange={setOpenLink}>
            <DialogTrigger asChild><Button variant="outline"><Link2 className="mr-2 h-4 w-4"/> P1 → P2 холбох</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>P1 → P2 холбох</DialogTitle></DialogHeader>
              <div className="grid gap-3 py-2">
                <Label>P2</Label>
                <Select value={linkForm.p2Id} onValueChange={(v)=>setLinkForm(s=>({...s, p2Id: v}))}>
                  <SelectTrigger><SelectValue placeholder="P2 сонгох"/></SelectTrigger>
                  <SelectContent>
                    {list?.map(x=>(
                      <SelectItem key={x.id} value={x.id}>
                        {x.lotNum} · {x.color?.abbName || x.color?.name || "-"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Label>P1</Label>
                <Select value={linkForm.p1Id} onValueChange={(v)=>setLinkForm(s=>({...s, p1Id: v}))}>
                  <SelectTrigger><SelectValue placeholder="P1 сонгох"/></SelectTrigger>
                  <SelectContent>
                    {p1?.map(i=>(
                      <SelectItem key={i.id} value={i.id}>
                        {new Date(i.dateTime).toLocaleDateString()} · {i.customer?.abbName || i.customer?.name || "-"} · {i.roughWeight ?? "-"}kg
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Авагдсан жин (kg)</Label>
                    <Input type="number" step="0.001" onChange={e=>setLinkForm(s=>({...s, takenWeight: Number(e.target.value)}))}/>
                  </div>
                  <div>
                    <Label>Чийг (%)</Label>
                    <Input type="number" step="0.001" onChange={e=>setLinkForm(s=>({...s, moisture: Number(e.target.value)}))}/>
                  </div>
                  <div>
                    <Label>Confirm weight (kg)</Label>
                    <Input type="number" step="0.001" onChange={e=>setLinkForm(s=>({...s, takenWeightCon: Number(e.target.value)}))}/>
                  </div>
                  <div>
                    <Label>Бохир жин (kg)</Label>
                    <Input type="number" step="0.001" onChange={e=>setLinkForm(s=>({...s, roughWeight: Number(e.target.value)}))}/>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={()=>setOpenLink(false)}>Болих</Button>
                <Button onClick={linkP1toP2} disabled={!canLink}>Хадгалах</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4"/> Шинээр үүсгэх</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>P2 Dyeing үүсгэх</DialogTitle></DialogHeader>
              <div className="grid gap-3 py-2">
                <Label>Lot №</Label>
                <Input value={form.lotNum || ""} onChange={e=>setForm(s=>({...s, lotNum: e.target.value}))}/>
                <Label>Өнгө</Label>
                <Select value={form.colorId} onValueChange={(v)=>setForm(s=>({...s, colorId: v}))}>
                  <SelectTrigger><SelectValue placeholder="Сонгох"/></SelectTrigger>
                  <SelectContent>
                    {colors?.map(c=><SelectItem key={c.id} value={c.id}>{c.abbName || c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>In rough (kg)</Label>
                    <Input type="number" step="0.001" onChange={e=>setForm(s=>({...s, inRoughWeight: Number(e.target.value)}))}/>
                  </div>
                  <div>
                    <Label>Fiber out (kg)</Label>
                    <Input type="number" step="0.001" onChange={e=>setForm(s=>({...s, p2FiberWeight: Number(e.target.value)}))}/>
                  </div>
                  <div>
                    <Label>Waste (kg)</Label>
                    <Input type="number" step="0.001" onChange={e=>setForm(s=>({...s, p2Waste: Number(e.target.value)}))}/>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={()=>setOpenCreate(false)}>Болих</Button>
                <Button onClick={createP2} disabled={!canCreate}>Үүсгэх</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-xl border">
        <div className="p-3 border-b text-sm text-muted-foreground">
          {list ? `${list.length} бичлэг` : "Ачаалж байна…"}
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-6 gap-2 p-3 font-medium text-sm">
            <div>Огноо</div><div>Lot</div><div>Өнгө</div><div className="text-right">In</div><div className="text-right">Fiber</div><div className="text-right">Үйлдэл</div>
          </div>
          {list?.map(x=>(
            <div key={x.id} className="grid grid-cols-6 gap-2 p-3 text-sm">
              <div>{new Date(x.dateTime).toLocaleString()}</div>
              <div className="font-medium">{x.lotNum}</div>
              <div>{x.color?.abbName || x.color?.name || "-"}</div>
              <div className="text-right">{x.inRoughWeight ?? "-"}</div>
              <div className="text-right">{x.p2FiberWeight ?? "-"}</div>
              <div className="text-right">
                <Button size="sm" variant="destructive" onClick={()=>removeP2(x.id)}><Trash2 className="h-4 w-4"/></Button>
              </div>
            </div>
          ))}
          {list && list.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">Хоосон</div>
          )}
        </div>
      </div>
    </div>
  );
}
