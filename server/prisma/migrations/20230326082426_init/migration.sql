/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `articles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_user_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "articles_user_id_key" ON "articles"("user_id");

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
