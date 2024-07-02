/*
  Warnings:

  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `deliveryCharge` on the `PaymentInfo` table. All the data in the column will be lost.
  - You are about to drop the column `paymentType` on the `PaymentInfo` table. All the data in the column will be lost.
  - Added the required column `paymentMethodId` to the `PaymentInfo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('INREVIEW', 'ACCEPTED', 'INPOGRESS', 'OUTFORDELIVERY', 'DELIVERED', 'CANCELLED', 'REJECTED');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'INREVIEW';

-- AlterTable
ALTER TABLE "PaymentInfo" DROP COLUMN "deliveryCharge",
DROP COLUMN "paymentType",
ADD COLUMN     "paymentMethodId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "orderStatus";

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL DEFAULT 'COD',
    "charge" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_id_key" ON "PaymentMethod"("id");

-- AddForeignKey
ALTER TABLE "PaymentInfo" ADD CONSTRAINT "PaymentInfo_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
