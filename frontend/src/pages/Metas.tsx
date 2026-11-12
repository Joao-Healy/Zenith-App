import { useCallback, useEffect, useState } from 'react'
import { Alert, Button, Card, Container, ProgressBar, Spinner } from 'react-bootstrap'
import MetaForm from '../components/MetaForm'
import {
  atualizarMeta,
  criarMeta,
  excluirMeta,
  listarMetas,
} from '../services/metas'
import type { DadosMeta, Meta } from '../services/metas'

function Metas() {
  const [metas, setMetas] = useState<Meta[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [metaEmEdicao, setMetaEmEdicao] = useState<Meta | null>(null)

  const carregar = useCallback(async () => {
    try {
      setMetas(await listarMetas())
      setErro('')
    } catch {
      setErro('Não foi possível carregar as metas.')
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregar()
  }, [carregar])

  async function salvar(dados: DadosMeta) {
    if (metaEmEdicao) {
      await atualizarMeta(metaEmEdicao.id, dados)
      setMetaEmEdicao(null)
    } else {
      await criarMeta(dados)
    }
    await carregar()
  }

  async function excluir(meta: Meta) {
    if (!window.confirm(`Excluir a meta "${meta.nome}"? Os registros dela também serão apagados.`)) {
      return
    }

    try {
      await excluirMeta(meta.id)
      if (metaEmEdicao?.id === meta.id) setMetaEmEdicao(null)
      await carregar()
    } catch {
      setErro('Não foi possível excluir a meta.')
    }
  }

  return (
    <main className="pagina">
      <Container>
        <h1 className="h3 mb-4">Metas</h1>

        <MetaForm
          key={metaEmEdicao?.id ?? 'nova'}
          metaEmEdicao={metaEmEdicao}
          aoSalvar={salvar}
          aoCancelar={() => setMetaEmEdicao(null)}
        />

        {carregando && <Spinner animation="border" role="status" />}
        {erro && <Alert variant="danger">{erro}</Alert>}

        {!carregando && !erro && metas.length === 0 && (
          <p className="text-secondary">Você ainda não tem metas. Crie a primeira acima.</p>
        )}

        <div className="d-grid gap-3">
          {metas.map((meta) => {
            const percentual = Math.min(100, Math.round((meta.progresso / meta.valorAlvo) * 100))

            return (
              <Card body key={meta.id}>
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <div>
                    <h2 className="h6 mb-1">{meta.nome}</h2>
                    <small className="text-secondary">{meta.categoria}</small>
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => setMetaEmEdicao(meta)}
                    >
                      Editar
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => excluir(meta)}>
                      Excluir
                    </Button>
                  </div>
                </div>

                <ProgressBar now={percentual} className="my-2" />
                <small className="text-secondary">
                  {meta.progresso} de {meta.valorAlvo} ({percentual}%)
                </small>
              </Card>
            )
          })}
        </div>
      </Container>
    </main>
  )
}

export default Metas
