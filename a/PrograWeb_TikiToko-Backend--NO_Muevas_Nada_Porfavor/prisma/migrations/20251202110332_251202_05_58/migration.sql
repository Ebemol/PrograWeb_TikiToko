/*
  Warnings:

  - You are about to drop the column `created_at` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Gift` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SentGift` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SentGift" DROP CONSTRAINT "SentGift_giftId_fkey";

-- DropForeignKey
ALTER TABLE "SentGift" DROP CONSTRAINT "SentGift_senderId_fkey";

-- DropForeignKey
ALTER TABLE "SentGift" DROP CONSTRAINT "SentGift_streamId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "created_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "streamId" SET DEFAULT 1;

-- DropTable
DROP TABLE "Gift";

-- DropTable
DROP TABLE "SentGift";
