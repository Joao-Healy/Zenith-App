import type { NextFunction, Request, Response } from "express";

export function rotaNaoEncontrada(_req: Request, res: Response) {
  return res.status(404).json({ erro: "Rota não encontrada." });
}

// Último middleware: nenhum erro escapa em HTML nem expõe stack trace.
// O Express reconhece como tratador de erro pelos 4 parâmetros.
export function tratarErros(
  erro: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (erro instanceof SyntaxError && "body" in erro) {
    return res.status(400).json({ erro: "JSON inválido no corpo da requisição." });
  }

  console.error("Erro não tratado:", erro);
  return res.status(500).json({ erro: "Erro interno do servidor." });
}
