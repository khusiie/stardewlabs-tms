-- CreateEnum
CREATE TYPE "CommentType" AS ENUM ('PUBLIC', 'INTERNAL');

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "type" "CommentType" NOT NULL DEFAULT 'PUBLIC';
