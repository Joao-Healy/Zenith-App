import { Router } from "express";
import type { Request, Response } from "express";
import { ErroHttp } from "../errors/ErroHttp.js";
import { autenticarUsuario, cadastrarUsuario } from "../services/usuarios.js";

const router = Router();

function responderErro(res: Response, erro: unknown, contexto: string) {
  if (erro instanceof ErroHttp) {
    return res.status(erro.status).json({ erro: erro.message });
  }
  console.error(`Erro em ${contexto}:`, erro);
  return res.status(500).json({ erro: "Erro interno do servidor." });
}

// RF-001 – Cadastro
router.post("/usuarios", async (req: Request, res: Response) => {
  try {
    const usuario = await cadastrarUsuario(req.body ?? {});
    return res.status(201).json(usuario);
  } catch (erro) {
    return responderErro(res, erro, "cadastro");
  }
});

// RF-002 – Login (devolve o JWT)
router.post("/usuarios/login", async (req: Request, res: Response) => {
  try {
    const resultado = await autenticarUsuario(req.body ?? {});
    return res.status(200).json(resultado);
  } catch (erro) {
    return responderErro(res, erro, "login");
  }
});

export default router;
