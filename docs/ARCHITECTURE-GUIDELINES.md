# Diretrizes de Arquitetura — concerts-recap

Este documento descreve os padrões arquiteturais, convenções de código e práticas do projeto **concerts-recap**, para que um LLM (ou um novo desenvolvedor) consiga gerar código consistente com o restante da base.

## 1. Stack e tecnologias principais

- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5 (`strict: true`).
- **Banco de dados**: PostgreSQL, acessado via Prisma 7 com `@prisma/adapter-pg` (driver adapter) + `pg.Pool`. Client gerado em `src/generated/prisma` (nunca editar manualmente).
- **IA**: Vercel AI SDK (`ai`, `@ai-sdk/react`), modelo `openai/gpt-4o`, usado para extrair dados de ingressos a partir de imagens.
- **Auth/armazenamento**: `next-auth` (beta) e Firebase (`firebase`, `firebase-admin`) para upload de imagem do ingresso.
- **Formulários/validação**: `react-hook-form` + `@hookform/resolvers` + `zod`.
- **Estilo**: Tailwind CSS 4, `class-variance-authority`, `clsx` + `tailwind-merge` via helper `cn()`. Sem CSS Modules.
- **Estado de URL**: `nuqs` (com `NuqsAdapter` no layout raiz).
- **Testes**: Jest 30 + Testing Library (unitários), Playwright (e2e), `@faker-js/faker` (apenas em `prisma/seed.ts`).
- **Qualidade/commits**: ESLint 9 (flat config), Prettier 3, `lefthook` (git hooks), `commitlint` (Conventional Commits obrigatório).

## 2. Estrutura de pastas (`src/`)

| Pasta                    | Responsabilidade                                                                                                                                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `app/`                   | Next.js App Router: páginas (RSC por padrão), Route Handlers (`api/`) e Server Actions (`actions/`). É a **composition root**: único lugar autorizado a instanciar classes de `infra` e conectá-las aos use cases. |
| `core/domain/`           | Camada de negócio pura: entidades (`type`s simples) e **interfaces** de repositório/serviço. Não importa nada de outras camadas. Organizada por contexto (`concerts/`, `ai/`).                                     |
| `core/application/`      | Use cases (orquestram interfaces de domínio) + DTOs/schemas Zod. Depende apenas de `core/domain`.                                                                                                                  |
| `generated/prisma/`      | Prisma Client gerado (output customizado). Nunca editar manualmente.                                                                                                                                               |
| `infra/repository/`      | Implementações concretas de repositório (Prisma) que satisfazem interfaces de `core/domain`.                                                                                                                       |
| `infra/services/`        | Adapters concretos de serviços externos (ex.: cliente da API de IA) que satisfazem interfaces de `core/domain`.                                                                                                    |
| `lib/`                   | Utilitários de baixo nível usáveis por qualquer camada: `prisma.ts` (singleton do client), `utils.ts` (`cn()`), `test-utils.tsx` (render customizado do RTL).                                                      |
| `presentation/hooks/`    | Hooks React (`use*`) que encapsulam estado/fluxo de UI, agrupados por feature (`newConcert/`, `concertSearch/`). Chamam Server Actions, nunca repositórios/use cases diretamente.                                  |
| `presentation/mappers/`  | Reservado para lógica de mapeamento para view-model (convenção existe, ainda não usada).                                                                                                                           |
| `presentation/pages/`    | Componentes de "página" por feature (`home/`, `concerts/`, `newConcert/`), cada um em sua própria pasta com o nome do componente.                                                                                  |
| `presentation/shared/`   | UI reutilizável entre features: `components/` (design system: Button, Input, Card...), `lib/` (helpers client-side, ex. upload no Firebase), `ui-model/` (`shared.model.ts` com interfaces de props).              |
| `presentation/ui-model/` | View models específicos de feature: enums, mapas `Record<Enum, Component>` para controlar fluxos (ex. `newConcertFlow.ts`).                                                                                        |
| `styles/`                | CSS global do Tailwind (`globals.css`).                                                                                                                                                                            |
| `tests/`                 | Testes espelhando a estrutura de `src/` (`app/`, `core/`, `infra/`), mais `mocks/` (fakes de repositório e `data-providers/`).                                                                                     |
| `e2e/` (raiz do repo)    | Specs Playwright + `global-setup.ts` (seed do banco antes da execução).                                                                                                                                            |

## 3. Regra de dependência entre camadas

```
app  →  presentation  →  core/application  →  core/domain  ←  infra
```

