/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Customer` table. All the data in the column will be lost.
  - You are about to alter the column `roughWeight` on the `P1Stock` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,3)`.
  - You are about to alter the column `baleWeight` on the `P1Stock` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,3)`.
  - You are about to alter the column `conWeight` on the `P1Stock` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,3)`.
  - You are about to alter the column `moisture` on the `P1Stock` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(6,3)`.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Batch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderAllocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Shipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StageDefinition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StageRun` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WarehouseItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WasteRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_StagePrereq` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fiberColorId` to the `P1Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `P1Stock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Batch" DROP CONSTRAINT "Batch_lineageParentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Batch" DROP CONSTRAINT "Batch_sourceItemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderAllocation" DROP CONSTRAINT "OrderAllocation_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderAllocation" DROP CONSTRAINT "OrderAllocation_warehouseItemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Shipment" DROP CONSTRAINT "Shipment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StageRun" DROP CONSTRAINT "StageRun_batchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StageRun" DROP CONSTRAINT "StageRun_operatorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StageRun" DROP CONSTRAINT "StageRun_stageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WasteRecord" DROP CONSTRAINT "WasteRecord_stageRunId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_StagePrereq" DROP CONSTRAINT "_StagePrereq_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_StagePrereq" DROP CONSTRAINT "_StagePrereq_B_fkey";

-- AlterTable
ALTER TABLE "public"."Customer" DROP COLUMN "createdAt",
DROP COLUMN "isActive",
DROP COLUMN "updatedAt",
ADD COLUMN     "abbName" TEXT,
ADD COLUMN     "fax" TEXT,
ADD COLUMN     "mobile" TEXT;

-- AlterTable
ALTER TABLE "public"."P1Stock" ADD COLUMN     "fiberColorId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "orderAbb" DROP NOT NULL,
ALTER COLUMN "baleNum" DROP NOT NULL,
ALTER COLUMN "roughWeight" DROP NOT NULL,
ALTER COLUMN "roughWeight" SET DATA TYPE DECIMAL(12,3),
ALTER COLUMN "baleWeight" DROP NOT NULL,
ALTER COLUMN "baleWeight" SET DATA TYPE DECIMAL(12,3),
ALTER COLUMN "conWeight" DROP NOT NULL,
ALTER COLUMN "conWeight" SET DATA TYPE DECIMAL(12,3),
ALTER COLUMN "moisture" DROP NOT NULL,
ALTER COLUMN "moisture" SET DATA TYPE DECIMAL(6,3);

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "role";

-- DropTable
DROP TABLE "public"."Batch";

-- DropTable
DROP TABLE "public"."Order";

-- DropTable
DROP TABLE "public"."OrderAllocation";

-- DropTable
DROP TABLE "public"."Shipment";

-- DropTable
DROP TABLE "public"."StageDefinition";

-- DropTable
DROP TABLE "public"."StageRun";

-- DropTable
DROP TABLE "public"."WarehouseItem";

-- DropTable
DROP TABLE "public"."WasteRecord";

-- DropTable
DROP TABLE "public"."_StagePrereq";

-- DropEnum
DROP TYPE "public"."BatchStatus";

-- DropEnum
DROP TYPE "public"."OrderStatus";

-- DropEnum
DROP TYPE "public"."Role";

