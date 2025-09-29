-- CreateTable
CREATE TABLE "public"."WorkflowTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkflowStageTemplate" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "stageCode" "public"."StageCode" NOT NULL,
    "factoryProcessId" TEXT,

    CONSTRAINT "WorkflowStageTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "customerId" TEXT,
    "templateId" TEXT NOT NULL,
    "startIndex" INTEGER NOT NULL DEFAULT 0,
    "endIndex" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderStage" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "stageCode" "public"."StageCode" NOT NULL,
    "status" "public"."StageStatus" NOT NULL DEFAULT 'PENDING',
    "plannedQty" DECIMAL(14,3),
    "completedQty" DECIMAL(14,3),
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "assigneeId" TEXT,
    "recordTable" TEXT,
    "recordId" TEXT,

    CONSTRAINT "OrderStage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkflowStageTemplate_templateId_orderIndex_idx" ON "public"."WorkflowStageTemplate"("templateId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowStageTemplate_templateId_orderIndex_key" ON "public"."WorkflowStageTemplate"("templateId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Order_code_key" ON "public"."Order"("code");

-- CreateIndex
CREATE INDEX "OrderStage_orderId_index_idx" ON "public"."OrderStage"("orderId", "index");

-- CreateIndex
CREATE INDEX "OrderStage_stageCode_idx" ON "public"."OrderStage"("stageCode");

-- CreateIndex
CREATE INDEX "OrderStage_status_idx" ON "public"."OrderStage"("status");

-- CreateIndex
CREATE INDEX "OrderStage_assigneeId_idx" ON "public"."OrderStage"("assigneeId");

-- CreateIndex
CREATE INDEX "OrderStage_recordTable_recordId_idx" ON "public"."OrderStage"("recordTable", "recordId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderStage_orderId_index_key" ON "public"."OrderStage"("orderId", "index");

-- AddForeignKey
ALTER TABLE "public"."WorkflowStageTemplate" ADD CONSTRAINT "WorkflowStageTemplate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."WorkflowTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."WorkflowTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderStage" ADD CONSTRAINT "OrderStage_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderStage" ADD CONSTRAINT "OrderStage_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
