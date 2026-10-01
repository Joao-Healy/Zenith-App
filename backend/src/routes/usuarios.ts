import { Router } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/usuarios", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha || senha.length < 8) {
    return res.status(400).json({ erro: "Nome, e-mail e senha (mín. 8 caracteres) são obrigatórios." });
  }

  const jaExiste = await prisma.usuario.findUnique({ where: { email } });
  if (jaExiste) {
    return res.status(409).json({ erro: "E-mail já cadastrado." });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = await prisma.usuario.create({
    data: { nome, email, senhaHash },
    select: { id: true, nome: true, email: true, createdAt: true },
  });

  return res.status(201).json(usuario);
});

export default router;