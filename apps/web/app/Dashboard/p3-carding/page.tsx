"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Link2, Trash2 } from "lucide-react";
import { toast } from "sonner";

type OutColor = { id: string; name: string; abbName?: string | null };
type P2 = { id: string; lotNum: string; dateTime: string; color?: OutColor | null; inRoughWeight?: number | null; p2FiberWeight?: number | null; p2Waste?: number | null; };
type P3 = { id: string; lotNum: string; batchNum?: number | null; dateTime: string; inRoughWeight?: number | null; p3RovenWeight?: number | null; p3Waste?: number | null; };

const f = (url: string) => apiFetch<any>(url);

export default function P3CardingPage() {
  const { data: session } = useSession();

  // lists
  const { data: p2List } = useSWR<P2[]>("/p2-dyeings?take=100", f);
  const { data: p3List, mutate } = useSWR<P3[]>("/p3-carding?take=50", f);

  // create P3
  const [openCreate, setOpenCreate] = useState(false);
  const [p3Form, setP3Form] = useState<{
    lotNum?: string; batchNum?: number; inRoughWeight?: number; p3RovenWeight?: number; p3Waste?: number;
  }>({});
  const canCreate = useMemo(() => !!p3Form.lotNum, [p3Form]);

  async function createP3() {
    try {
      if (!canCreate) return toast.error("Lot № оруулна уу");
      await apiFetch("/p3-carding", {
        method: "POST",
        body: JSON.stringify({
          lotNum: p3Form.lotNum,
          batchNum: p3Form.batchNum ?? null,
          inRoughWeight: p3Form.inRoughWeight ?? null,
          p3RovenWeight: p3Form.p3RovenWeight ?? null,
          p3Waste: p3Form.p3Waste ?? null,
          userId: session?.user?.id, // ✅ required by backend DTO
        }),
      });
      toast.success("P3 Carding амжилттай үүслээ");
      setP3Form({});
      setOpenCreate(false);
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  async function removeP3(id: string) {
    try {
      await apiFetch(`/p3-carding/${id}`, { method: "DELETE" });
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  // link P2 -> P3
  const [openLink, setOpenLink] = useState(false);
  const [linkForm, setLinkForm] = useState<{
    p2Id?: string; p3Id?: string; takenWeight?: number; moisture?: number; takenWeightCon?: number;
  }>({});
  const canLink = useMemo(() => !!(linkForm.p2Id && linkForm.p3Id), [linkForm]);

  async function linkP2toP3() {
    try {
      if (!canLink) return toast.error("P2/P3-аа сонгоно уу");
      await apiFetch("/p2-to-p3", {
        method: "POST",
        body: JSON.stringify({
          p2Id: linkForm.p2Id!,
          p3Id: linkForm.p3Id!,
          takenWeight: linkForm.takenWeight ?? null,
          moisture: linkForm.moisture ?? null,
          takenWeightCon: linkForm.takenWeightCon ?? null,
        }),
      });
      toast.success("P2 → P3 холболт амжилттай");
      setLinkForm({});
      setOpenLink(false);
      // optional: mutate a linkage list if you render one
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">P3 – Самнах (Carding)</h1>
        <div className="flex gap-2">
          {/* Link dialog */}
          <Dialog open={openLink} onOpenChange={setOpenLink}>
            <DialogTrigger asChild>
              <Button variant="outline"><Link2 className="mr-2 h-4 w-4" /> P2 → P3 холбох</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>P2 → P3 холбох</DialogTitle></DialogHeader>
              <div className="grid gap-3 py-2">
                <Label>P2 Dyeing</Label>
                <Select value={linkForm.p2Id} onValueChange={(v)=>setLinkForm(s=>({...s, p2Id: v}))}>
                  <SelectTrigger><SelectValue placeholder="P2 сонгох" /></SelectTrigger>
                  <SelectContent>
                    {p2List?.map(p2 => (
                      <SelectItem key={p2.id} value={p2.id}>
                        {p2.lotNum} · {p2.color?.abbName || p2.color?.name || "-"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Label>P3 Carding</Label>
                <Select value={linkForm.p3Id} onValueChange={(v)=>setLinkForm(s=>({...s, p3Id: v}))}>
                  <SelectTrigger><SelectValue placeholder="P3 сонгох" /></SelectTrigger>
                  <SelectContent>
                    {p3List?.map(p3 => (
                      <SelectItem key={p3.id} value={p3.id}>
                        {p3.lotNum} · batch {p3.batchNum ?? "-"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Авагдсан жин (kg)</Label>
                    <Input type="number" step="0.001" onChange={e=>setLinkForm(s=>({...s, takenWeight: Number(e.target.value)}))}/>
                  </div>
                  <div>
                    <Label>Чийг (%)</Label>
                    <Input type="number" step="0.001" onChange={e=>setLinkForm(s=>({...s, moisture: Number(e.target.value)}))}/>
                  </div>
                  <div>
                    <Label>Confirm (kg)</Label>
                    <Input type="number" step="0.001" onChange={e=>setLinkForm(s=>({...s, takenWeightCon: Number(e.target.value)}))}/>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={()=>setOpenLink(false)}>Болих</Button>
                <Button onClick={linkP2toP3} disabled={!canLink}>Хадгалах</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Create P3 dialog */}
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> P3 үүсгэх</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>P3 Carding үүсгэх</DialogTitle></DialogHeader>
              <div className="grid gap-3 py-2">
                <Label>Lot №</Label>
                <Input value={p3Form.lotNum || ""} onChange={e=>setP3Form(s=>({...s, lotNum: e.target.value}))}/>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Batch №</Label>
                    <Input type="number" value={p3Form.batchNum ?? ""} onChange={e=>setP3Form(s=>({...s, batchNum: Number(e.target.value)}))}/>
                  </div>
                  <div>
                    <Label>In rough (kg)</Label>
                    <Input type="number" step="0.001" value={p3Form.inRoughWeight ?? ""} onChange={e=>setP3Form(s=>({...s, inRoughWeight: Number(e.target.value)}))}/>
                  </div>
                  <div>
                    <Label>Roven out (kg)</Label>
                    <Input type="number" step="0.001" value={p3Form.p3RovenWeight ?? ""} onChange={e=>setP3Form(s=>({...s, p3RovenWeight: Number(e.target.value)}))}/>
                  </div>
                </div>
                <Label>Waste (kg)</Label>
                <Input type="number" step="0.001" value={p3Form.p3Waste ?? ""} onChange={e=>setP3Form(s=>({...s, p3Waste: Number(e.target.value)}))}/>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={()=>setOpenCreate(false)}>Болих</Button>
                <Button onClick={createP3} disabled={!canCreate}>Үүсгэх</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* P3 list */}
      <Card>
        <CardHeader><CardTitle>Сүүлийн бүртгэлүүд</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-3 py-2">Огноо</th>
                  <th className="text-left px-3 py-2">Lot</th>
                  <th className="text-right px-3 py-2">In</th>
                  <th className="text-right px-3 py-2">Roven</th>
                  <th className="text-right px-3 py-2">Waste</th>
                  <th className="text-right px-3 py-2">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {p3List?.map(row => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-2">{new Date(row.dateTime).toLocaleString()}</td>
                    <td className="px-3 py-2">{row.lotNum} (batch {row.batchNum ?? "-"})</td>
                    <td className="px-3 py-2 text-right">{row.inRoughWeight ?? "-"}</td>
                    <td className="px-3 py-2 text-right">{row.p3RovenWeight ?? "-"}</td>
                    <td className="px-3 py-2 text-right">{row.p3Waste ?? "-"}</td>
                    <td className="px-3 py-2 text-right">
                      <Button size="sm" variant="destructive" onClick={() => removeP3(row.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {(!p3List || p3List.length === 0) && (
                  <tr><td className="px-3 py-6 text-center text-muted-foreground" colSpan={6}>Хоосон</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
