-- CreateTable
CREATE TABLE "crypto" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "units" DOUBLE PRECISION NOT NULL,
    "symbol" TEXT NOT NULL,
    "purchase_price" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "crypto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "crypto" ADD CONSTRAINT "crypto_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
