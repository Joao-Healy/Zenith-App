import { Router } from "express";
import type { Request, Response } from "express";
import { autenticar } from "../middlewares/autenticar.js";
import {
  atualizarMeta,
  criarMeta,
  excluirMeta,
  listarMetas,
  obterMeta,
} from "../services/metas.js";
import { responderErro } from "../utils/responderErro.js";

const router = Router();

// Todas as rotas /metas exigem login.
router.use("/metas", autenticar);

// RF-004 – Criar meta
router.post("/metas", async (req: Request, res: Response) => {
  try {
    const meta = await criarMeta(req.usuarioId!, req.body ?? {});
    return res.status(201).json(meta);
  } catch (erro) {
    return responderErro(res, erro, "criar meta");
  }
});

// RF-004 – Listar metas do usuário
router.get("/metas", async (req: Request, res: Response) => {
  try {
    return res.status(200).json(await listarMetas(req.usuarioId!));
  } catch (erro) {
    return responderErro(res, erro, "listar metas");
  }
});

// RF-004 – Buscar uma meta
router.get("/metas/:id", async (req: Request, res: Response) => {
  try {
    return res.status(200).json(await obterMeta(String(req.params.id), req.usuarioId!));
  } catch (erro) {
    return responderErro(res, erro, "buscar meta");
  }
});

// RF-004 – Editar meta
router.put("/metas/:id", async (req: Request, res: Response) => {
  try {
    const meta = await atualizarMeta(String(req.params.id), req.usuarioId!, req.body ?? {});
    return res.status(200).json(meta);
  } catch (erro) {
    return responderErro(res, erro, "editar meta");
  }
});

// RF-004 – Excluir meta (apaga os registros junto, por causa do onDelete: Cascade)
router.delete("/metas/:id", async (req: Request, res: Response) => {
  try {
    await excluirMeta(String(req.params.id), req.usuarioId!);
    return res.status(204).send();
  } catch (erro) {
    return responderErro(res, erro, "excluir meta");
  }
});

export default router;
