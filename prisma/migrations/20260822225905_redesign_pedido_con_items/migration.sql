/*
  Warnings:

  - You are about to drop the column `cantidad` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `productoId` on the `Pedido` table. All the data in the column will be lost.
  - Added the required column `total` to the `Pedido` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_productoId_fkey";

-- AlterTable
ALTER TABLE "Pedido" DROP COLUMN "cantidad",
DROP COLUMN "productoId",
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "PedidoItem" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PedidoItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PedidoItem" ADD CONSTRAINT "PedidoItem_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoItem" ADD CONSTRAINT "PedidoItem_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