-- DropEnum
DROP TYPE "public"."StageType";

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameMn" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EmployeeRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "EmployeeRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FactoryProcess" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameMn" TEXT,
    "abbre" TEXT,

    CONSTRAINT "FactoryProcess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FiberColor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FiberColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Bobbin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weight" DECIMAL(8,3) NOT NULL,

    CONSTRAINT "Bobbin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OutColor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbName" TEXT,

    CONSTRAINT "OutColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."P2Dyeing" (
    "id" TEXT NOT NULL,
    "lotNum" TEXT NOT NULL,
    "colorId" TEXT,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inRoughWeight" DECIMAL(12,3),
    "p2FiberWeight" DECIMAL(12,3),
    "p2Waste" DECIMAL(12,3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "P2Dyeing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."P2Blending" (
    "id" TEXT NOT NULL,
    "lotNum" TEXT NOT NULL,
    "colorId" TEXT,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inRoughWeight" DECIMAL(12,3),
    "p2FiberWeight" DECIMAL(12,3),
    "p2Waste" DECIMAL(12,3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "P2Blending_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."P1ToP2" (
    "id" TEXT NOT NULL,
    "p1Id" TEXT NOT NULL,
    "p2Id" TEXT NOT NULL,
    "takenWeight" DECIMAL(12,3),
    "moisture" DECIMAL(6,3),
    "takenWeightCon" DECIMAL(12,3),
    "roughWeight" DECIMAL(12,3),

    CONSTRAINT "P1ToP2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."P3Carding" (
    "id" TEXT NOT NULL,
    "lotNum" TEXT NOT NULL,
    "batchNum" INTEGER,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inRoughWeight" DECIMAL(12,3),
    "p3RovenWeight" DECIMAL(12,3),
    "p3Waste" DECIMAL(12,3),
    "bobbinNum" INTEGER,
    "userId" TEXT NOT NULL,

    CONSTRAINT "P3Carding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."P2ToP3" (
    "id" TEXT NOT NULL,
    "p2Id" TEXT NOT NULL,
    "p3Id" TEXT NOT NULL,
    "takenWeight" DECIMAL(12,3),
    "moisture" DECIMAL(6,3),
    "takenWeightCon" DECIMAL(12,3),

    CONSTRAINT "P2ToP3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."P4Spinning" (
    "id" TEXT NOT NULL,
    "lotNum" TEXT NOT NULL,
    "batchNum" INTEGER,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inRoughWeight" DECIMAL(12,3),
    "p4DanUtas" DECIMAL(12,3),
    "p4RovenWeight" DECIMAL(12,3),
    "p4Waste" DECIMAL(12,3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "P4Spinning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."P3ToP4" (
    "id" TEXT NOT NULL,
    "p3Id" TEXT NOT NULL,
    "p4Id" TEXT NOT NULL,
    "takenWeight" DECIMAL(12,3),
    "moisture" DECIMAL(6,3),
    "takenWeightCon" DECIMAL(12,3),

    CONSTRAINT "P3ToP4_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."P5Winding" (
    "id" TEXT NOT NULL,
    "lotNum" TEXT NOT NULL,
    "batchNum" INTEGER,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inRoughWeight" DECIMAL(12,3),
    "p5OroosonUtas" DECIMAL(12,3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "P5Winding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."P4ToP5" (
    "id" TEXT NOT NULL,
    "p4Id" TEXT NOT NULL,
    "p5Id" TEXT NOT NULL,
    "takenWeight" DECIMAL(12,3),
    "moisture" DECIMAL(6,3),
    "takenWeightCon" DECIMAL(12,3),

    CONSTRAINT "P4ToP5_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."P6Doubling" (
    "id" TEXT NOT NULL,
    "lotNum" TEXT NOT NULL,
    "batchNum" INTEGER,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inRoughWeight" DECIMAL(12,3),
    "p5DavharUtas" DECIMAL(12,3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "P6Doubling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."P5ToP6" (
    "id" TEXT NOT NULL,
    "p5Id" TEXT NOT NULL,
    "p6Id" TEXT NOT NULL,
    "takenWeight" DECIMAL(12,3),
    "moisture" DECIMAL(6,3),
    "takenWeightCon" DECIMAL(12,3),

    CONSTRAINT "P5ToP6_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."P7Twisting" (
    "id" TEXT NOT NULL,
    "lotNum" TEXT NOT NULL,
    "batchNum" INTEGER,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inRoughWeight" DECIMAL(12,3),
    "p5BelenUtas" DECIMAL(12,3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "P7Twisting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."P6ToP7" (
    "id" TEXT NOT NULL,
    "p6Id" TEXT NOT NULL,
    "p7Id" TEXT NOT NULL,
    "takenWeight" DECIMAL(12,3),
    "moisture" DECIMAL(6,3),
    "takenWeightCon" DECIMAL(12,3),

    CONSTRAINT "P6ToP7_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_nameEn_key" ON "public"."Role"("nameEn");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeRole_userId_roleId_key" ON "public"."EmployeeRole"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "FactoryProcess_nameEn_key" ON "public"."FactoryProcess"("nameEn");

-- CreateIndex
CREATE UNIQUE INDEX "FiberColor_name_key" ON "public"."FiberColor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Bobbin_name_key" ON "public"."Bobbin"("name");

-- CreateIndex
CREATE UNIQUE INDEX "OutColor_name_key" ON "public"."OutColor"("name");

-- CreateIndex
CREATE INDEX "P1ToP2_p1Id_idx" ON "public"."P1ToP2"("p1Id");

-- CreateIndex
CREATE INDEX "P1ToP2_p2Id_idx" ON "public"."P1ToP2"("p2Id");

-- CreateIndex
CREATE UNIQUE INDEX "P1ToP2_p1Id_p2Id_key" ON "public"."P1ToP2"("p1Id", "p2Id");

-- CreateIndex
CREATE INDEX "P2ToP3_p2Id_idx" ON "public"."P2ToP3"("p2Id");

-- CreateIndex
CREATE INDEX "P2ToP3_p3Id_idx" ON "public"."P2ToP3"("p3Id");

-- CreateIndex
CREATE UNIQUE INDEX "P2ToP3_p2Id_p3Id_key" ON "public"."P2ToP3"("p2Id", "p3Id");

-- CreateIndex
CREATE INDEX "P3ToP4_p3Id_idx" ON "public"."P3ToP4"("p3Id");

-- CreateIndex
CREATE INDEX "P3ToP4_p4Id_idx" ON "public"."P3ToP4"("p4Id");

-- CreateIndex
CREATE UNIQUE INDEX "P3ToP4_p3Id_p4Id_key" ON "public"."P3ToP4"("p3Id", "p4Id");

-- CreateIndex
CREATE INDEX "P4ToP5_p4Id_idx" ON "public"."P4ToP5"("p4Id");

-- CreateIndex
CREATE INDEX "P4ToP5_p5Id_idx" ON "public"."P4ToP5"("p5Id");

-- CreateIndex
CREATE UNIQUE INDEX "P4ToP5_p4Id_p5Id_key" ON "public"."P4ToP5"("p4Id", "p5Id");

-- CreateIndex
CREATE INDEX "P5ToP6_p5Id_idx" ON "public"."P5ToP6"("p5Id");

-- CreateIndex
CREATE INDEX "P5ToP6_p6Id_idx" ON "public"."P5ToP6"("p6Id");

-- CreateIndex
CREATE UNIQUE INDEX "P5ToP6_p5Id_p6Id_key" ON "public"."P5ToP6"("p5Id", "p6Id");

-- CreateIndex
CREATE INDEX "P6ToP7_p6Id_idx" ON "public"."P6ToP7"("p6Id");

-- CreateIndex
CREATE INDEX "P6ToP7_p7Id_idx" ON "public"."P6ToP7"("p7Id");

-- CreateIndex
CREATE UNIQUE INDEX "P6ToP7_p6Id_p7Id_key" ON "public"."P6ToP7"("p6Id", "p7Id");

-- CreateIndex
CREATE INDEX "P1Stock_customerId_idx" ON "public"."P1Stock"("customerId");

-- CreateIndex
CREATE INDEX "P1Stock_fiberTypeId_idx" ON "public"."P1Stock"("fiberTypeId");

-- CreateIndex
CREATE INDEX "P1Stock_fiberColorId_idx" ON "public"."P1Stock"("fiberColorId");

-- CreateIndex
CREATE INDEX "P1Stock_dateTime_idx" ON "public"."P1Stock"("dateTime");

-- AddForeignKey
ALTER TABLE "public"."EmployeeRole" ADD CONSTRAINT "EmployeeRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EmployeeRole" ADD CONSTRAINT "EmployeeRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P1Stock" ADD CONSTRAINT "P1Stock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P1Stock" ADD CONSTRAINT "P1Stock_fiberColorId_fkey" FOREIGN KEY ("fiberColorId") REFERENCES "public"."FiberColor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P2Dyeing" ADD CONSTRAINT "P2Dyeing_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "public"."OutColor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P2Dyeing" ADD CONSTRAINT "P2Dyeing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P2Blending" ADD CONSTRAINT "P2Blending_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "public"."OutColor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P2Blending" ADD CONSTRAINT "P2Blending_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P1ToP2" ADD CONSTRAINT "P1ToP2_p1Id_fkey" FOREIGN KEY ("p1Id") REFERENCES "public"."P1Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P1ToP2" ADD CONSTRAINT "P1ToP2_p2Id_fkey" FOREIGN KEY ("p2Id") REFERENCES "public"."P2Dyeing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P3Carding" ADD CONSTRAINT "P3Carding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P2ToP3" ADD CONSTRAINT "P2ToP3_p2Id_fkey" FOREIGN KEY ("p2Id") REFERENCES "public"."P2Dyeing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P2ToP3" ADD CONSTRAINT "P2ToP3_p3Id_fkey" FOREIGN KEY ("p3Id") REFERENCES "public"."P3Carding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P4Spinning" ADD CONSTRAINT "P4Spinning_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P3ToP4" ADD CONSTRAINT "P3ToP4_p3Id_fkey" FOREIGN KEY ("p3Id") REFERENCES "public"."P3Carding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P3ToP4" ADD CONSTRAINT "P3ToP4_p4Id_fkey" FOREIGN KEY ("p4Id") REFERENCES "public"."P4Spinning"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P5Winding" ADD CONSTRAINT "P5Winding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P4ToP5" ADD CONSTRAINT "P4ToP5_p4Id_fkey" FOREIGN KEY ("p4Id") REFERENCES "public"."P4Spinning"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P4ToP5" ADD CONSTRAINT "P4ToP5_p5Id_fkey" FOREIGN KEY ("p5Id") REFERENCES "public"."P5Winding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P6Doubling" ADD CONSTRAINT "P6Doubling_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P5ToP6" ADD CONSTRAINT "P5ToP6_p5Id_fkey" FOREIGN KEY ("p5Id") REFERENCES "public"."P5Winding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P5ToP6" ADD CONSTRAINT "P5ToP6_p6Id_fkey" FOREIGN KEY ("p6Id") REFERENCES "public"."P6Doubling"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P7Twisting" ADD CONSTRAINT "P7Twisting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P6ToP7" ADD CONSTRAINT "P6ToP7_p6Id_fkey" FOREIGN KEY ("p6Id") REFERENCES "public"."P6Doubling"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P6ToP7" ADD CONSTRAINT "P6ToP7_p7Id_fkey" FOREIGN KEY ("p7Id") REFERENCES "public"."P7Twisting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
