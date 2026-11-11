export type DashboardDados = {
  metas: {
    total: number
    concluidas: number
    emAndamento: number
  }
  registros: {
    total: number
  }
  progressoGeral: number
}

// TODO (tela de login): guardar o token ao logar. Por enquanto lê do localStorage.
const CHAVE_TOKEN = 'zenith_token'

export async function buscarDashboard(): Promise<DashboardDados> {
  const token = localStorage.getItem(CHAVE_TOKEN)

  const resposta = await fetch('/api/dashboard', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!resposta.ok) {
    throw new Error('Erro ao carregar o Dashboard')
  }

  return resposta.json()
}
