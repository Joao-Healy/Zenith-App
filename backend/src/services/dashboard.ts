import { prisma } from "../lib/prisma.js";

export async function buscarResumoDashboard(usuarioId: string) {
  const metas = await prisma.meta.findMany({
    where: { usuarioId },
    select: {
      valorAlvo: true,
      registros: { select: { valor: true } },
    },
  });

  const totalRegistros = metas.reduce(
    (soma, meta) => soma + meta.registros.length,
    0,
  );

  const concluidas = metas.filter((meta) => {
    const progresso = meta.registros.reduce((soma, r) => soma + r.valor, 0);
    return progresso >= meta.valorAlvo;
  }).length;

  const total = metas.length;
  const progressoGeral = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  return {
    metas: { total, concluidas, emAndamento: total - concluidas },
    registros: { total: totalRegistros },
    progressoGeral,
  };
}
