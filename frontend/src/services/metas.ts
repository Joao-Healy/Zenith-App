import { requisitar } from './api'

export type Meta = {
  id: string
  nome: string
  categoria: string
  valorAlvo: number
  progresso: number
  createdAt: string
}

export type DadosMeta = {
  nome: string
  categoria: string
  valorAlvo: number
}

export const listarMetas = () => requisitar<Meta[]>('/metas')

export const criarMeta = (dados: DadosMeta) =>
  requisitar<Meta>('/metas', { metodo: 'POST', corpo: dados })

export const atualizarMeta = (id: string, dados: DadosMeta) =>
  requisitar<Meta>(`/metas/${id}`, { metodo: 'PUT', corpo: dados })

export const excluirMeta = (id: string) =>
  requisitar<void>(`/metas/${id}`, { metodo: 'DELETE' })
