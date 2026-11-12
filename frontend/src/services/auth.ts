const CHAVE_TOKEN = 'zenith_token'

export function lerToken(): string | null {
  return localStorage.getItem(CHAVE_TOKEN)
}

export function salvarToken(token: string): void {
  localStorage.setItem(CHAVE_TOKEN, token)
}

export function limparToken(): void {
  localStorage.removeItem(CHAVE_TOKEN)
}
