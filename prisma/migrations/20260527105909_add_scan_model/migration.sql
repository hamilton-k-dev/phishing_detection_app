-- CreateTable
CREATE TABLE "scan" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "details" JSONB NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "scan_userId_idx" ON "scan"("userId");

-- CreateIndex
CREATE INDEX "scan_createdAt_idx" ON "scan"("createdAt");

-- AddForeignKey
ALTER TABLE "scan" ADD CONSTRAINT "scan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