- `core/domain` não importa nada de outras camadas.
- `core/application` importa apenas de `core/domain`.
- `infra` implementa interfaces de `core/domain`, mas só é instanciada em `app/**`.
- `presentation` (componentes/hooks) nunca instancia repositórios ou use cases diretamente — sempre chama uma Server Action.
- Somente `app/**` (páginas, actions, route handlers) pode fazer `new` de classes de `infra` e conectá-las a use cases.

Não existe container de injeção de dependência: a composição é manual, feita em cada ponto de entrada (`app/`), às vezes memoizada por requisição com `React.cache()`:

```ts
const getSearchUseCase = cache(() => {
  const repository = new PrismaConcertRepository(prisma);
  return new SearchConcertSummaryUseCase(repository);
});
```

## 4. Camada de domínio (`core/domain`)

- Entidades são `type`s simples, sem classes. Visões derivadas usam `Pick`/`Omit`:

```ts
// src/core/domain/concerts/concert.entity.ts
export type Concert = {
  id: string;
  date: Date;
  artist: string;
  venue: string;
  city: string;
  // ...campos de rating, tags, etc.
};

export type ConcertSummary = Pick<
  Concert,
  | 'id'
  | 'artist'
  | 'venue'
  | 'city'
  | 'date'
  | 'setlistRating'
  | 'kmTraveled'
  | 'createdAt'
  | 'updatedAt'
>;
```

- Interfaces de repositório/serviço **sem prefixo `I`**, nome descritivo terminando em `Repository`/`Service`:

```ts
// src/core/domain/concerts/concerts.repository.ts
export interface ConcertRepository {
  create(data: CreateConcertInput): Promise<void>;
  findByConcert(data: CreateConcertInput): Promise<ConcertSummary | null>;
  findManySummaries(): Promise<ConcertSummary[]>;
  searchManySummaries(term: string): Promise<ConcertSummary[]>;
}
```

Os contratos de domínio devem usar tipos definidos em `core/domain`. DTOs e schemas Zod de `core/application` pertencem à fronteira de validação da aplicação e não podem ser importados pelo domínio.

- Cada pasta de domínio tem um barrel `index.ts` (`export * from './x.entity'`).

## 5. Camada de aplicação (`core/application`)

- Um use case por arquivo/classe, nome em PascalCase terminando em `UseCase`, com **um único método público `execute()`**, e dependências injetadas via construtor:

```ts
export class CreateConcertUseCase {
  constructor(private concertRepository: ConcertRepository) {}
  async execute(data: CreateConcertDTO): Promise<void> {
    // regra de negócio (ex.: checar duplicidade) + delegar ao repositório
  }
}
```

- DTOs são schemas Zod colocados em `core/application` (`*.dto.ts`), exportando o schema e o tipo inferido:

```ts
export const createConcertSchema = z.object({
  /* ... */
});
export type CreateConcertDTO = z.infer<typeof createConcertSchema>;
```

- Erros de regra de negócio são lançados como `Error` com mensagens sentinela em UPPER_SNAKE_CASE (ex.: `'CONCERT_ALREADY_EXISTS'`), traduzidas para mensagens amigáveis na camada `app`.

## 6. Camada de infraestrutura (`infra/`)

- Implementações nomeadas `Prisma<Entidade>Repository` / `<Provedor>Service`, implementando a interface de domínio correspondente, com o cliente externo injetado via construtor:

```ts
export class PrismaConcertRepository implements ConcertRepository {
  constructor(private prisma: PrismaClient) {}
  async create(data: CreateConcertInput): Promise<void> {
    /* ... */
  }
  // ...
}
```

- Barrel `index.ts` reexporta as classes (`@/infra/repository`, `@/infra/services`).
- Só implementa a interface de domínio — não conhece Server Actions, hooks ou componentes.

## 7. Camada `app/` (composition root)

- **Server Actions** (`app/actions/*.actions.ts`): arquivos `'use server'` exportando funções assíncronas. Padrão:
  1. Validar entrada com Zod (`schema.safeParse`), extraindo erros com `z.flattenError`.
  2. Instanciar `repository` + `useCase` (ou usar versão memoizada com `cache()`).
  3. Executar em `try/catch`, mapear erros de negócio (`error.message === 'X'`) para mensagens amigáveis.
  4. Retornar objeto discriminado (`{ success, data }` ou `{ success: false, message, errors? }`).
  5. Chamar `revalidatePath` após mutações.

```ts
export async function createConcertAction(data: CreateConcertDTO) {
  const validated = createConcertSchema.safeParse(data);
  if (!validated.success) {
    const { fieldErrors } = z.flattenError(validated.error);
    return { success: false, message: '...', errors: fieldErrors };
  }
  try {
    const repository = new PrismaConcertRepository(prisma);
    const useCase = new CreateConcertUseCase(repository);
    await useCase.execute(validated.data);
    revalidatePath('/', 'layout');
  } catch (error) {
    const _error = error as Error;
    if (_error.message === 'CONCERT_ALREADY_EXISTS') {
      return { success: false, message: 'Concert already exists...' };
    }
    return { success: false, message: 'Failed to create concert...' };
  }
  return { success: true, message: 'Concert created successfully.' };
}
```

