import { lerToken } from './auth'

// Erro de uma chamada à API, com o status HTTP e a mensagem vinda do back-end.
export class ErroApi extends Error {
  status: number

  constructor(status: number, mensagem: string) {
    super(mensagem)
    this.name = 'ErroApi'
    this.status = status
  }
}

// Função chamada quando a API responde 401 (token ausente, inválido ou expirado).
let aoSessaoExpirar: (() => void) | null = null

export function definirAoSessaoExpirar(callback: (() => void) | null): void {
  aoSessaoExpirar = callback
}

export async function requisitar<T>(
  caminho: string,
  opcoes: { metodo?: string; corpo?: unknown } = {},
): Promise<T> {
  const token = lerToken()
  const headers: Record<string, string> = {}

  if (opcoes.corpo !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let resposta: Response
  try {
    resposta = await fetch(`/api${caminho}`, {
      method: opcoes.metodo ?? 'GET',
      headers,
      body: opcoes.corpo !== undefined ? JSON.stringify(opcoes.corpo) : null,
    })
  } catch {
    throw new ErroApi(0, 'Não foi possível conectar ao servidor.')
  }

  if (resposta.status === 204) return undefined as T

  const dados = await resposta.json().catch(() => null)

  if (!resposta.ok) {
    // Login com senha errada também é 401, mas só expira a sessão se havia token.
    if (resposta.status === 401 && token) aoSessaoExpirar?.()
    throw new ErroApi(resposta.status, dados?.erro ?? 'Erro inesperado.')
  }

  return dados as T
}
