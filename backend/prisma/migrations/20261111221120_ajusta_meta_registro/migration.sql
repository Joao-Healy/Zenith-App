/*
  Warnings:

  - You are about to drop the column `valor_alvo` on the `Meta` table. All the data in the column will be lost.
  - Added the required column `valorAlvo` to the `Meta` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Meta" DROP CONSTRAINT "Meta_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Registro" DROP CONSTRAINT "Registro_metaId_fkey";

-- AlterTable
ALTER TABLE "Meta" DROP COLUMN "valor_alvo",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "valorAlvo" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE INDEX "Meta_usuarioId_idx" ON "Meta"("usuarioId");

-- CreateIndex
CREATE INDEX "Registro_metaId_idx" ON "Registro"("metaId");

-- AddForeignKey
ALTER TABLE "Meta" ADD CONSTRAINT "Meta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_metaId_fkey" FOREIGN KEY ("metaId") REFERENCES "Meta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
