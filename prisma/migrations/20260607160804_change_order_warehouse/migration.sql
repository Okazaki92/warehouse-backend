/*
  Warnings:

  - Made the column `warehouseId` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_warehouseId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "warehouseId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
