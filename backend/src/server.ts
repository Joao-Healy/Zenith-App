import express from "express";
import usuariosRouter from "./routes/usuarios.js";
import dashboardRouter from "./routes/dashboard.js";
import "dotenv/config";

const app = express();

app.use(express.json());

app.use(usuariosRouter);
app.use(dashboardRouter);

app.listen(3000, () => {
  console.log("Zenith API rodando na porta 3000");
});