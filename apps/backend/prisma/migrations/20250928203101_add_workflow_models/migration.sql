-- AlterEnum
ALTER TYPE "public"."StageStatus" ADD VALUE 'NOT_STARTED';

-- AlterTable
ALTER TABLE "public"."P3Carding" ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "stageIndex" INTEGER;

-- AlterTable
ALTER TABLE "public"."P4Spinning" ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "stageIndex" INTEGER;

-- AlterTable
ALTER TABLE "public"."P5Winding" ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "stageIndex" INTEGER;

-- AlterTable
ALTER TABLE "public"."P6Doubling" ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "stageIndex" INTEGER;

-- AlterTable
ALTER TABLE "public"."P7Twisting" ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "stageIndex" INTEGER;
