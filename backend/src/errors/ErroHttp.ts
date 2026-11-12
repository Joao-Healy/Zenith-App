// Erro "esperado" (ex.: e-mail já cadastrado). Carrega o status HTTP junto.
export class ErroHttp extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ErroHttp";
  }
}
