/*
  Warnings:

  - You are about to drop the column `allowedRange` on the `InPersonEvent` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `InPersonEvent` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `InPersonEventAttendee` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "InPersonEvent_location_idx";

-- AlterTable
ALTER TABLE "InPersonEvent" DROP COLUMN "allowedRange",
DROP COLUMN "location";

-- AlterTable
ALTER TABLE "InPersonEventAttendee" DROP COLUMN "location",
ADD COLUMN     "isPresent" BOOLEAN NOT NULL DEFAULT false;
