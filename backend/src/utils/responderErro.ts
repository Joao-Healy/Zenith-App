import type { Response } from "express";
import { ErroHttp } from "../errors/ErroHttp.js";

// Converte erros dos services em resposta HTTP. Usado por todas as rotas.
export function responderErro(res: Response, erro: unknown, contexto: string) {
  if (erro instanceof ErroHttp) {
    return res.status(erro.status).json({ erro: erro.message });
  }
  console.error(`Erro em ${contexto}:`, erro);
  return res.status(500).json({ erro: "Erro interno do servidor." });
}
