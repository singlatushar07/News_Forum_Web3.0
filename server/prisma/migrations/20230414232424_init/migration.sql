/*
  Warnings:

  - You are about to drop the column `authorId` on the `article` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[address]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "article_authorId_idx";

-- AlterTable
ALTER TABLE "article" DROP COLUMN "authorId";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_userId_key" ON "user"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_address_key" ON "user"("address");
