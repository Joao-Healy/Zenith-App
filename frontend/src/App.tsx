import { useEffect, useState } from 'react'
import Cabecalho from './components/Cabecalho'
import type { Tela } from './components/Cabecalho'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Metas from './pages/Metas'
import { definirAoSessaoExpirar } from './services/api'
import { lerToken, limparToken } from './services/auth'

function App() {
  const [logado, setLogado] = useState(() => lerToken() !== null)
  const [tela, setTela] = useState<Tela>('dashboard')

  function sair() {
    limparToken()
    setLogado(false)
    setTela('dashboard')
  }

  // Token expirado ou inválido: volta para o login.
  useEffect(() => {
    definirAoSessaoExpirar(sair)
    return () => definirAoSessaoExpirar(null)
  }, [])

  if (!logado) {
    return <Auth aoEntrar={() => setLogado(true)} />
  }

  return (
    <>
      <Cabecalho telaAtual={tela} aoNavegar={setTela} aoSair={sair} />
      {tela === 'dashboard' ? <Dashboard /> : <Metas />}
    </>
  )
}

export default App
