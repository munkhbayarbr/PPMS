-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'MANAGER', 'WORKER');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'SHIPPED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."BatchStatus" AS ENUM ('QUEUED', 'RUNNING', 'DONE', 'HOLD');

-- CreateEnum
CREATE TYPE "public"."StageType" AS ENUM ('RECEIVE', 'DYE', 'MIX', 'COMB', 'SPIN', 'WIND', 'DOUBLE', 'TWIST');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'WORKER',
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WarehouseItem" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "rawWeightKg" DECIMAL(12,3) NOT NULL,
    "moisturePct" DECIMAL(5,2),
    "cleanWeightKg" DECIMAL(12,3) NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarehouseItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "productSpec" TEXT,
    "requestedKg" DECIMAL(12,3) NOT NULL,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'DRAFT',
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderAllocation" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "warehouseItemId" TEXT NOT NULL,
    "allocatedKg" DECIMAL(12,3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StageDefinition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."StageType" NOT NULL,
    "capacityKgH" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StageDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Batch" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "sourceItemId" TEXT,
    "totalInputKg" DECIMAL(12,3) NOT NULL,
    "status" "public"."BatchStatus" NOT NULL DEFAULT 'QUEUED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lineageParentId" TEXT,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StageRun" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "inputKg" DECIMAL(12,3) NOT NULL,
    "outputKg" DECIMAL(12,3),
    "wasteKg" DECIMAL(12,3),
    "qualityNote" TEXT,
    "operatorId" TEXT,

    CONSTRAINT "StageRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WasteRecord" (
    "id" TEXT NOT NULL,
    "stageRunId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "amountKg" DECIMAL(12,3) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WasteRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Shipment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "shippedAt" TIMESTAMP(3),
    "carrier" TEXT,
    "docUrl" TEXT,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_StagePrereq" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StagePrereq_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WarehouseItem_code_key" ON "public"."WarehouseItem"("code");

-- CreateIndex
CREATE INDEX "WarehouseItem_code_idx" ON "public"."WarehouseItem"("code");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "public"."Order"("status");

-- CreateIndex
CREATE INDEX "Order_customerName_idx" ON "public"."Order"("customerName");

-- CreateIndex
CREATE UNIQUE INDEX "OrderAllocation_orderId_warehouseItemId_key" ON "public"."OrderAllocation"("orderId", "warehouseItemId");

-- CreateIndex
CREATE UNIQUE INDEX "StageDefinition_type_key" ON "public"."StageDefinition"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Batch_code_key" ON "public"."Batch"("code");

-- CreateIndex
CREATE INDEX "Batch_status_idx" ON "public"."Batch"("status");

-- CreateIndex
CREATE INDEX "StageRun_batchId_stageId_idx" ON "public"."StageRun"("batchId", "stageId");

-- CreateIndex
CREATE INDEX "WasteRecord_stageRunId_idx" ON "public"."WasteRecord"("stageRunId");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_orderId_key" ON "public"."Shipment"("orderId");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "public"."AuditLog"("entity", "entityId");

-- CreateIndex
CREATE INDEX "_StagePrereq_B_index" ON "public"."_StagePrereq"("B");

-- AddForeignKey
ALTER TABLE "public"."OrderAllocation" ADD CONSTRAINT "OrderAllocation_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderAllocation" ADD CONSTRAINT "OrderAllocation_warehouseItemId_fkey" FOREIGN KEY ("warehouseItemId") REFERENCES "public"."WarehouseItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Batch" ADD CONSTRAINT "Batch_sourceItemId_fkey" FOREIGN KEY ("sourceItemId") REFERENCES "public"."WarehouseItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Batch" ADD CONSTRAINT "Batch_lineageParentId_fkey" FOREIGN KEY ("lineageParentId") REFERENCES "public"."Batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StageRun" ADD CONSTRAINT "StageRun_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StageRun" ADD CONSTRAINT "StageRun_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "public"."StageDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StageRun" ADD CONSTRAINT "StageRun_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WasteRecord" ADD CONSTRAINT "WasteRecord_stageRunId_fkey" FOREIGN KEY ("stageRunId") REFERENCES "public"."StageRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Shipment" ADD CONSTRAINT "Shipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_StagePrereq" ADD CONSTRAINT "_StagePrereq_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."StageDefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_StagePrereq" ADD CONSTRAINT "_StagePrereq_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."StageDefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
