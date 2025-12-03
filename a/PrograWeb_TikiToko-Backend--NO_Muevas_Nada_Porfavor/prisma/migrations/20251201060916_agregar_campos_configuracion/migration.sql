-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "settings" JSONB,
ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'dark';
