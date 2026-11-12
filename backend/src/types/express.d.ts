// Diz ao TypeScript que, após o middleware de auth, req.usuarioId existe.
declare global {
  namespace Express {
    interface Request {
      usuarioId?: string;
    }
  }
}

export {};
