-- CreateTable
CREATE TABLE "ResetUserPasswordToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "ResetUserPasswordToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResetUserPasswordToken_token_key" ON "ResetUserPasswordToken"("token");

-- AddForeignKey
ALTER TABLE "ResetUserPasswordToken" ADD CONSTRAINT "ResetUserPasswordToken_token_fkey" FOREIGN KEY ("token") REFERENCES "Token"("token") ON DELETE RESTRICT ON UPDATE CASCADE;
