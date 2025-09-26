-- CreateTable
CREATE TABLE "public"."P1Stock" (
    "id" TEXT NOT NULL,
    "orderAbb" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "baleNum" INTEGER NOT NULL,
    "roughWeight" DOUBLE PRECISION NOT NULL,
    "baleWeight" DOUBLE PRECISION NOT NULL,
    "conWeight" DOUBLE PRECISION NOT NULL,
    "moisture" DOUBLE PRECISION NOT NULL,
    "customerId" TEXT NOT NULL,
    "fiberTypeId" TEXT NOT NULL,

    CONSTRAINT "P1Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FiberType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FiberType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FiberType_name_key" ON "public"."FiberType"("name");

-- AddForeignKey
ALTER TABLE "public"."P1Stock" ADD CONSTRAINT "P1Stock_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."P1Stock" ADD CONSTRAINT "P1Stock_fiberTypeId_fkey" FOREIGN KEY ("fiberTypeId") REFERENCES "public"."FiberType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
