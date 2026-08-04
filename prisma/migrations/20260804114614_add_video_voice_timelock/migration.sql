-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "secretMessage" TEXT,
ADD COLUMN     "secretUnlockAt" TIMESTAMP(3),
ADD COLUMN     "videoStyle" TEXT NOT NULL DEFAULT 'film',
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "voiceStyle" TEXT NOT NULL DEFAULT 'cassette',
ADD COLUMN     "voiceUrl" TEXT;
