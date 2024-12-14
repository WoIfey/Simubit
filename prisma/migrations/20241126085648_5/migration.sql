/*
  Warnings:

  - Added the required column `coin_id` to the `crypto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "crypto" ADD COLUMN     "coin_id" TEXT NOT NULL;
