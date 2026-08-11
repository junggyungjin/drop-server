/*
  Warnings:

  - You are about to drop the `commnets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "commnets" DROP CONSTRAINT "commnets_author_id_fkey";

-- DropForeignKey
ALTER TABLE "commnets" DROP CONSTRAINT "commnets_drop_id_fkey";

-- DropTable
DROP TABLE "commnets";

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "content" VARCHAR(200) NOT NULL,
    "drop_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "comments_drop_id_idx" ON "comments"("drop_id");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_drop_id_fkey" FOREIGN KEY ("drop_id") REFERENCES "drops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
