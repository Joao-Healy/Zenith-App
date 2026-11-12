import { ErroHttp } from "../errors/ErroHttp.js";
import { prisma } from "../lib/prisma.js";
import { ehTextoNaoVazio } from "../utils/validacao.js";

const TAMANHO_MAXIMO_TEXTO = 100;

type DadosMeta = { nome: string; categoria: string; valorAlvo: number };

// Campos devolvidos ao cliente. Os registros entram só para calcular o progresso.
const selecaoMeta = {
  id: true,
  nome: true,
  categoria: true,
  valorAlvo: true,
  createdAt: true,
  registros: { select: { valor: true } },
} as const;

function validarDadosMeta(dados: Record<string, unknown>): DadosMeta {
  const { nome, categoria, valorAlvo } = dados;

  if (
    !ehTextoNaoVazio(nome) ||
    !ehTextoNaoVazio(categoria) ||
    typeof valorAlvo !== "number" ||
    !Number.isFinite(valorAlvo) ||
    valorAlvo <= 0
  ) {
    throw new ErroHttp(
      400,
      "Informe nome, categoria e valorAlvo (número maior que zero).",
    );
  }

  if (
    nome.trim().length > TAMANHO_MAXIMO_TEXTO ||
    categoria.trim().length > TAMANHO_MAXIMO_TEXTO
  ) {
    throw new ErroHttp(
      400,
      `Nome e categoria devem ter no máximo ${TAMANHO_MAXIMO_TEXTO} caracteres.`,
    );
  }

  return { nome: nome.trim(), categoria: categoria.trim(), valorAlvo };
}

function formatarMeta<T extends { registros: { valor: number }[] }>(meta: T) {
  const { registros, ...dadosDaMeta } = meta;
  const soma = registros.reduce((total, r) => total + r.valor, 0);
  // Float acumula erro (0.1 + 0.2 = 0.30000000000000004): arredonda a 2 casas.
  const progresso = Math.round(soma * 100) / 100;
  return { ...dadosDaMeta, progresso };
}

// Filtra SEMPRE por usuarioId: meta de outra pessoa é tratada como inexistente (404).
async function buscarMetaDoUsuario(id: string, usuarioId: string) {
  const meta = await prisma.meta.findFirst({
    where: { id, usuarioId },
    select: selecaoMeta,
  });

  if (!meta) {
    throw new ErroHttp(404, "Meta não encontrada.");
  }
  return meta;
}

export async function criarMeta(usuarioId: string, dados: Record<string, unknown>) {
  const meta = await prisma.meta.create({
    data: { ...validarDadosMeta(dados), usuarioId },
    select: selecaoMeta,
  });
  return formatarMeta(meta);
}

export async function listarMetas(usuarioId: string) {
  const metas = await prisma.meta.findMany({
    where: { usuarioId },
    orderBy: { createdAt: "desc" },
    select: selecaoMeta,
  });
  return metas.map(formatarMeta);
}

export async function obterMeta(id: string, usuarioId: string) {
  return formatarMeta(await buscarMetaDoUsuario(id, usuarioId));
}

export async function atualizarMeta(
  id: string,
  usuarioId: string,
  dados: Record<string, unknown>,
) {
  const novosDados = validarDadosMeta(dados);
  await buscarMetaDoUsuario(id, usuarioId);

  const meta = await prisma.meta.update({
    where: { id },
    data: novosDados,
    select: selecaoMeta,
  });
  return formatarMeta(meta);
}

export async function excluirMeta(id: string, usuarioId: string) {
  await buscarMetaDoUsuario(id, usuarioId);
  await prisma.meta.delete({ where: { id } });
}