- **Route Handlers** (`app/api/*/route.ts`): `export async function POST(...)`, usados quando a própria fronteira é um provedor externo (ex.: endpoint de extração via Vercel AI SDK), retornando `Response.json({ ... }, { status })`.
- **Páginas** (`app/<rota>/page.tsx`): Server Components por padrão; buscam dados instanciando repositório + use case diretamente, envolvem em `<Suspense>` e delegam a renderização a um componente em `presentation/pages/...`. Páginas com muita interatividade delegam de imediato a um componente `*Client.tsx`.

## 8. Camada de apresentação (`presentation/`)

- **Hooks** (`use<Feature>.ts`): mantêm estado de UI e chamam Server Actions — nunca instanciam repositório/use case.
- **`ui-model/`**: enums + mapas `Record<Enum, Component>` para desacoplar controle de fluxo dos componentes de cada etapa (ex. wizard de novo show).
- **`shared/components/`**: primitivos de design system (Button, Input, Card...).
- **`shared/ui-model/shared.model.ts`**: `interface`s de props centralizadas, estendendo atributos nativos do HTML (`interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { ... }`).
- **`shared/lib/`**: único lugar onde a apresentação toca um SDK externo diretamente (ex. upload no Firebase antes de chamar a Server Action).

## 9. Convenções de nomenclatura

| Item                      | Convenção                                                                         | Exemplo                                                             |
| ------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Entidade de domínio       | `<nome>.entity.ts`                                                                | `concert.entity.ts`                                                 |
| Interface de repositório  | `<nome>.repository.ts`                                                            | `concerts.repository.ts`                                            |
| Interface de serviço      | `<nome>.service.ts`                                                               | `ai.service.ts`                                                     |
| Use case (arquivo/classe) | `<verbo-substantivo>.usecase.ts` → `PascalCase` + `UseCase`                       | `create-concert.usecase.ts` → `CreateConcertUseCase`                |
| DTO/schema                | `<nome>.dto.ts`; schema `camelCase` + `Schema`; tipo em PascalCase                | `create-concert.dto.ts` → `createConcertSchema`, `CreateConcertDTO` |
| Implementação de infra    | `Prisma<Entidade>Repository`, `<Provedor>Service`                                 | `PrismaConcertRepository`, `AIApiService`                           |
| Componentes React         | Pasta + arquivo PascalCase                                                        | `Button/Button.tsx`                                                 |
| Hooks                     | `use<Feature>.ts` (camelCase)                                                     | `useConcertSearch.ts`, `useTicketImageExtraction.ts`                |
| Arquivos de teste         | `<assunto>.spec.ts(x)` (não `.test.`)                                             | `create-concert.usecase.spec.ts`                                    |
| Data providers de teste   | `<assunto>.data-provider.ts`, função `<verbo><Assunto>` com parâmetro `overrides` | `concert-summary.data-provider.ts` → `listConcertSummariesResponse` |
| Interfaces                | Sem prefixo `I`                                                                   | `ConcertRepository`, `ButtonProps`                                  |
| Barrels                   | `index.ts` por pasta de domínio/infra                                             | `core/domain/concerts/index.ts`                                     |

## 10. Convenções de código

- **TypeScript strict**: preferir `type` para entidades/DTOs; `interface` para contratos extensíveis (repositórios, serviços, props de componentes).
- **Imports somente via alias `@/`**: imports relativos (`../`) são erro de lint (`no-relative-import-paths`, `allowSameFolder: false` — mesmo imports na mesma pasta devem usar `@/`).
- **Validação**: Zod, sempre nos DTOs de `core/application`; `z.flattenError` para extrair erros de campo nas Server Actions.
- **Tratamento de erro**: use cases lançam `Error` com mensagens sentinela em UPPER_SNAKE_CASE; Server Actions traduzem para respostas amigáveis; Route Handlers retornam `Response.json({ error }, { status })`.
- **Estilo**: classes utilitárias do Tailwind direto no JSX; usar `cn()` (clsx + tailwind-merge) para classes condicionais/mescladas. Sem CSS Modules.
- **Proibido `console.*`** no código-fonte (`no-console: error`); scripts (ex. `e2e/global-setup.ts`) desabilitam a regra localmente quando necessário.
- **Injeção de dependência manual** via construtor; sem container/decorators. Composição feita na camada `app/`, memoizada por requisição com `React.cache()` quando reutilizada.

