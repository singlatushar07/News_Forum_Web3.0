-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_user_id_fkey";

-- DropIndex
DROP INDEX "articles_user_id_key";

-- CreateIndex
CREATE INDEX "articles_user_id_idx" ON "articles"("user_id");
