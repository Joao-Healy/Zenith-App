import { useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import type { DadosMeta, Meta } from '../services/metas'

type MetaFormProps = {
  metaEmEdicao: Meta | null
  aoSalvar: (dados: DadosMeta) => Promise<void>
  aoCancelar: () => void
}

// O pai passa key={meta.id}, então o formulário reinicia sozinho ao trocar de meta.
function MetaForm({ metaEmEdicao, aoSalvar, aoCancelar }: MetaFormProps) {
  const [nome, setNome] = useState(metaEmEdicao?.nome ?? '')
  const [categoria, setCategoria] = useState(metaEmEdicao?.categoria ?? '')
  const [valorAlvo, setValorAlvo] = useState(
    metaEmEdicao ? String(metaEmEdicao.valorAlvo) : '',
  )
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function enviar(evento: FormEvent) {
    evento.preventDefault()
    setErro('')

    const valor = Number(valorAlvo)
    if (!Number.isFinite(valor) || valor <= 0) {
      setErro('O valor-alvo deve ser um número maior que zero.')
      return
    }

    setSalvando(true)
    try {
      await aoSalvar({ nome, categoria, valorAlvo: valor })
      if (!metaEmEdicao) {
        setNome('')
        setCategoria('')
        setValorAlvo('')
      }
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro inesperado.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Card body className="mb-4">
      <h2 className="h5 mb-3">{metaEmEdicao ? 'Editar meta' : 'Nova meta'}</h2>

      <Form onSubmit={enviar}>
        <Row className="g-3">
          <Col md={5}>
            <Form.Group controlId="meta-nome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                value={nome}
                maxLength={100}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="meta-categoria">
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                value={categoria}
                maxLength={100}
                placeholder="Ex.: Estudos, Treino, Trabalho"
                onChange={(e) => setCategoria(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group controlId="meta-valor">
              <Form.Label>Valor-alvo</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="any"
                value={valorAlvo}
                onChange={(e) => setValorAlvo(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {erro && (
          <Alert variant="danger" className="mt-3 mb-0">
            {erro}
          </Alert>
        )}

        <div className="d-flex gap-2 mt-3">
          <Button type="submit" disabled={salvando}>
            {salvando ? 'Salvando...' : metaEmEdicao ? 'Salvar alterações' : 'Criar meta'}
          </Button>
          {metaEmEdicao && (
            <Button variant="outline-secondary" onClick={aoCancelar}>
              Cancelar
            </Button>
          )}
        </div>
      </Form>
    </Card>
  )
}

export default MetaForm
