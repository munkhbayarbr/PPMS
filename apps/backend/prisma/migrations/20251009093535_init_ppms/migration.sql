-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'SHIPPED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ProcessStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'DONE', 'HOLD', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."StageType" AS ENUM ('FIBER', 'FIBER_DYED', 'FIBER_BLENDED', 'ROVEN', 'SINGLE_YARN', 'WINDED_YARN', 'DOUBLE_YARN', 'TWISTED_YARN');

-- CreateEnum
CREATE TYPE "public"."MoveDir" AS ENUM ('IN', 'OUT');

-- CreateEnum
CREATE TYPE "public"."WasteType" AS ENUM ('CLEAN_OCHES', 'DIRTY_OCHES', 'ERCHTEI');

-- CreateEnum
CREATE TYPE "public"."ReservationStatus" AS ENUM ('ACTIVE', 'RELEASED', 'FULFILLED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."IoKind" AS ENUM ('INPUT', 'OUTPUT');

-- CreateTable
CREATE TABLE "public"."customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "abb_name" TEXT,
    "email" TEXT,
    "mobile" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "fax" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "password_reset_token" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."role" (
    "id" SERIAL NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_mn" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employee_role" (
    "employee_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "employee_role_pkey" PRIMARY KEY ("employee_id","role_id")
);

-- CreateTable
CREATE TABLE "public"."factory_process" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_mn" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "factory_process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fiber_type" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "fiber_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."color" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bobbin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "weight_g" DECIMAL(12,3) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "bobbin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" SERIAL NOT NULL,
    "order_no" TEXT NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "recorded_at" TIMESTAMPTZ(6) NOT NULL,
    "color_id" TEXT,
    "weight_kg" DECIMAL(12,3),
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'DRAFT',
    "owner_id" INTEGER,
    "started_at" TIMESTAMPTZ(6),
    "finished_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_process" (
    "order_id" INTEGER NOT NULL,
    "process_id" INTEGER NOT NULL,
    "seq" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "required" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "order_process_pkey" PRIMARY KEY ("order_id","process_id")
);

-- CreateTable
CREATE TABLE "public"."stage_execution" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "process_id" INTEGER NOT NULL,
    "stage" "public"."StageType" NOT NULL,
    "status" "public"."ProcessStatus" NOT NULL DEFAULT 'PENDING',
    "lot_num" TEXT,
    "batch_num" INTEGER,
    "pic_id1" INTEGER,
    "started_at" TIMESTAMPTZ(6),
    "finished_at" TIMESTAMPTZ(6),
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "stage_execution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."production_output" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER,
    "owner_customer_id" INTEGER,
    "stage_exec_id" INTEGER NOT NULL,
    "stage" "public"."StageType" NOT NULL,
    "recorded_at" TIMESTAMPTZ(6) NOT NULL,
    "fiber_type_id" TEXT NOT NULL,
    "color_id" TEXT,
    "lot_num" TEXT,
    "batch_num" INTEGER,
    "rough_weight_kg" DECIMAL(12,3),
    "bale_weight_kg" DECIMAL(12,3),
    "con_weight_kg" DECIMAL(12,3),
    "moisture_pct" DECIMAL(5,2),
    "bobbin_type_id" INTEGER,
    "bobbin_count" INTEGER NOT NULL DEFAULT 0,
    "details" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "production_output_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reservation" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "output_id" INTEGER NOT NULL,
    "qty_reserved_kg" DECIMAL(12,3) NOT NULL,
    "status" "public"."ReservationStatus" NOT NULL DEFAULT 'ACTIVE',
    "reserved_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "released_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."waste" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "stage_exec_id" INTEGER NOT NULL,
    "process_id" INTEGER NOT NULL,
    "waste_type" "public"."WasteType" NOT NULL,
    "recorded_at" TIMESTAMPTZ(6) NOT NULL,
    "fiber_type_id" TEXT NOT NULL,
    "color_id" TEXT,
    "bale_num" INTEGER,
    "weight_kg" DECIMAL(12,3) NOT NULL,
    "moisture_pct" DECIMAL(5,2),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "waste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stock_move" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "stage_exec_id" INTEGER NOT NULL,
    "direction" "public"."MoveDir" NOT NULL,
    "qty_kg" DECIMAL(12,3) NOT NULL,
    "recorded_at" TIMESTAMPTZ(6) NOT NULL,
    "location_id" INTEGER,
    "output_id" INTEGER,
    "waste_id" INTEGER,
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "stock_move_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."output_link" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "from_output_id" INTEGER NOT NULL,
    "to_output_id" INTEGER NOT NULL,
    "qty_consumed_kg" DECIMAL(12,3) NOT NULL,
    "note" TEXT,
    "linked_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "output_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."io_rule" (
    "process_id" INTEGER NOT NULL,
    "kind" "public"."IoKind" NOT NULL,
    "stage" "public"."StageType" NOT NULL,

    CONSTRAINT "io_rule_pkey" PRIMARY KEY ("process_id","kind","stage")
);

-- CreateTable
CREATE TABLE "public"."waste_rule" (
    "process_id" INTEGER NOT NULL,
    "waste" "public"."WasteType" NOT NULL,

    CONSTRAINT "waste_rule_pkey" PRIMARY KEY ("process_id","waste")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_email_key" ON "public"."employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "factory_process_code_key" ON "public"."factory_process"("code");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_no_key" ON "public"."orders"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "order_process_order_id_seq_key" ON "public"."order_process"("order_id", "seq");

-- CreateIndex
CREATE INDEX "stage_execution_order_id_process_id_idx" ON "public"."stage_execution"("order_id", "process_id");

-- CreateIndex
CREATE INDEX "stage_execution_order_id_stage_started_at_idx" ON "public"."stage_execution"("order_id", "stage", "started_at");

-- CreateIndex
CREATE INDEX "stage_execution_lot_num_idx" ON "public"."stage_execution"("lot_num");

-- CreateIndex
CREATE INDEX "stage_execution_batch_num_idx" ON "public"."stage_execution"("batch_num");

-- CreateIndex
CREATE INDEX "production_output_order_id_idx" ON "public"."production_output"("order_id");

-- CreateIndex
CREATE INDEX "production_output_owner_customer_id_idx" ON "public"."production_output"("owner_customer_id");

-- CreateIndex
CREATE INDEX "production_output_stage_recorded_at_idx" ON "public"."production_output"("stage", "recorded_at");

-- CreateIndex
CREATE INDEX "production_output_lot_num_idx" ON "public"."production_output"("lot_num");

-- CreateIndex
CREATE INDEX "production_output_batch_num_idx" ON "public"."production_output"("batch_num");

-- CreateIndex
CREATE INDEX "reservation_order_id_idx" ON "public"."reservation"("order_id");

-- CreateIndex
CREATE INDEX "reservation_output_id_idx" ON "public"."reservation"("output_id");

-- CreateIndex
CREATE INDEX "waste_order_id_process_id_recorded_at_idx" ON "public"."waste"("order_id", "process_id", "recorded_at");

-- CreateIndex
CREATE INDEX "stock_move_order_id_recorded_at_idx" ON "public"."stock_move"("order_id", "recorded_at");

-- CreateIndex
CREATE INDEX "stock_move_output_id_idx" ON "public"."stock_move"("output_id");

-- CreateIndex
CREATE INDEX "stock_move_waste_id_idx" ON "public"."stock_move"("waste_id");

-- CreateIndex
CREATE INDEX "output_link_order_id_idx" ON "public"."output_link"("order_id");

-- CreateIndex
CREATE INDEX "output_link_from_output_id_idx" ON "public"."output_link"("from_output_id");

-- CreateIndex
CREATE INDEX "output_link_to_output_id_idx" ON "public"."output_link"("to_output_id");

-- CreateIndex
CREATE UNIQUE INDEX "output_link_order_id_from_output_id_to_output_id_key" ON "public"."output_link"("order_id", "from_output_id", "to_output_id");

-- AddForeignKey
ALTER TABLE "public"."employee_role" ADD CONSTRAINT "employee_role_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employee_role" ADD CONSTRAINT "employee_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "public"."color"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_process" ADD CONSTRAINT "order_process_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_process" ADD CONSTRAINT "order_process_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "public"."factory_process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stage_execution" ADD CONSTRAINT "stage_execution_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stage_execution" ADD CONSTRAINT "stage_execution_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "public"."factory_process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stage_execution" ADD CONSTRAINT "stage_execution_pic_id1_fkey" FOREIGN KEY ("pic_id1") REFERENCES "public"."employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."production_output" ADD CONSTRAINT "production_output_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."production_output" ADD CONSTRAINT "production_output_owner_customer_id_fkey" FOREIGN KEY ("owner_customer_id") REFERENCES "public"."customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."production_output" ADD CONSTRAINT "production_output_stage_exec_id_fkey" FOREIGN KEY ("stage_exec_id") REFERENCES "public"."stage_execution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."production_output" ADD CONSTRAINT "production_output_fiber_type_id_fkey" FOREIGN KEY ("fiber_type_id") REFERENCES "public"."fiber_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."production_output" ADD CONSTRAINT "production_output_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "public"."color"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."production_output" ADD CONSTRAINT "production_output_bobbin_type_id_fkey" FOREIGN KEY ("bobbin_type_id") REFERENCES "public"."bobbin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservation" ADD CONSTRAINT "reservation_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservation" ADD CONSTRAINT "reservation_output_id_fkey" FOREIGN KEY ("output_id") REFERENCES "public"."production_output"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."waste" ADD CONSTRAINT "waste_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."waste" ADD CONSTRAINT "waste_stage_exec_id_fkey" FOREIGN KEY ("stage_exec_id") REFERENCES "public"."stage_execution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."waste" ADD CONSTRAINT "waste_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "public"."factory_process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."waste" ADD CONSTRAINT "waste_fiber_type_id_fkey" FOREIGN KEY ("fiber_type_id") REFERENCES "public"."fiber_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."waste" ADD CONSTRAINT "waste_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "public"."color"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stock_move" ADD CONSTRAINT "stock_move_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stock_move" ADD CONSTRAINT "stock_move_stage_exec_id_fkey" FOREIGN KEY ("stage_exec_id") REFERENCES "public"."stage_execution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stock_move" ADD CONSTRAINT "stock_move_output_id_fkey" FOREIGN KEY ("output_id") REFERENCES "public"."production_output"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stock_move" ADD CONSTRAINT "stock_move_waste_id_fkey" FOREIGN KEY ("waste_id") REFERENCES "public"."waste"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."output_link" ADD CONSTRAINT "output_link_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."output_link" ADD CONSTRAINT "output_link_from_output_id_fkey" FOREIGN KEY ("from_output_id") REFERENCES "public"."production_output"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."output_link" ADD CONSTRAINT "output_link_to_output_id_fkey" FOREIGN KEY ("to_output_id") REFERENCES "public"."production_output"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."io_rule" ADD CONSTRAINT "io_rule_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "public"."factory_process"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."waste_rule" ADD CONSTRAINT "waste_rule_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "public"."factory_process"("id") ON DELETE CASCADE ON UPDATE CASCADE;
