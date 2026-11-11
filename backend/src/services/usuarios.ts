import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { env } from "../config/env.js";
import { ErroHttp } from "../errors/ErroHttp.js";
import { prisma } from "../lib/prisma.js";
import {
  ehEmailValido,
  ehTextoNaoVazio,
  normalizarEmail,
} from "../utils/validacao.js";

const SALT_ROUNDS = 10;
const TAMANHO_MINIMO_SENHA = 8;
const VALIDADE_TOKEN = "1h";

export async function cadastrarUsuario(dados: {
  nome: unknown;
  email: unknown;
  senha: unknown;
}) {
  const { nome, email, senha } = dados;

  if (
    !ehTextoNaoVazio(nome) ||
    !ehEmailValido(email) ||
    typeof senha !== "string" ||
    senha.length < TAMANHO_MINIMO_SENHA
  ) {
    throw new ErroHttp(
      400,
      `Informe nome, e-mail válido e senha com no mínimo ${TAMANHO_MINIMO_SENHA} caracteres.`,
    );
  }

  const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

  try {
    return await prisma.usuario.create({
      data: { nome: nome.trim(), email: normalizarEmail(email), senhaHash },
      select: { id: true, nome: true, email: true, createdAt: true },
    });
  } catch (erro) {
    // P2002 = violação de unique (e-mail repetido). Cobre também a corrida
    // entre duas requisições simultâneas, que um findUnique prévio não pega.
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2002") {
      throw new ErroHttp(409, "E-mail já cadastrado.");
    }
    throw erro;
  }
}

export async function autenticarUsuario(dados: { email: unknown; senha: unknown }) {
  const { email, senha } = dados;

  if (!ehEmailValido(email) || typeof senha !== "string" || senha.length === 0) {
    throw new ErroHttp(400, "E-mail e senha são obrigatórios.");
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email: normalizarEmail(email) },
  });

  // Mesma mensagem para "não existe" e "senha errada": não revela quais e-mails existem.
  const senhaCorreta =
    usuario !== null && (await bcrypt.compare(senha, usuario.senhaHash));

  if (!usuario || !senhaCorreta) {
    throw new ErroHttp(401, "E-mail ou senha inválidos.");
  }

  const token = jwt.sign({}, env.jwtSecret, {
    subject: usuario.id,
    expiresIn: VALIDADE_TOKEN,
  });

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      createdAt: usuario.createdAt,
    },
  };
}
