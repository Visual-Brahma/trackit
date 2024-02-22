/*
  Warnings:

  - The `meetPlatform` column on the `Meeting` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MeetingPlatform" AS ENUM ('GOOGLE_MEET');

-- AlterTable
ALTER TABLE "AttendanceReport" ALTER COLUMN "sharedWith" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "meetPlatform",
ADD COLUMN     "meetPlatform" "MeetingPlatform";
