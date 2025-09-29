'use client';

import { useState } from 'react';
import { createP3Batch, CreateP3Batch } from '../../components/services/stages';
import { StageStartButton, StageCompleteButton } from '../../components/stages/StageActions';

export default function P3Page() {
  const [form, setForm] = useState<CreateP3Batch>({
    lotNum: '',
    batchNum: 1,
    inRoughWeight: '',
    p3RovenWeight: '',
    p3Waste: '',
    bobbinNum: undefined,
    userId: '',

    orderId: '',
    stageIndex: 0,
  });

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setMsg(null);
    try {
      const payload: CreateP3Batch = {
        ...form,
        dateTime: form.dateTime ? new Date(form.dateTime) : undefined,
      };

      await createP3Batch(payload);
      setMsg('P3 batch created.');
    } catch (e: any) {
      setMsg(e?.message ?? 'Failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">P3 – Carding</h1>

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
        <StageStartButton stageCode="p3" orderId={form.orderId || ''} stageIndex={form.stageIndex ?? 0} />
        <StageCompleteButton stageCode="p3" orderId={form.orderId || ''} stageIndex={form.stageIndex ?? 0} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="Lot #"
          className="border px-2 py-1 rounded"
          value={form.lotNum}
          onChange={e => setForm(f => ({ ...f, lotNum: e.target.value }))}
        />
        <input
          placeholder="Batch #"
          type="number"
          className="border px-2 py-1 rounded"
          value={form.batchNum ?? 1}
          onChange={e => setForm(f => ({ ...f, batchNum: Number(e.target.value) }))}
        />
        <input
          placeholder="In Rough Weight"
          className="border px-2 py-1 rounded"
          value={form.inRoughWeight as any}
          onChange={e => setForm(f => ({ ...f, inRoughWeight: e.target.value }))}
        />
        <input
          placeholder="Roven Weight"
          className="border px-2 py-1 rounded"
          value={form.p3RovenWeight as any}
          onChange={e => setForm(f => ({ ...f, p3RovenWeight: e.target.value }))}
        />
        <input
          placeholder="Waste"
          className="border px-2 py-1 rounded"
          value={form.p3Waste as any}
          onChange={e => setForm(f => ({ ...f, p3Waste: e.target.value }))}
        />
        <input
          placeholder="Bobbin # (optional)"
          type="number"
          className="border px-2 py-1 rounded"
          value={form.bobbinNum ?? ''}
          onChange={e => setForm(f => ({ ...f, bobbinNum: e.target.value ? Number(e.target.value) : undefined }))}
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
