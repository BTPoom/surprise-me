-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "scratchCards" JSONB NOT NULL DEFAULT '[]';

-- CreateTable
CREATE TABLE "ScratchReveal" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "revealedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScratchReveal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScratchReveal_pageId_idx" ON "ScratchReveal"("pageId");

-- CreateIndex
CREATE INDEX "ScratchReveal_pageId_cardId_idx" ON "ScratchReveal"("pageId", "cardId");

-- AddForeignKey
ALTER TABLE "ScratchReveal" ADD CONSTRAINT "ScratchReveal_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
