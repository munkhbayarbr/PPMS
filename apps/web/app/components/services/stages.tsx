import {apiFetch} from '@/lib/api'

/** Generic helpers */
export const startStage = (stageCode: string, orderId: string, stageIndex: number) =>
  apiFetch<{ ok: true }>(`/${stageCode.toLowerCase()}/start/${orderId}/${stageIndex}`, {
    method: 'POST',
  });

export const completeStage = (stageCode: string, orderId: string, stageIndex: number) =>
  apiFetch(`/${stageCode.toLowerCase()}/complete/${orderId}/${stageIndex}`, {
    method: 'POST',
  });

/** P2: Dyeing */
export type CreateP2Batch = {
  lotNum: string;
  colorId?: string | null;
  dateTime?: string | Date;
  inRoughWeight?: string | number;
  p2FiberWeight?: string | number;
  p2Waste?: string | number;
  userId: string;

  // workflow linkage (optional)
  orderId?: string;
  stageIndex?: number;
};
export const createP2Batch = (body: CreateP2Batch) =>
  apiFetch(`/p2/batch`, { method: 'POST', body: JSON.stringify(body) });

/** P3: Carding */
export type CreateP3Batch = {
  lotNum: string;
  batchNum?: number | null;
  dateTime?: string | Date;
  inRoughWeight?: string | number;
  p3RovenWeight?: string | number;
  p3Waste?: string | number;
  bobbinNum?: number | null;
  userId: string;

  orderId?: string;
  stageIndex?: number;
};
export const createP3Batch = (body: CreateP3Batch) =>
  apiFetch(`/p3/batch`, { method: 'POST', body: JSON.stringify(body) });

/** COPY THIS SHAPE for P4–P7 */
export type CreateP4Batch = {
  lotNum: string;
  batchNum?: number | null;
  dateTime?: string | Date;
  inRoughWeight?: string | number;
  p4DanUtas?: string | number;
  p4RovenWeight?: string | number;
  p4Waste?: string | number;
  userId: string;
  orderId?: string;
  stageIndex?: number;
};
export const createP4Batch = (body: CreateP4Batch) =>
  apiFetch(`/p4/batch`, { method: 'POST', body: JSON.stringify(body) });

export type CreateP5Batch = {
  lotNum: string;
  batchNum?: number | null;
  dateTime?: string | Date;
  inRoughWeight?: string | number;
  p5OroosonUtas?: string | number;
  userId: string;
  orderId?: string;
  stageIndex?: number;
};
export const createP5Batch = (body: CreateP5Batch) =>
  apiFetch(`/p5/batch`, { method: 'POST', body: JSON.stringify(body) });

export type CreateP6Batch = {
  lotNum: string;
  batchNum?: number | null;
  dateTime?: string | Date;
  inRoughWeight?: string | number;
  p5DavharUtas?: string | number;
  userId: string;
  orderId?: string;
  stageIndex?: number;
};
export const createP6Batch = (body: CreateP6Batch) =>
  apiFetch(`/p6/batch`, { method: 'POST', body: JSON.stringify(body) });

export type CreateP7Batch = {
  lotNum: string;
  batchNum?: number | null;
  dateTime?: string | Date;
  inRoughWeight?: string | number;
  p5BelenUtas?: string | number;
  userId: string;
  orderId?: string;
  stageIndex?: number;
};
export const createP7Batch = (body: CreateP7Batch) =>
  apiFetch(`/p7/batch`, { method: 'POST', body: JSON.stringify(body) });
