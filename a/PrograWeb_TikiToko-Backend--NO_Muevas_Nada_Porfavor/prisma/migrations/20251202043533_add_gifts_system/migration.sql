-- CreateTable
CREATE TABLE "Gift" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "coinCost" INTEGER NOT NULL,
    "pointsValue" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SentGift" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "streamId" INTEGER NOT NULL,
    "giftId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SentGift_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SentGift_streamId_idx" ON "SentGift"("streamId");

-- CreateIndex
CREATE INDEX "SentGift_senderId_idx" ON "SentGift"("senderId");

-- AddForeignKey
ALTER TABLE "SentGift" ADD CONSTRAINT "SentGift_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentGift" ADD CONSTRAINT "SentGift_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentGift" ADD CONSTRAINT "SentGift_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "Gift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
