-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'FAILED';

-- AlterTable
ALTER TABLE "PaymentInfo" ALTER COLUMN "additionalCharge" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "PaymentMethod" ALTER COLUMN "charge" SET DEFAULT 0;
