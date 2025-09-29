'use client';

import { useState } from 'react';
import { startStage, completeStage } from '../services/stages'

export function StageStartButton({
  stageCode,
  orderId,
  stageIndex,
  onDone,
}: {
  stageCode: 'p1'| 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7';
  orderId: string;
  stageIndex: number;
  onDone?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      className="px-3 py-2 rounded-md border shadow-sm text-sm"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await startStage(stageCode.toUpperCase(), orderId, stageIndex);
          onDone?.();
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? 'Starting…' : 'Start Stage'}
    </button>
  );
}

export function StageCompleteButton({
  stageCode,
  orderId,
  stageIndex,
  onDone,
}: {
  stageCode: 'p1'| 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7';
  orderId: string;
  stageIndex: number;
  onDone?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <button
      className="px-3 py-2 rounded-md border shadow-sm text-sm"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await completeStage(stageCode.toUpperCase(), orderId, stageIndex);
          onDone?.();
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? 'Completing…' : 'Complete Stage'}
    </button>
  );
}
