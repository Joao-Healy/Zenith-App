import { Router } from "express";
import type { Request, Response } from "express";
import { autenticarUsuario, cadastrarUsuario } from "../services/usuarios.js";
import { responderErro } from "../utils/responderErro.js";

const router = Router();

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
