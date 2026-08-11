/*
  Warnings:

  - Added the required column `author_id` to the `drops` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "drops" ADD COLUMN     "author_id" TEXT NOT NULL,
ADD COLUMN     "comment_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dislike_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "like_count" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'google',
    "provider_id" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commnets" (
    "id" TEXT NOT NULL,
    "content" VARCHAR(200) NOT NULL,
    "drop_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commnets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drop_votes" (
    "id" TEXT NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "drop_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drop_votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_provider_provider_id_key" ON "users"("provider", "provider_id");

-- CreateIndex
CREATE INDEX "commnets_drop_id_idx" ON "commnets"("drop_id");

-- CreateIndex
CREATE UNIQUE INDEX "drop_votes_drop_id_author_id_key" ON "drop_votes"("drop_id", "author_id");

-- CreateIndex
CREATE INDEX "drops_author_id_idx" ON "drops"("author_id");

-- AddForeignKey
ALTER TABLE "drops" ADD CONSTRAINT "drops_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commnets" ADD CONSTRAINT "commnets_drop_id_fkey" FOREIGN KEY ("drop_id") REFERENCES "drops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commnets" ADD CONSTRAINT "commnets_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drop_votes" ADD CONSTRAINT "drop_votes_drop_id_fkey" FOREIGN KEY ("drop_id") REFERENCES "drops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drop_votes" ADD CONSTRAINT "drop_votes_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
