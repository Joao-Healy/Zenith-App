
import { useEffect, useState } from 'react'
import { Container, Row, Col, ProgressBar, Alert, Spinner } from 'react-bootstrap'
import { buscarDashboard } from '../services/dashboard'
import type { DashboardDados } from '../services/dashboard'
import DashboardCard from '../components/DashboardCard'
import '../App.css'

function Dashboard() {
  const [dadosDashboard, setDadosDashboard] =
    useState<DashboardDados | null>(null)

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const dados = await buscarDashboard()
        setDadosDashboard(dados)
      } catch {
        setErro('Não foi possível carregar o Dashboard.')
      } finally {
        setCarregando(false)
      }
    }

    carregarDashboard()
  }, [])

  return (
    <main className="dashboard">
      <Container>
        <header className="dashboard-header">
          <h1>Zenith</h1>
          <p>Bem-vindo ao seu Dashboard Central!</p>
        </header>

        <section className="dashboard-api">
          <h2>Resumo de Metas e Registros</h2>

          {carregando && (
            <Spinner animation="border" role="status" />
          )}

          {erro && <Alert variant="danger">{erro}</Alert>}

          {dadosDashboard && (
            <>
              <Row className="g-3">
                <Col xs={12} md={4}>
                  <DashboardCard
                    titulo="Metas em andamento"
                    valor={dadosDashboard.metas.emAndamento}
                  />
                </Col>

                <Col xs={12} md={4}>
                  <DashboardCard
                    titulo="Metas concluídas"
                    valor={dadosDashboard.metas.concluidas}
                  />
                </Col>

                <Col xs={12} md={4}>
                  <DashboardCard
                    titulo="Registros realizados"
                    valor={dadosDashboard.registros.total}
                  />
                </Col>
              </Row>

              <section className="progresso-section">
                <div className="progresso-header">
                  <h2>Progresso Geral</h2>
                  <span>{dadosDashboard.progressoGeral}%</span>
                </div>

                <ProgressBar
                  now={dadosDashboard.progressoGeral}
                  min={0}
                  max={100}
                  label={`${dadosDashboard.progressoGeral}%`}
                />

                <p>
                  {dadosDashboard.metas.concluidas} de{' '}
                  {dadosDashboard.metas.total} metas concluídas
                </p>
              </section>
            </>
          )}
        </section>
      </Container>
    </main>
  )
}

export default Dashboard
