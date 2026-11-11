
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

export async function buscarDashboard(): Promise<DashboardDados> {
  const resposta = await fetch('/api/dashboard')

  if (!resposta.ok) {
    throw new Error('Erro ao carregar o Dashboard')
  }

  return resposta.json()
}
