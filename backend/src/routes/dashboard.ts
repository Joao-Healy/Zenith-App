import { Router } from "express";
import type { Request, Response } from "express";
import { autenticar } from "../middlewares/autenticar.js";
import { buscarResumoDashboard } from "../services/dashboard.js";

const router = Router();

// RF-003 – Dashboard (somente dados do usuário logado)
router.get("/dashboard", autenticar, async (req: Request, res: Response) => {
  try {
    const resumo = await buscarResumoDashboard(req.usuarioId!);
    return res.status(200).json(resumo);
  } catch (erro) {
    console.error("Erro ao buscar dashboard:", erro);
    return res.status(500).json({ erro: "Erro ao carregar o Dashboard." });
  }
});

export default router;
