
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function buscarResumoDashboard() {
  const [metas, registros] = await Promise.all([
    prisma.meta.findMany({
      include: {
        registros: true
      }
    }),
    prisma.registro.count()
  ]);

  let concluidas = 0;

  for (const meta of metas) {
    const progresso = meta.registros.reduce(
      (total, registro) => total + registro.valor,
      0
    );

    if (progresso >= meta.valor_alvo) {
      concluidas++;
    }
  }

  const total = metas.length;
  const emAndamento = total - concluidas;

  const progressoGeral =
    total > 0
      ? Math.round((concluidas / total) * 100)
      : 0;

  return {
    metas: {
      total,
      concluidas,
      emAndamento
    },
    registros: {
      total: registros
    },
    progressoGeral
  };
}
