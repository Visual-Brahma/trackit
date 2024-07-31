-- DropForeignKey
ALTER TABLE "InPersonEventAttendee" DROP CONSTRAINT "InPersonEventAttendee_eventId_fkey";

-- AddForeignKey
ALTER TABLE "InPersonEventAttendee" ADD CONSTRAINT "InPersonEventAttendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "InPersonEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
