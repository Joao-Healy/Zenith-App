import { requisitar } from './api'

type RespostaLogin = {
  token: string
  usuario: { id: string; nome: string; email: string }
}

export function entrar(email: string, senha: string): Promise<RespostaLogin> {
  return requisitar<RespostaLogin>('/usuarios/login', {
    metodo: 'POST',
    corpo: { email, senha },
  })
}

export function cadastrar(nome: string, email: string, senha: string) {
  return requisitar('/usuarios', {
    metodo: 'POST',
    corpo: { nome, email, senha },
  })
}
