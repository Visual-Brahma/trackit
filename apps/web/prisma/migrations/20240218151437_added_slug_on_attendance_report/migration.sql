/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `AttendanceReport` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AttendanceReport" ADD COLUMN     "slug" TEXT NOT NULL DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "meetPlatform" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceReport_slug_key" ON "AttendanceReport"("slug");
