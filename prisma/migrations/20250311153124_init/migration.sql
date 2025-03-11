-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('FREE', 'PREMIUM');

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "plan" "PlanType" NOT NULL DEFAULT 'FREE',
    "rateLimit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");
