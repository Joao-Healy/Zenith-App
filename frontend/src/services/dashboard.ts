import { requisitar } from './api'

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

export const buscarDashboard = () => requisitar<DashboardDados>('/dashboard')
