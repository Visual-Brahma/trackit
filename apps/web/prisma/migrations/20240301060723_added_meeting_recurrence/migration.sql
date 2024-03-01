-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "recurringMeetingId" INTEGER;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_recurringMeetingId_fkey" FOREIGN KEY ("recurringMeetingId") REFERENCES "Meeting"("id") ON DELETE SET NULL ON UPDATE CASCADE;
