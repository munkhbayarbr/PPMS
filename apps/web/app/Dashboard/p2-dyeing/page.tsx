"use client";

import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Link2, Plus, Trash2 } from "lucide-react";

import { apiFetch } from "@/lib/api"; // ✅ use this everywhere
import { createP2Batch } from "../../components/services/stages";
import { StageStartButton, StageCompleteButton } from "../../components/stages/StageActions";

type OutColor = { id: string; name: string; abbName?: string | null };
type P2 = {
  id: string;
  lotNum: string;
  dateTime: string;
  color?: OutColor | null;
  inRoughWeight?: number | null;
  p2FiberWeight?: number | null;
  p2Waste?: number | null;
};
type P1 = {
  id: string;
  code?: string;
  dateTime: string;
  customer?: { name: string; abbName?: string | null } | null;
  roughWeight?: number | null;
};

// ✅ SWR fetcher that calls your apiFetch wrapper (sends credentials, handles base URL, etc.)
const f = (url: string) => apiFetch<any>(url);

export default function P2DyeingPage() {
  const { data: session } = useSession();
  const userId = (session as any)?.user?.id as string | undefined;

  // P2 list (with error/loading)
  const { data: listResp, error, isLoading, mutate } = useSWR("/p2-dyeings?take=50", f);
  useEffect(() => {
    if (error) console.error("P2 list error:", error);
  }, [error]);

  // Reference data
  const { data: colorsResp } = useSWR("/out-colors?take=1000", f);
  const colors: OutColor[] = colorsResp?.items ?? colorsResp ?? [];

  // P1 list for linking
  const { data: p1Resp } = useSWR("/p1-stocks?take=50", f);
  const p1List: P1[] = p1Resp?.items ?? p1Resp ?? [];

  // Normalize P2 list
  const list: P2[] = Array.isArray(listResp)
    ? listResp
    : Array.isArray(listResp?.items)
    ? listResp.items
    : [];

  // --- Create P2 (uses createP2Batch) ---
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState<{
    lotNum?: string;
    colorId?: string;
    inRoughWeight?: number;
    p2FiberWeight?: number;
    p2Waste?: number;
    orderId?: string;
    stageIndex?: number;
  }>({});
  const canCreate = useMemo(() => !!form.lotNum, [form]);

  async function createP2() {
    try {
      if (!form.lotNum?.trim()) return toast.error("Lot № оруулна уу");
      if (!userId) return toast.error("Хэн бүртгэж байгааг тодорхойгүй (session).");

      await createP2Batch({
        lotNum: form.lotNum!,
        colorId: form.colorId,
        inRoughWeight: form.inRoughWeight,
        p2FiberWeight: form.p2FiberWeight,
        p2Waste: form.p2Waste,
        userId,
        orderId: form.orderId,
        stageIndex: form.stageIndex,
      });

      toast.success("P2 Dyeing үүслээ");
      setForm({});
      setOpenCreate(false);
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  // --- Link P1 -> P2 (POST via apiFetch) ---
  const [openLink, setOpenLink] = useState(false);
  const [linkForm, setLinkForm] = useState<{
    p2Id?: string;
    p1Id?: string;
    takenWeight?: number;
    moisture?: number;
    takenWeightCon?: number;
    roughWeight?: number;
  }>({});
  const canLink = useMemo(() => !!(linkForm.p1Id && linkForm.p2Id), [linkForm]);

  async function linkP1toP2() {
    try {
      if (!canLink) return toast.error("P1/P2-оо сонгоно уу");
      await apiFetch("/p1-to-p2", {
        method: "POST",
        body: JSON.stringify(linkForm),
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Холболт нэмэгдлээ");
      setLinkForm({});
      setOpenLink(false);
      // mutate(); // if you also render linkage-derived data
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  // --- Delete P2 row (DELETE via apiFetch) ---
  async function removeP2(id: string) {
    try {
      await apiFetch(`/p2-dyeings/${id}`, { method: "DELETE" });
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Амжилтгүй");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">P2 – Будах (Dyeing)</h1>

        <div className="flex gap-2">
          {/* Link P1 -> P2 */}
          <Dialog open={openLink} onOpenChange={setOpenLink}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Link2 className="mr-2 h-4 w-4" /> P1 → P2 холбох
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>P1 → P2 холбох</DialogTitle>
              </DialogHeader>

              <div className="grid gap-3 py-2">
                <Label>P2</Label>
                <Select
                  value={linkForm.p2Id}
                  onValueChange={(v) => setLinkForm((s) => ({ ...s, p2Id: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="P2 сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    {list.map((x) => (
                      <SelectItem key={x.id} value={x.id}>
                        {x.lotNum} · {x.color?.abbName || x.color?.name || "-"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Label>P1</Label>
                <Select
                  value={linkForm.p1Id}
                  onValueChange={(v) => setLinkForm((s) => ({ ...s, p1Id: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="P1 сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    {p1List.map((i) => (
                      <SelectItem key={i.id} value={i.id}>
                        {new Date(i.dateTime).toLocaleDateString()} ·{" "}
                        {i.customer?.abbName || i.customer?.name || "-"} ·{" "}
                        {i.roughWeight ?? "-"}kg
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Авагдсан жин (kg)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      onChange={(e) => setLinkForm((s) => ({ ...s, takenWeight: Number(e.target.value) || undefined }))}
                    />
                  </div>
                  <div>
                    <Label>Чийг (%)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      onChange={(e) => setLinkForm((s) => ({ ...s, moisture: Number(e.target.value) || undefined }))}
                    />
                  </div>
                  <div>
                    <Label>Confirm weight (kg)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      onChange={(e) => setLinkForm((s) => ({ ...s, takenWeightCon: Number(e.target.value) || undefined }))}
                    />
                  </div>
                  <div>
                    <Label>Бохир жин (kg)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      onChange={(e) => setLinkForm((s) => ({ ...s, roughWeight: Number(e.target.value) || undefined }))}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenLink(false)}>
                  Болих
                </Button>
                <Button onClick={linkP1toP2} disabled={!canLink}>
                  Хадгалах
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Create P2 */}
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Шинээр үүсгэх
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>P2 Dyeing үүсгэх</DialogTitle>
              </DialogHeader>

              <div className="grid gap-3 py-2">
                <Label>Lot №</Label>
                <Input
                  value={form.lotNum || ""}
                  onChange={(e) => setForm((s) => ({ ...s, lotNum: e.target.value }))}
                />

                <Label>Өнгө</Label>
                <Select
                  value={form.colorId}
                  onValueChange={(v) => setForm((s) => ({ ...s, colorId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.abbName || c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>In rough (kg)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      onChange={(e) => setForm((s) => ({ ...s, inRoughWeight: Number(e.target.value) || undefined }))}
                    />
                  </div>
                  <div>
                    <Label>Fiber out (kg)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      onChange={(e) => setForm((s) => ({ ...s, p2FiberWeight: Number(e.target.value) || undefined }))}
                    />
                  </div>
                  <div>
                    <Label>Waste (kg)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      onChange={(e) => setForm((s) => ({ ...s, p2Waste: Number(e.target.value) || undefined }))}
                    />
                  </div>
                </div>

                {/* Optional workflow association */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <Label>Order ID (optional)</Label>
                    <Input
                      value={form.orderId || ""}
                      onChange={(e) => setForm((s) => ({ ...s, orderId: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Stage Index (optional)</Label>
                    <Input
                      type="number"
                      value={form.stageIndex ?? ""}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          stageIndex: e.target.value === "" ? undefined : Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenCreate(false)}>
                  Болих
                </Button>
                <Button onClick={createP2} disabled={!canCreate}>
                  Үүсгэх
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick workflow controls */}
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Order ID"
          value={form.orderId || ""}
          onChange={(e) => setForm((s) => ({ ...s, orderId: e.target.value }))}
          className="w-56"
        />
        <Input
          placeholder="Stage Index"
          type="number"
          value={form.stageIndex ?? ""}
          onChange={(e) =>
            setForm((s) => ({
              ...s,
              stageIndex: e.target.value === "" ? undefined : Number(e.target.value),
            }))
          }
          className="w-36"
        />
        <StageStartButton
          stageCode="p2"
          orderId={form.orderId || ""}
          stageIndex={form.stageIndex ?? 0}
          onDone={mutate}
        />
        <StageCompleteButton
          stageCode="p2"
          orderId={form.orderId || ""}
          stageIndex={form.stageIndex ?? 0}
          onDone={mutate}
        />
      </div>

      {/* List */}
      <div className="rounded-xl border">
        <div className="p-3 border-b text-sm text-muted-foreground">
          {error
            ? "Татаж чадсангүй"
            : isLoading
            ? "Ачаалж байна…"
            : `${list.length} бичлэг`}
        </div>

        <div className="divide-y">
          <div className="grid grid-cols-6 gap-2 p-3 font-medium text-sm">
            <div>Огноо</div>
            <div>Lot</div>
            <div>Өнгө</div>
            <div className="text-right">In</div>
            <div className="text-right">Fiber</div>
            <div className="text-right">Үйлдэл</div>
          </div>

          {list.map((x) => (
            <div key={x.id} className="grid grid-cols-6 gap-2 p-3 text-sm">
              <div>{new Date(x.dateTime).toLocaleString()}</div>
              <div className="font-medium">{x.lotNum}</div>
              <div>{x.color?.abbName || x.color?.name || "-"}</div>
              <div className="text-right">{x.inRoughWeight ?? "-"}</div>
              <div className="text-right">{x.p2FiberWeight ?? "-"}</div>
              <div className="text-right">
                <Button size="sm" variant="destructive" onClick={() => removeP2(x.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {!isLoading && !error && list.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">Хоосон</div>
          )}
        </div>
      </div>
    </div>
  );
}
