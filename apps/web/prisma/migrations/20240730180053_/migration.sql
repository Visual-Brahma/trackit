/*
  Warnings:

  - You are about to drop the column `isPresent` on the `InPersonEventAttendee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InPersonEventAttendee" DROP COLUMN "isPresent",
ADD COLUMN     "registrationTime" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "checkInTime" DROP NOT NULL,
ALTER COLUMN "checkInTime" DROP DEFAULT;
