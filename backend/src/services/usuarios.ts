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
// O bcrypt só considera os primeiros 72 bytes; acima disso a senha seria truncada em silêncio.
const TAMANHO_MAXIMO_SENHA_BYTES = 72;

// Hash descartável: usado quando o e-mail não existe, para o login levar o mesmo
// tempo nos dois casos e não revelar quais e-mails estão cadastrados.
const HASH_FALSO = bcrypt.hashSync("senha-descartavel", SALT_ROUNDS);
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
    senha.length < TAMANHO_MINIMO_SENHA ||
    Buffer.byteLength(senha) > TAMANHO_MAXIMO_SENHA_BYTES
  ) {
    throw new ErroHttp(
      400,
      `Informe nome, e-mail válido e senha entre ${TAMANHO_MINIMO_SENHA} e ${TAMANHO_MAXIMO_SENHA_BYTES} caracteres.`,
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

  // Sempre executa o bcrypt (mesmo sem usuário) e usa a mesma mensagem nos dois
  // casos: não revela quais e-mails existem, nem pela resposta nem pelo tempo.
  const hashParaComparar = usuario?.senhaHash ?? HASH_FALSO;
  const senhaCorreta = await bcrypt.compare(senha, hashParaComparar);

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
