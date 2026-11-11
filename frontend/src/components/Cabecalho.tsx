import { Button, Container, Nav, Navbar } from 'react-bootstrap'

export type Tela = 'dashboard' | 'metas'

type CabecalhoProps = {
  telaAtual: Tela
  aoNavegar: (tela: Tela) => void
  aoSair: () => void
}

function Cabecalho({ telaAtual, aoNavegar, aoSair }: CabecalhoProps) {
  return (
    <Navbar className="border-bottom" style={{ borderColor: 'var(--zn-border)' }}>
      <Container>
        <Navbar.Brand>Zenith</Navbar.Brand>

        <Nav activeKey={telaAtual} onSelect={(chave) => aoNavegar(chave as Tela)}>
          <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
          <Nav.Link eventKey="metas">Metas</Nav.Link>
        </Nav>

        <Button variant="outline-secondary" size="sm" onClick={aoSair}>
          Sair
        </Button>
      </Container>
    </Navbar>
  )
}

export default Cabecalho
