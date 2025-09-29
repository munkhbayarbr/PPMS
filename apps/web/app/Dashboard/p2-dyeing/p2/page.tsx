'use client';

import { useState } from 'react';
import { createP2Batch, CreateP2Batch } from '../../../components/services/stages';
import { StageStartButton, StageCompleteButton } from '../../../components/stages/StageActions';

export default function P2Page() {
  const [form, setForm] = useState<CreateP2Batch>({
    lotNum: '',
    colorId: undefined,
    inRoughWeight: '',
    p2FiberWeight: '',
    p2Waste: '',
    userId: '',

    // link to order workflow (optional)
    orderId: '',
    stageIndex: 0,
  });

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setMsg(null);
    try {
      const payload: CreateP2Batch = {
        ...form,
        dateTime: form.dateTime ? new Date(form.dateTime) : undefined,
      };

      await createP2Batch(payload);
      setMsg('P2 batch created.');
    } catch (e: any) {
      setMsg(e?.message ?? 'Failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">P2 – Dyeing</h1>

      {/* Workflow controls */}
      <div className="flex gap-2 items-center">
        <input
          placeholder="Order ID"
          className="border px-2 py-1 rounded"
          value={form.orderId ?? ''}
          onChange={e => setForm(f => ({ ...f, orderId: e.target.value }))}
        />
        <input
          placeholder="Stage Index"
          type="number"
          className="border px-2 py-1 rounded w-36"
          value={form.stageIndex ?? 0}
          onChange={e => setForm(f => ({ ...f, stageIndex: Number(e.target.value) }))}
        />

        <StageStartButton
          stageCode="p2"
          orderId={form.orderId || ''}
          stageIndex={form.stageIndex ?? 0}
        />
        <StageCompleteButton
          stageCode="p2"
          orderId={form.orderId || ''}
          stageIndex={form.stageIndex ?? 0}
        />
      </div>

      {/* Batch form */}
      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="Lot #"
          className="border px-2 py-1 rounded"
          value={form.lotNum}
          onChange={e => setForm(f => ({ ...f, lotNum: e.target.value }))}
        />
        <input
          placeholder="Color ID (optional)"
          className="border px-2 py-1 rounded"
          value={form.colorId ?? ''}
          onChange={e => setForm(f => ({ ...f, colorId: e.target.value || undefined }))}
        />
        <input
          placeholder="In Rough Weight"
          className="border px-2 py-1 rounded"
          value={form.inRoughWeight as any}
          onChange={e => setForm(f => ({ ...f, inRoughWeight: e.target.value }))}
        />
        <input
          placeholder="P2 Fiber Weight"
          className="border px-2 py-1 rounded"
          value={form.p2FiberWeight as any}
          onChange={e => setForm(f => ({ ...f, p2FiberWeight: e.target.value }))}
        />
        <input
          placeholder="P2 Waste"
          className="border px-2 py-1 rounded"
          value={form.p2Waste as any}
          onChange={e => setForm(f => ({ ...f, p2Waste: e.target.value }))}
        />
        <input
          placeholder="Operator (userId)"
          className="border px-2 py-1 rounded"
          value={form.userId}
          onChange={e => setForm(f => ({ ...f, userId: e.target.value }))}
        />
        <input
          type="datetime-local"
          className="border px-2 py-1 rounded"
          onChange={e => setForm(f => ({ ...f, dateTime: e.target.value || undefined }))}
        />
      </div>

      <button
        className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
        disabled={busy}
        onClick={submit}
      >
        {busy ? 'Saving…' : 'Create Batch'}
      </button>

      {msg && <p className="text-sm text-gray-600">{msg}</p>}
    </div>
  );
}
