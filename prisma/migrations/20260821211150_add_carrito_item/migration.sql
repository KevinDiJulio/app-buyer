-- CreateTable
CREATE TABLE "CarritoItem" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "seleccionado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CarritoItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarritoItem_userId_productoId_key" ON "CarritoItem"("userId", "productoId");

-- AddForeignKey
ALTER TABLE "CarritoItem" ADD CONSTRAINT "CarritoItem_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
