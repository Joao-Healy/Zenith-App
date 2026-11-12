import "dotenv/config";

function exigir(nome: string): string {
  const valor = process.env[nome];
  if (!valor) {
    throw new Error(`Variável de ambiente ${nome} não definida. Veja o .env.example.`);
  }
  return valor;
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  jwtSecret: exigir("JWT_SECRET"),
};
