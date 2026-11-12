import express from "express";
import { env } from "./config/env.js";
import dashboardRouter from "./routes/dashboard.js";
import metasRouter from "./routes/metas.js";
import usuariosRouter from "./routes/usuarios.js";
import { rotaNaoEncontrada, tratarErros } from "./middlewares/tratarErros.js";

const app = express();

app.use(express.json());
app.use(usuariosRouter);
app.use(dashboardRouter);
app.use(metasRouter);

app.use(rotaNaoEncontrada);
app.use(tratarErros);

app.listen(env.port, () => {
  console.log(`Zenith API rodando na porta ${env.port}`);
});
