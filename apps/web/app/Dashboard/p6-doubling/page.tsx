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

type P5 = { id: string; lotNum: string; batchNum?: number | null; dateTime: string };
type P6 = {
  id: string; lotNum: string; batchNum?: number | null; dateTime: string;
  inRoughWeight?: number | null; p5DavharUtas?: number | null;
};

const f = (url: string) => apiFetch<any>(url);

export default function P6DoublingPage() {
  const { data: session } = useSession();

  // Lists
  const { data: p5List } = useSWR<P5[]>("/p5-winding?take=100", f);
  const { data: p6ListResp, mutate } = useSWR("/p6-doubling?take=50", f);
  // If backend returns {items,total}, normalize:
  const p6List: P6[] | undefined = Array.isArray(p6ListResp) ? p6ListResp : p6ListResp?.items;

  // ----- Create P6 Doubling
  const [openCreate, setOpenCreate] = useState(false);
  const [p6Form, setP6Form] = useState<{
    lotNum?: string; batchNum?: number;
    inRoughWeight?: number; p5DavharUtas?: number;
  }>({});

  const canCreate = useMemo(() => !!p6Form.lotNum, [p6Form]);

  async function createP6() {
    try {
      if (!canCreate) return toast.error("Lot № оруулна уу");
      await apiFetch("/p6-doubling", {
        method: "POST",
        body: JSON.stringify({
          lotNum: p6Form.lotNum,
          batchNum: p6Form.batchNum ?? null,
          inRoughWeight: p6Form.inRoughWeight ?? null,
          p5DavharUtas: p6Form.p5DavharUtas ?? null,
          userId: session?.user?.id, // ✅ backend requires
        }),
      });
      toast.success("P6 Doubling амжилттай үүслээ");
      setP6Form({});
      setOpenCreate(false);
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  async function removeP6(id: string) {
    try {
      await apiFetch(`/p6-doubling/${id}`, { method: "DELETE" });
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  // ----- Link P5 -> P6
  const [openLink, setOpenLink] = useState(false);
  const [linkForm, setLinkForm] = useState<{
    p5Id?: string; p6Id?: string; takenWeight?: number; moisture?: number; takenWeightCon?: number;
  }>({});

  const canLink = useMemo(() => !!(linkForm.p5Id && linkForm.p6Id), [linkForm]);

  async function linkP5toP6() {
    try {
      if (!canLink) return toast.error("P5/P6-аа сонгоно уу");
      await apiFetch("/p5-to-p6", {
        method: "POST",
        body: JSON.stringify({
          p5Id: linkForm.p5Id!,
          p6Id: linkForm.p6Id!,
          takenWeight: linkForm.takenWeight ?? null,
          moisture: linkForm.moisture ?? null,
          takenWeightCon: linkForm.takenWeightCon ?? null,
        }),
      });
      toast.success("P5 → P6 холболт амжилттай");
      setLinkForm({});
      setOpenLink(false);
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">P6 – Давхарлах (Doubling)</h1>
        <div className="flex gap-2">
          {/* Link P5 -> P6 */}
          <Dialog open={openLink} onOpenChange={setOpenLink}>
            <DialogTrigger asChild>
              <Button variant="outline"><Link2 className="mr-2 h-4 w-4" /> P5 → P6 холбох</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>P5 → P6 холбох</DialogTitle></DialogHeader>
              <div className="grid gap-3 py-2">
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

                <Label>P6 Doubling</Label>
                <Select value={linkForm.p6Id} onValueChange={(v)=>setLinkForm(s=>({...s, p6Id: v}))}>
                  <SelectTrigger><SelectValue placeholder="P6 сонгох" /></SelectTrigger>
                  <SelectContent>
                    {p6List?.map(p6 => (
                      <SelectItem key={p6.id} value={p6.id}>
                        {p6.lotNum} · batch {p6.batchNum ?? "-"}
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
                <Button onClick={linkP5toP6} disabled={!canLink}>Хадгалах</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Create P6 */}
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> P6 үүсгэх</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>P6 Doubling үүсгэх</DialogTitle></DialogHeader>
              <div className="grid gap-3 py-2">
                <Label>Lot №</Label>
                <Input value={p6Form.lotNum || ""} onChange={e=>setP6Form(s=>({...s, lotNum: e.target.value}))}/>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Batch №</Label>
                    <Input type="number" value={p6Form.batchNum ?? ""} onChange={e=>setP6Form(s=>({...s, batchNum: Number(e.target.value)}))}/>
                  </div>
                  <div>
                    <Label>In rough (kg)</Label>
                    <Input type="number" step="0.001" value={p6Form.inRoughWeight ?? ""} onChange={e=>setP6Form(s=>({...s, inRoughWeight: Number(e.target.value)}))}/>
                  </div>
                  <div>
                    <Label>Давхар утас (kg)</Label>
                    <Input type="number" step="0.001" value={p6Form.p5DavharUtas ?? ""} onChange={e=>setP6Form(s=>({...s, p5DavharUtas: Number(e.target.value)}))}/>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={()=>setOpenCreate(false)}>Болих</Button>
                <Button onClick={createP6} disabled={!canCreate}>Үүсгэх</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* P6 list */}
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
                  <th className="text-right px-3 py-2">Давхар утас</th>
                  <th className="text-right px-3 py-2">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {p6List?.map(row => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-2">{new Date(row.dateTime).toLocaleString()}</td>
                    <td className="px-3 py-2">{row.lotNum} (batch {row.batchNum ?? "-"})</td>
                    <td className="px-3 py-2 text-right">{row.inRoughWeight ?? "-"}</td>
                    <td className="px-3 py-2 text-right">{row.p5DavharUtas ?? "-"}</td>
                    <td className="px-3 py-2 text-right">
                      <Button size="sm" variant="destructive" onClick={() => removeP6(row.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {(!p6List || p6List.length === 0) && (
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
