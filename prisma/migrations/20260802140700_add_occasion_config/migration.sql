-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "animationSet" TEXT NOT NULL DEFAULT 'hearts',
ADD COLUMN     "endingEffect" TEXT NOT NULL DEFAULT 'confetti',
ADD COLUMN     "envelopeStyle" TEXT NOT NULL DEFAULT 'classic',
ADD COLUMN     "musicStyle" TEXT NOT NULL DEFAULT 'default',
ADD COLUMN     "questions" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "sections" JSONB NOT NULL DEFAULT '[]',
ALTER COLUMN "occasion" SET DEFAULT 'custom';
