-- AlterTable
ALTER TABLE "InPersonEvent" ADD COLUMN     "allowedEmails" TEXT[] DEFAULT ARRAY[]::TEXT[];
