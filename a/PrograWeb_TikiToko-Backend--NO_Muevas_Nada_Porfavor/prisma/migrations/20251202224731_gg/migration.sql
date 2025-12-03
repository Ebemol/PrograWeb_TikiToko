/*
  Warnings:

  - You are about to drop the `Gift` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GiftTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GiftTransaction" DROP CONSTRAINT "GiftTransaction_giftId_fkey";

-- DropForeignKey
ALTER TABLE "GiftTransaction" DROP CONSTRAINT "GiftTransaction_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "GiftTransaction" DROP CONSTRAINT "GiftTransaction_senderId_fkey";

-- DropTable
DROP TABLE "Gift";

-- DropTable
DROP TABLE "GiftTransaction";
