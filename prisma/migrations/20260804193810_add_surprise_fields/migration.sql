/*
  Warnings:

  - You are about to drop the `ScratchReveal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ScratchReveal" DROP CONSTRAINT "ScratchReveal_pageId_fkey";

-- AlterTable
ALTER TABLE "Page" ALTER COLUMN "scratchCards" DROP NOT NULL,
ALTER COLUMN "videoStyle" DROP NOT NULL,
ALTER COLUMN "voiceStyle" DROP NOT NULL,
ALTER COLUMN "voiceStyle" SET DEFAULT 'bubble';

-- DropTable
DROP TABLE "ScratchReveal";
