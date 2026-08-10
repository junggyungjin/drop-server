-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateTable
CREATE TABLE "drops" (
    "id" TEXT NOT NULL,
    "content" VARCHAR(500) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "drops_latitude_longitude_idx" ON "drops"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "drops_expires_at_idx" ON "drops"("expires_at");
