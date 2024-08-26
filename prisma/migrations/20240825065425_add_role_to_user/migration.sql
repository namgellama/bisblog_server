-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Blogger');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Blogger';
