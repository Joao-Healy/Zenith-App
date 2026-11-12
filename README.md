# Zenith

Plataforma de aprimoramento pessoal (Personal Growth Manager): metas, registro de progresso e métricas em um único dashboard. Projeto acadêmico UNICESUSC – ADS21.

## Stack

- **Front:** React (Vite) + TypeScript + Bootstrap
- **Back:** Node.js + Express + TypeScript
- **Banco:** PostgreSQL + Prisma
- **Auth:** JWT + bcrypt

## Rodando localmente

Pré-requisitos: Node.js 20+ e PostgreSQL com um banco chamado `zenith`.

### Back-end

```bash
cd backend
cp .env.example .env     # preencha DATABASE_URL e JWT_SECRET
npm install
npx prisma migrate dev   # cria/atualiza as tabelas
npm run dev              # http://localhost:3000
```

### Front-end

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173 (o proxy /api aponta para o back)
```

Deixe os dois rodando, cada um em um terminal.

## Scripts úteis

| Onde | Comando | O que faz |
|---|---|---|
| backend | `npm run typecheck` | Checa os tipos sem gerar arquivos |
| backend | `npm run build` / `npm start` | Compila e roda a versão de produção |
| frontend | `npm run lint` | Roda o ESLint |
| frontend | `npm run build` | Gera o build de produção |

## Convenções

- Commits: `feat:`, `fix:`, `chore:`, `style:`
- Branches: `feature/nome-da-tela`
- Ordem de construção de cada funcionalidade: **Banco → Back (testado no Postman) → Front**
