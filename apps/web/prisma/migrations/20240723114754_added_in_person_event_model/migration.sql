CREATE schema IF NOT EXISTS "gis";
-- enable the "postgis" extension
CREATE extension postgis WITH schema "gis";

-- CreateTable
CREATE TABLE "InPersonEvent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "venue" TEXT,
    "location" Point NOT NULL,
    "allowedRange" INTEGER,
    "allowedEmailDomains" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "date" TIMESTAMPTZ(3) NOT NULL,
    "startTime" TIMESTAMPTZ(3) NOT NULL,
    "endTime" TIMESTAMPTZ(3),

    CONSTRAINT "InPersonEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InPersonEventAttendee" (
    "id" BIGSERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "InPersonEventAttendee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InPersonEvent_slug_key" ON "InPersonEvent"("slug");

-- CreateIndex
CREATE INDEX "InPersonEvent_location_idx" ON "InPersonEvent" USING GIST ("location");

-- CreateIndex
CREATE UNIQUE INDEX "InPersonEventAttendee_userId_eventId_key" ON "InPersonEventAttendee"("userId", "eventId");

-- AddForeignKey
ALTER TABLE "InPersonEvent" ADD CONSTRAINT "InPersonEvent_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InPersonEventAttendee" ADD CONSTRAINT "InPersonEventAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InPersonEventAttendee" ADD CONSTRAINT "InPersonEventAttendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "InPersonEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RLS
ALTER Table "InPersonEvent" ENABLE ROW LEVEL SECURITY;

ALTER Table "InPersonEventAttendee" ENABLE ROW LEVEL SECURITY;