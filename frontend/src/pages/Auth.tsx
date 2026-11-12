import { useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Button, Card, Container, Form } from 'react-bootstrap'
import { ErroApi } from '../services/api'
import { salvarToken } from '../services/auth'
import { cadastrar, entrar } from '../services/usuarios'

type AuthProps = {
  aoEntrar: () => void
}

function Auth({ aoEntrar }: AuthProps) {
  const [modo, setModo] = useState<'login' | 'cadastro'>('login')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const ehCadastro = modo === 'cadastro'

  function alternarModo() {
    setModo(ehCadastro ? 'login' : 'cadastro')
    setErro('')
  }

  async function enviar(evento: FormEvent) {
    evento.preventDefault()
    setErro('')
    setEnviando(true)

    try {
      if (ehCadastro) {
        await cadastrar(nome, email, senha)
        setModo('login') // conta criada: se o login falhar, a nova tentativa não repete o cadastro
      }
      const { token } = await entrar(email, senha)
      salvarToken(token)
      aoEntrar()
    } catch (e) {
      setErro(e instanceof ErroApi ? e.message : 'Erro inesperado.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="pagina-auth">
      <Container style={{ maxWidth: 420 }}>
        <h1 className="mb-4 text-center">Zenith</h1>

        <Card body>
          <h2 className="h5 mb-3">{ehCadastro ? 'Criar conta' : 'Entrar'}</h2>

          <Form onSubmit={enviar}>
            {ehCadastro && (
              <Form.Group className="mb-3" controlId="nome">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="senha">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                minLength={ehCadastro ? 8 : undefined}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              {ehCadastro && <Form.Text>Mínimo de 8 caracteres.</Form.Text>}
            </Form.Group>

            {erro && <Alert variant="danger">{erro}</Alert>}

            <Button type="submit" className="w-100" disabled={enviando}>
              {enviando ? 'Aguarde...' : ehCadastro ? 'Cadastrar' : 'Entrar'}
            </Button>
          </Form>

          <Button variant="link" className="mt-2 p-0" onClick={alternarModo}>
            {ehCadastro ? 'Já tenho conta' : 'Criar uma conta'}
          </Button>
        </Card>
      </Container>
    </main>
  )
}

export default Auth
