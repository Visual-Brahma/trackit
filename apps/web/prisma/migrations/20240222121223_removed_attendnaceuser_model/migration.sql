/*
  Warnings:

  - You are about to drop the `AttendanceReportUserPresence` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `membersPresence` to the `AttendanceReport` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AttendanceReportUserPresence" DROP CONSTRAINT "AttendanceReportUserPresence_attendanceReportId_fkey";

-- DropForeignKey
ALTER TABLE "AttendanceReportUserPresence" DROP CONSTRAINT "AttendanceReportUserPresence_userId_fkey";

-- AlterTable
ALTER TABLE "AttendanceReport" ADD COLUMN     "membersPresence" JSONB NOT NULL;

-- DropTable
DROP TABLE "AttendanceReportUserPresence";
