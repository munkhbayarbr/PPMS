"use client";

import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { StageStartButton, StageCompleteButton } from "../../components/stages/StageActions";

type OrderStage = {
  index: number;
  stageCode: string;
  status: string;
  startedAt?: string | null;
  finishedAt?: string | null;
};

type Order = {
  id: string;
  name: string;
  customer?: { name: string } | null;
  stages: OrderStage[];
  createdAt: string;
};

const f = (url: string) => apiFetch<any>(url);

export default function OrdersPage() {
  const { data: resp, mutate } = useSWR("/orders?includeStages=true", f);
  const orders: Order[] = resp?.items ?? resp ?? [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Захиалгууд (Orders)</h1>

      <div className="rounded-xl border overflow-hidden">
        <div className="grid grid-cols-6 gap-2 p-3 border-b font-medium text-sm bg-muted/30">
          <div>Захиалга</div>
          <div>Үйлчлүүлэгч</div>
          <div>Үүсгэсэн</div>
          <div className="col-span-2">Үйл явц (Stages)</div>
          <div className="text-right">Үйлдэл</div>
        </div>

        {orders.map((o) => (
          <div
            key={o.id}
            className="grid grid-cols-6 gap-2 p-3 border-b text-sm items-center"
          >
            <div className="font-medium">{o.name}</div>
            <div>{o.customer?.name ?? "-"}</div>
            <div>{new Date(o.createdAt).toLocaleDateString()}</div>

            {/* Stage overview */}
            <div className="col-span-2 flex flex-wrap gap-2">
              {o.stages?.map((s) => (
                <div
                  key={s.index}
                  className={`px-2 py-1 rounded text-xs border ${
                    s.status === "DONE"
                      ? "bg-green-100 border-green-400 text-green-800"
                      : s.status === "IN_PROGRESS"
                      ? "bg-blue-100 border-blue-400 text-blue-800"
                      : "bg-gray-100 border-gray-400 text-gray-600"
                  }`}
                >
                  {s.stageCode} · {s.status}
                </div>
              ))}
            </div>

            {/* Quick actions (manager) */}
            <div className="flex gap-2 justify-end">
              <StageStartButton
                stageCode="p1"
                orderId={o.id}
                stageIndex={0}
                onDone={mutate}
              />
              <StageCompleteButton
                stageCode="p1"
                orderId={o.id}
                stageIndex={0}
                onDone={mutate}
              />
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="p-6 text-center text-muted-foreground">
            Хоосон (No orders yet)
          </div>
        )}
      </div>
    </div>
  );
}
