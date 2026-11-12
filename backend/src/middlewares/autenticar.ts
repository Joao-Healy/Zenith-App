import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

// Exige o header "Authorization: Bearer <token>" e preenche req.usuarioId.
export function autenticar(req: Request, res: Response, next: NextFunction) {
  const cabecalho = req.headers.authorization;

  if (!cabecalho?.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Token não informado." });
  }

  try {
    const token = cabecalho.slice("Bearer ".length);
    const payload = jwt.verify(token, env.jwtSecret);

    if (typeof payload === "string" || !payload.sub) {
      return res.status(401).json({ erro: "Token inválido." });
    }

    req.usuarioId = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}