## 11. Convenções de teste

- **Unitários** (Jest + Testing Library): ficam em `src/tests/<camada>/...` espelhando `src/` (exceto specs de componente, colocados junto ao componente, ex. `Layout.spec.tsx`). Sufixo `.spec.ts`/`.spec.tsx`.
- Estrutura: `describe('<Feature/UseCase>')` → `describe('<método>')` → `it('should ...')`.
- **Mocks** (`src/tests/mocks/`): fakes manuais implementando as interfaces de domínio (ex. `MockConcertRepository implements ConcertRepository`) e `data-providers/*.data-provider.ts` (funções fábrica com parâmetro `overrides` mesclado sobre valores padrão determinísticos — `faker` é usado apenas em `prisma/seed.ts`).
- **Testes de use case**: repositório parcial via helper local (`makeRepository(overrides)`) usando `jest.fn()`; asserts sobre resolução/rejeição de `execute()` e chamadas ao repositório.
- **Testes de repositório**: mockam métodos do Prisma Client (`findMany`, `findFirst`, `create`) com `jest.MockedFunction`, verificando o shape exato da query (ex. intervalo de dia).
- **Testes de Server Action**: mockam `@/lib/prisma` e o módulo do use case (construtor mockado retornando `{ execute: mockedFn }`), testando validação e mapeamento de erros isoladamente.
- `jest.setup.ts` mocka globalmente `revalidatePath` de `next/cache`.
- **E2E** (Playwright, pasta `e2e/`): seletores via `page.getByTestId(...)` (componentes devem expor `data-testid`); banco Postgres real, populado por `global-setup.ts`; um arquivo `.spec.ts` por fluxo de usuário (`create-concert`, `concert-search`, `hero`).

## 12. Configurações relevantes

- `tsconfig.json`: `strict: true`, alias `@/* → ./src/*`, `moduleResolution: bundler`, `target: ES2023`.
- `eslint.config.mjs`: flat config sobre `eslint-config-next`; regras customizadas — `no-relative-import-paths/no-relative-import-paths` (erro), `@typescript-eslint/no-unused-vars` (ignora prefixo `_`), `no-console` (erro).
- `jest.config.ts`: usa `next/jest`, ambiente `jsdom`, alias `@/` mapeado para `src/`, cobertura ignora `src/components/ui`, `src/lib`, `src/generated`; pasta `e2e` excluída dos testes unitários.
- `playwright.config.ts`: `testDir: ./e2e`, `globalSetup` popula o banco, projetos chromium/firefox/webkit, sobe `next dev`/`next start` automaticamente.
- `lefthook.yml`: pre-commit (Prettier + ESLint `--fix` nos arquivos staged), commit-msg (`commitlint`), pre-push (`tsc --noEmit` + `test:coverage`).
- `commitlint.config.cjs`: exige Conventional Commits.
- `prisma.config.ts`: caminho do schema/migrations, comando de seed (`tsx prisma/seed.ts`).

## 13. Modelo de dados (`prisma/schema.prisma`)

Modelo único `ConcertMemory` (tabela `concert_memories`), client gerado em `src/generated/prisma`. Campos usam `@map` para colunas snake_case no banco, mantendo camelCase no TypeScript/Prisma. Agrupados por comentário: dados iniciais de captura (data, artista, local, cidade, URL da imagem do ingresso), campos assistidos por IA do "Organize Memory" (turnê, banda de abertura, música perdida, melhor música ao vivo, descrição, km percorridos), campos de rating (`Int?`) e `experienceTags: String[]`. Campos de auditoria padrão `createdAt`/`updatedAt`.

## 14. Regras explícitas para geração de código por LLM

1. Nunca usar imports relativos (`../`); sempre `@/core/...`, `@/infra/...`, `@/presentation/...`, `@/app/...`.
2. Nunca instanciar `infra` fora de `app/**`.
3. Componentes/hooks de `presentation` nunca chamam repositórios/use cases diretamente — sempre via Server Action.
4. Toda nova regra de negócio deve virar um use case em `core/application` com único método `execute()` e injeção via construtor.
5. Toda nova entidade/interface de contrato pertence a `core/domain`; implementações concretas a `infra`.
6. Novo endpoint de mutação/consulta usado pela UI deve ser uma Server Action com validação Zod + tratamento de erro no padrão `{ success, message, errors? }` / `{ success, data }`.
7. Todo novo teste segue `.spec.ts(x)`, localizado em `src/tests/<camada>/...` (espelhando a origem) e mocka apenas a fronteira imediata da unidade testada.
8. Não usar `console.*` em código de produção.
