-- DropForeignKey
ALTER TABLE "Goods" DROP CONSTRAINT "Goods_subCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Goods" DROP CONSTRAINT "Goods_typeId_fkey";

-- AlterTable
ALTER TABLE "Goods" ALTER COLUMN "typeId" DROP NOT NULL,
ALTER COLUMN "subCategoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Goods" ADD CONSTRAINT "Goods_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goods" ADD CONSTRAINT "Goods_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
