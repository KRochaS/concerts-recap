<img width="1920" height="901" alt="image" src="https://github.com/user-attachments/assets/8ae6457f-37e1-4fd2-950c-e9660fb25ee7" />
<img width="1920" height="1868" alt="FireShot Capture 004 - Concerts Recap - localhost" src="https://github.com/user-attachments/assets/5026c186-1f0e-4ddb-87b7-3c0c7dbc3d5e" />
<img width="1920" height="1568" alt="FireShot Capture 005 - Concerts Recap - localhost" src="https://github.com/user-attachments/assets/3e7013a3-be7e-4228-80a1-0ad4fd8ccc85" />

# Concerts Recap

Aplicação web para registrar memórias de shows, com upload de ingresso, extração automática de dados via IA e organização em fluxo de cadastro em duas etapas.

## Funcionalidades

- Cadastro de memórias de shows com validação
- Upload de imagem do ingresso com Firebase Storage
- Extração automática de data, artista, local e cidade via Vercel AI SDK
- Busca de shows por artista, venue ou cidade
- Fluxo de cadastro em duas etapas (`Initial Memory` e `Organize Memory`)
- Testes unitários e E2E (Jest + Playwright)

## Stack

- Next.js 16
- React 19 + TypeScript
- Tailwind CSS 4
- Prisma ORM + PostgreSQL
- Firebase Storage
- Vercel AI SDK
- Jest + Testing Library
- Playwright
- Docker Compose

## Pré-requisitos

- Node.js 20+
- npm 10+
- Docker e Docker Compose (recomendado para subir o banco local)
- Credenciais do Firebase Storage
- Chave do provedor de IA (ex.: `OPENAI_API_KEY`) para extração por imagem

## Configuração de ambiente

Crie um arquivo `.env` na raiz:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/concert_memories?schema=public"

NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""

NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Necessária para o endpoint /api/chat que usa modelo openai/gpt-4o
OPENAI_API_KEY=""

# Opcional (controle do total de seeds no setup E2E)
E2E_SEED_COUNT=20
```

## Como rodar localmente

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/concerts-recap.git
cd concerts-recap
```

2. Instale as dependências:

```bash
npm install
```

3. Suba o Postgres com Docker:

```bash
docker compose up -d
```

4. Rode as migrações:

```bash
npm run db:migrate
```

5. (Opcional) Popule com dados fictícios:

```bash
npm run db:seed
```

6. Inicie o projeto:

```bash
npm run dev
```

7. Acesse:

`http://localhost:3000`

## Scripts úteis

```bash
npm run dev            # ambiente de desenvolvimento
npm run build          # build de produção + prisma generate + migrate deploy
npm run start          # executa build em produção
npm run lint           # lint
npm run typecheck      # checagem de tipos
npm run format         # formatação com prettier

npm run db:generate    # gera client do prisma
npm run db:migrate     # cria/aplica migração local
npm run db:seed        # popula banco com faker
npm run db:push        # sincroniza schema sem migração
npm run db:studio      # abre prisma studio

npm run test           # testes unitários
npm run test:coverage  # cobertura
npm run test:e2e       # testes E2E
npm run test:e2e:ui    # E2E com UI do playwright
```

## Estrutura resumida

```text
src/
  app/            # rotas e server actions (Next.js App Router)
  core/           # regras de negócio (use cases + domínio)
  infra/          # repositórios e adaptadores externos
  presentation/   # componentes, páginas e hooks de UI
  lib/            # utilitários compartilhados
prisma/           # schema, migrações e seed
e2e/              # testes end-to-end (Playwright)
```

## Testes

Para executar os testes:

```bash
npm run test
npm run test:e2e
```

Observação: os testes E2E usam `DATABASE_URL` e executam seed no `global-setup`.
