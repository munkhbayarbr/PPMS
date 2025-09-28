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

type P6 = { id: string; lotNum: string; batchNum?: number | null; dateTime: string };
type P7 = {
  id: string; lotNum: string; batchNum?: number | null; dateTime: string;
  inRoughWeight?: number | null; p5BelenUtas?: number | null;
};

const f = (url: string) => apiFetch<any>(url);

export default function P7TwistingPage() {
  const { data: session } = useSession();

  // Lists
  const { data: p6List } = useSWR<P6[]>("/p6-doubling?take=100", f);
  const { data: p7ListResp, mutate } = useSWR("/p7-twisting?take=50", f);
  // Normalize if backend returns {items,total,...}
  const p7List: P7[] | undefined = Array.isArray(p7ListResp) ? p7ListResp : p7ListResp?.items;

  // ----- Create P7 Twisting
  const [openCreate, setOpenCreate] = useState(false);
  const [p7Form, setP7Form] = useState<{
    lotNum?: string; batchNum?: number;
    inRoughWeight?: number; p5BelenUtas?: number;
  }>({});

  const canCreate = useMemo(() => !!p7Form.lotNum, [p7Form]);

  async function createP7() {
    try {
      if (!canCreate) return toast.error("Lot № оруулна уу");
      await apiFetch("/p7-twisting", {
        method: "POST",
        body: JSON.stringify({
          lotNum: p7Form.lotNum,
          batchNum: p7Form.batchNum ?? null,
          inRoughWeight: p7Form.inRoughWeight ?? null,
          p5BelenUtas: p7Form.p5BelenUtas ?? null,
          userId: session?.user?.id, // backend requires operator
        }),
      });
      toast.success("P7 Twisting амжилттай үүслээ");
      setP7Form({});
      setOpenCreate(false);
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  async function removeP7(id: string) {
    try {
      await apiFetch(`/p7-twisting/${id}`, { method: "DELETE" });
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  // ----- Link P6 -> P7
  const [openLink, setOpenLink] = useState(false);
  const [linkForm, setLinkForm] = useState<{
    p6Id?: string; p7Id?: string; takenWeight?: number; moisture?: number; takenWeightCon?: number;
  }>({});

  const canLink = useMemo(() => !!(linkForm.p6Id && linkForm.p7Id), [linkForm]);

  async function linkP6toP7() {
    try {
      if (!canLink) return toast.error("P6/P7-гаа сонгоно уу");
      await apiFetch("/p6-to-p7", {
        method: "POST",
        body: JSON.stringify({
          p6Id: linkForm.p6Id!,
          p7Id: linkForm.p7Id!,
          takenWeight: linkForm.takenWeight ?? null,
          moisture: linkForm.moisture ?? null,
          takenWeightCon: linkForm.takenWeightCon ?? null,
        }),
      });
      toast.success("P6 → P7 холболт амжилттай");
      setLinkForm({});
      setOpenLink(false);
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">P7 – Эрчлэлт (Twisting)</h1>
        <div className="flex gap-2">
          {/* Link P6 -> P7 */}
          <Dialog open={openLink} onOpenChange={setOpenLink}>
            <DialogTrigger asChild>
              <Button variant="outline"><Link2 className="mr-2 h-4 w-4" /> P6 → P7 холбох</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>P6 → P7 холбох</DialogTitle></DialogHeader>
              <div className="grid gap-3 py-2">
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

                <Label>P7 Twisting</Label>
                <Select value={linkForm.p7Id} onValueChange={(v)=>setLinkForm(s=>({...s, p7Id: v}))}>
                  <SelectTrigger><SelectValue placeholder="P7 сонгох" /></SelectTrigger>
                  <SelectContent>
                    {p7List?.map(p7 => (
                      <SelectItem key={p7.id} value={p7.id}>
                        {p7.lotNum} · batch {p7.batchNum ?? "-"}
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
                <Button onClick={linkP6toP7} disabled={!canLink}>Хадгалах</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Create P7 */}
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> P7 үүсгэх</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>P7 Twisting үүсгэх</DialogTitle></DialogHeader>
              <div className="grid gap-3 py-2">
                <Label>Lot №</Label>
                <Input value={p7Form.lotNum || ""} onChange={e=>setP7Form(s=>({...s, lotNum: e.target.value}))}/>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Batch №</Label>
                    <Input type="number" value={p7Form.batchNum ?? ""} onChange={e=>setP7Form(s=>({...s, batchNum: Number(e.target.value)}))}/>
                  </div>
                  <div>
                    <Label>In rough (kg)</Label>
                    <Input type="number" step="0.001" value={p7Form.inRoughWeight ?? ""} onChange={e=>setP7Form(s=>({...s, inRoughWeight: Number(e.target.value)}))}/>
                  </div>
                  <div>
                    <Label>Бэлэн утас (kg)</Label>
                    <Input type="number" step="0.001" value={p7Form.p5BelenUtas ?? ""} onChange={e=>setP7Form(s=>({...s, p5BelenUtas: Number(e.target.value)}))}/>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={()=>setOpenCreate(false)}>Болих</Button>
                <Button onClick={createP7} disabled={!canCreate}>Үүсгэх</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* P7 list */}
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
                  <th className="text-right px-3 py-2">Бэлэн утас</th>
                  <th className="text-right px-3 py-2">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {p7List?.map(row => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-2">{new Date(row.dateTime).toLocaleString()}</td>
                    <td className="px-3 py-2">{row.lotNum} (batch {row.batchNum ?? "-"})</td>
                    <td className="px-3 py-2 text-right">{row.inRoughWeight ?? "-"}</td>
                    <td className="px-3 py-2 text-right">{row.p5BelenUtas ?? "-"}</td>
                    <td className="px-3 py-2 text-right">
                      <Button size="sm" variant="destructive" onClick={() => removeP7(row.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {(!p7List || p7List.length === 0) && (
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
