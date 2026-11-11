
import { Router } from "express";
import type { Request, Response } from "express";
import { buscarResumoDashboard } from "../services/dashboard.js";

const router = Router();

router.get("/dashboard", async (_req: Request, res: Response) => {
  try {
    const resumo = await buscarResumoDashboard();

    return res.status(200).json(resumo);
  } catch (error) {
    console.error("Erro ao buscar dashboard:", error);

    return res.status(500).json({
      erro: "Erro ao carregar o Dashboard."
    });
  }
});

export default router;
