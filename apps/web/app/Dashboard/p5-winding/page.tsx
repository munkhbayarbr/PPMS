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

type P4 = { id: string; lotNum: string; batchNum?: number | null; dateTime: string };
type P5 = {
  id: string; lotNum: string; batchNum?: number | null; dateTime: string;
  inRoughWeight?: number | null; p5OroosonUtas?: number | null;
};

const f = (url: string) => apiFetch<any>(url);

export default function P5WindingPage() {
  const { data: session } = useSession();

  // lists
  const { data: p4List } = useSWR<P4[]>("/p4-spinning?take=100", f);
  const { data: p5List, mutate } = useSWR<P5[]>("/p5-winding?take=50", f);

  // ---- Create P5
  const [openCreate, setOpenCreate] = useState(false);
  const [p5Form, setP5Form] = useState<{
    lotNum?: string; batchNum?: number;
    inRoughWeight?: number; p5OroosonUtas?: number;
  }>({});

  const canCreate = useMemo(() => !!p5Form.lotNum, [p5Form]);

  async function createP5() {
    try {
      if (!canCreate) return toast.error("Lot № оруулна уу");
      await apiFetch("/p5-winding", {
        method: "POST",
        body: JSON.stringify({
          lotNum: p5Form.lotNum,
          batchNum: p5Form.batchNum ?? null,
          inRoughWeight: p5Form.inRoughWeight ?? null,
          p5OroosonUtas: p5Form.p5OroosonUtas ?? null,
          userId: session?.user?.id, // ✅ required by backend
        }),
      });
      toast.success("P5 Winding амжилттай үүслээ");
      setP5Form({});
      setOpenCreate(false);
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  async function removeP5(id: string) {
    try {
      await apiFetch(`/p5-winding/${id}`, { method: "DELETE" });
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  // ---- Link P4 -> P5
  const [openLink, setOpenLink] = useState(false);
  const [linkForm, setLinkForm] = useState<{
    p4Id?: string; p5Id?: string; takenWeight?: number; moisture?: number; takenWeightCon?: number;
  }>({});

  const canLink = useMemo(() => !!(linkForm.p4Id && linkForm.p5Id), [linkForm]);

  async function linkP4toP5() {
    try {
      if (!canLink) return toast.error("P4/P5-аа сонгоно уу");
      await apiFetch("/p4-to-p5", {
        method: "POST",
        body: JSON.stringify({
          p4Id: linkForm.p4Id!,
          p5Id: linkForm.p5Id!,
          takenWeight: linkForm.takenWeight ?? null,
          moisture: linkForm.moisture ?? null,
          takenWeightCon: linkForm.takenWeightCon ?? null,
        }),
      });
      toast.success("P4 → P5 холболт амжилттай");
      setLinkForm({});
      setOpenLink(false);
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">P5 – Ороох (Winding)</h1>
        <div className="flex gap-2">
          {/* Link dialog */}
          <Dialog open={openLink} onOpenChange={setOpenLink}>
            <DialogTrigger asChild>
              <Button variant="outline"><Link2 className="mr-2 h-4 w-4" /> P4 → P5 холбох</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>P4 → P5 холбох</DialogTitle></DialogHeader>
              <div className="grid gap-3 py-2">
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

                <Label>P5 Winding</Label>
                <Select value={linkForm.p5Id} onValueChange={(v)=>setLinkForm(s=>({...s, p5Id: v}))}>
                  <SelectTrigger><SelectValue placeholder="P5 сонгох" /></SelectTrigger>
                  <SelectContent>
                    {p5List?.map(p5 => (
                      <SelectItem key={p5.id} value={p5.id}>
                        {p5.lotNum} · batch {p5.batchNum ?? "-"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Авагдсан жин (kg)</Label>
                    <Input type="number" step="0.001"
                      onChange={e=>setLinkForm(s=>({...s, takenWeight: Number(e.target.value)}))}/>
                  </div>
                  <div>
                    <Label>Чийг (%)</Label>
                    <Input type="number" step="0.001"
                      onChange={e=>setLinkForm(s=>({...s, moisture: Number(e.target.value)}))}/>
                  </div>
                  <div>
                    <Label>Confirm (kg)</Label>
                    <Input type="number" step="0.001"
                      onChange={e=>setLinkForm(s=>({...s, takenWeightCon: Number(e.target.value)}))}/>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={()=>setOpenLink(false)}>Болих</Button>
                <Button onClick={linkP4toP5} disabled={!canLink}>Хадгалах</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Create dialog */}
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> P5 үүсгэх</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>P5 Winding үүсгэх</DialogTitle></DialogHeader>
              <div className="grid gap-3 py-2">
                <Label>Lot №</Label>
                <Input value={p5Form.lotNum || ""} onChange={e=>setP5Form(s=>({...s, lotNum: e.target.value}))}/>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Batch №</Label>
                    <Input type="number" value={p5Form.batchNum ?? ""} onChange={e=>setP5Form(s=>({...s, batchNum: Number(e.target.value)}))}/>
                  </div>
                  <div>
                    <Label>In rough (kg)</Label>
                    <Input type="number" step="0.001" value={p5Form.inRoughWeight ?? ""} onChange={e=>setP5Form(s=>({...s, inRoughWeight: Number(e.target.value)}))}/>
                  </div>
                  <div>
                    <Label>Wound yarn (kg)</Label>
                    <Input type="number" step="0.001" value={p5Form.p5OroosonUtas ?? ""} onChange={e=>setP5Form(s=>({...s, p5OroosonUtas: Number(e.target.value)}))}/>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={()=>setOpenCreate(false)}>Болих</Button>
                <Button onClick={createP5} disabled={!canCreate}>Үүсгэх</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* P5 list */}
      <Card>
        <CardHeader><CardTitle>Сүүлийн бүртгэлүүд</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-3 py-2">Огноо</th>
                  <th className="text-left px-3 py-2">Lot</th>
                  <th className="text-right px-3 py-2">In rough</th>
                  <th className="text-right px-3 py-2">Wound yarn</th>
                  <th className="text-right px-3 py-2">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {p5List?.map(row => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-2">{new Date(row.dateTime).toLocaleString()}</td>
                    <td className="px-3 py-2">{row.lotNum} (batch {row.batchNum ?? "-"})</td>
                    <td className="px-3 py-2 text-right">{row.inRoughWeight ?? "-"}</td>
                    <td className="px-3 py-2 text-right">{row.p5OroosonUtas ?? "-"}</td>
                    <td className="px-3 py-2 text-right">
                      <Button size="sm" variant="destructive" onClick={() => removeP5(row.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {(!p5List || p5List.length === 0) && (
                  <tr><td className="px-3 py-6 text-center text-muted-foreground" colSpan={5}>Хоосон</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
