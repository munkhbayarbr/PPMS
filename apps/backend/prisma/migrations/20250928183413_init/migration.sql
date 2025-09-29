-- CreateEnum
CREATE TYPE "public"."StageCode" AS ENUM ('P1', 'P2', 'P2B', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9');

-- CreateEnum
CREATE TYPE "public"."StageStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'DONE', 'BLOCKED', 'SKIPPED',"NOT_STARTED");
