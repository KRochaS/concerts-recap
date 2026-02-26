This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

# Concerts Recap

Um sistema web para registrar, organizar e compartilhar memórias de shows, com upload de ingressos, integração com IA e arquitetura moderna fullstack.

## Funcionalidades

- Cadastro de shows/memórias
- Upload de imagens de ingressos (Firebase Storage)
- Visualização e edição dos registros
- Integração com Vercel AI SDK para leitura de imagens
- Autenticação via Google
- Fluxo flexível: salve só a imagem e edite depois
- UI moderna com React e Tailwind

## Tecnologias Utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- Firebase Storage
- Prisma ORM
- PostgreSQL
- Autenticação OAuth (Google)
- Vercel AI SDK
- Docker (docker-compose)
- Jest, Playwright (testes)

## Como rodar o projeto

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/concerts-recap.git
   cd concerts-recap
   ```

2. **Configure o arquivo `.env`:**
   - Preencha as variáveis do Firebase, banco de dados e autenticação Google.
   - Exemplo:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=...
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
     NEXT_PUBLIC_FIREBASE_APP_ID=...
     DATABASE_URL=...
     AUTH_GOOGLE_ID=...
     AUTH_GOOGLE_SECRET=...
     AUTH_SECRET=...
     ```

3. **Instale as dependências:**

   ```bash
   npm install
   ```

4. **Rode as migrations do banco:**

   ```bash
   npx prisma migrate dev
   ```

5. **Inicie o servidor:**

   ```bash
   npm run dev
   ```

6. **Acesse em:**
   [http://localhost:3000](http://localhost:3000)

## Testes

- Para rodar os testes:
  ```bash
  npm run test
  # ou
  npm run test:e2e
  ```

## Observações

- As regras do Firebase Storage devem ser ajustadas para produção.
- Nunca exponha segredos sensíveis em repositórios públicos.
- Projeto ideal para portfólio, demonstrando integração fullstack, cloud e IA.

---

Desenvolvido por [Seu Nome](https://github.com/seu-usuario)
