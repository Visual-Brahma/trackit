/*
  Warnings:

  - Added the required column `location` to the `InPersonEventAttendee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InPersonEventAttendee" ADD COLUMN     "location" Point NOT NULL;
