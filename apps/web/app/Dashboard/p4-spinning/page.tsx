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

type P3 = { id: string; lotNum: string; batchNum?: number | null; dateTime: string; p3RovenWeight?: number | null; };
type P4 = { id: string; lotNum: string; batchNum?: number | null; dateTime: string; inRovenWeight?: number | null; p4YarnWeight?: number | null; p4Waste?: number | null; };

const f = (url: string) => apiFetch<any>(url);

export default function P4SpinningPage() {
  const { data: session } = useSession();

  // lists
  const { data: p3List } = useSWR<P3[]>("/p3-carding?take=100", f);
  const { data: p4List, mutate } = useSWR<P4[]>("/p4-spinning?take=50", f);

  // create P4
  const [openCreate, setOpenCreate] = useState(false);
  const [p4Form, setP4Form] = useState<{
    lotNum?: string; batchNum?: number; inRovenWeight?: number; p4YarnWeight?: number; p4Waste?: number;
  }>({});
  const canCreate = useMemo(() => !!p4Form.lotNum, [p4Form]);

  async function createP4() {
    try {
      if (!canCreate) return toast.error("Lot № оруулна уу");
      await apiFetch("/p4-spinning", {
        method: "POST",
        body: JSON.stringify({
          lotNum: p4Form.lotNum,
          batchNum: p4Form.batchNum ?? null,
          inRovenWeight: p4Form.inRovenWeight ?? null,
          p4YarnWeight: p4Form.p4YarnWeight ?? null,
          p4Waste: p4Form.p4Waste ?? null,
          userId: session?.user?.id, // ✅ backend requires userId
        }),
      });
      toast.success("P4 Spinning амжилттай үүслээ");
      setP4Form({});
      setOpenCreate(false);
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  async function removeP4(id: string) {
    try {
      await apiFetch(`/p4-spinning/${id}`, { method: "DELETE" });
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  // link P3 -> P4
  const [openLink, setOpenLink] = useState(false);
  const [linkForm, setLinkForm] = useState<{
    p3Id?: string; p4Id?: string; takenWeight?: number; moisture?: number; takenWeightCon?: number;
  }>({});
  const canLink = useMemo(() => !!(linkForm.p3Id && linkForm.p4Id), [linkForm]);

  async function linkP3toP4() {
    try {
      if (!canLink) return toast.error("P3/P4-өө сонгоно уу");
      await apiFetch("/p3-to-p4", {
        method: "POST",
        body: JSON.stringify({
          p3Id: linkForm.p3Id!,
          p4Id: linkForm.p4Id!,
          takenWeight: linkForm.takenWeight ?? null,
          moisture: linkForm.moisture ?? null,
          takenWeightCon: linkForm.takenWeightCon ?? null,
        }),
      });
      toast.success("P3 → P4 холболт амжилттай");
      setLinkForm({});
      setOpenLink(false);
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">P4 – Эрчлэх (Spinning)</h1>
        <div className="flex gap-2">
          {/* Link dialog */}
          <Dialog open={openLink} onOpenChange={setOpenLink}>
            <DialogTrigger asChild>
              <Button variant="outline"><Link2 className="mr-2 h-4 w-4" /> P3 → P4 холбох</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>P3 → P4 холбох</DialogTitle></DialogHeader>
              <div className="grid gap-3 py-2">
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

                <Label>P4 Spinning</Label>
                <Select value={linkForm.p4Id} onValueChange={(v)=>setLinkForm(s=>({...s, p4Id: v}))}>
                  <SelectTrigger><SelectValue placeholder="P4 сонгох" /></SelectTrigger>
                  <SelectContent>
                    {p4List?.map(p4 => (
                      <SelectItem key={p4.id} value={p4.id}>
                        {p4.lotNum} · batch {p4.batchNum ?? "-"}
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
                <Button onClick={linkP3toP4} disabled={!canLink}>Хадгалах</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Create P4 dialog */}
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> P4 үүсгэх</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>P4 Spinning үүсгэх</DialogTitle></DialogHeader>
              <div className="grid gap-3 py-2">
                <Label>Lot №</Label>
                <Input value={p4Form.lotNum || ""} onChange={e=>setP4Form(s=>({...s, lotNum: e.target.value}))}/>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Batch №</Label>
                    <Input type="number" value={p4Form.batchNum ?? ""} onChange={e=>setP4Form(s=>({...s, batchNum: Number(e.target.value)}))}/>
                  </div>
                  <div>
                    <Label>In roven (kg)</Label>
                    <Input type="number" step="0.001" value={p4Form.inRovenWeight ?? ""} onChange={e=>setP4Form(s=>({...s, inRovenWeight: Number(e.target.value)}))}/>
                  </div>
                  <div>
                    <Label>Yarn out (kg)</Label>
                    <Input type="number" step="0.001" value={p4Form.p4YarnWeight ?? ""} onChange={e=>setP4Form(s=>({...s, p4YarnWeight: Number(e.target.value)}))}/>
                  </div>
                </div>
                <Label>Waste (kg)</Label>
                <Input type="number" step="0.001" value={p4Form.p4Waste ?? ""} onChange={e=>setP4Form(s=>({...s, p4Waste: Number(e.target.value)}))}/>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={()=>setOpenCreate(false)}>Болих</Button>
                <Button onClick={createP4} disabled={!canCreate}>Үүсгэх</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* P4 list */}
      <Card>
        <CardHeader><CardTitle>Сүүлийн бүртгэлүүд</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-3 py-2">Огноо</th>
                  <th className="text-left px-3 py-2">Lot</th>
                  <th className="text-right px-3 py-2">In roven</th>
                  <th className="text-right px-3 py-2">Yarn</th>
                  <th className="text-right px-3 py-2">Waste</th>
                  <th className="text-right px-3 py-2">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {p4List?.map(row => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-2">{new Date(row.dateTime).toLocaleString()}</td>
                    <td className="px-3 py-2">{row.lotNum} (batch {row.batchNum ?? "-"})</td>
                    <td className="px-3 py-2 text-right">{row.inRovenWeight ?? "-"}</td>
                    <td className="px-3 py-2 text-right">{row.p4YarnWeight ?? "-"}</td>
                    <td className="px-3 py-2 text-right">{row.p4Waste ?? "-"}</td>
                    <td className="px-3 py-2 text-right">
                      <Button size="sm" variant="destructive" onClick={() => removeP4(row.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {(!p4List || p4List.length === 0) && (
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
