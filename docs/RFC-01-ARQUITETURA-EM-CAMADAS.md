# RFC-01: Arquitetura em Camadas com Composição Manual

**Status**: Aceita  
**Data**: 20/09/2026  
**Responsável**: Time concerts-recap

## Terminologia

Para esta RFC, usamos os seguintes termos:

- **Domínio**: tipos e contratos que representam o problema de negócio, sem dependência de frameworks ou provedores externos.
- **Aplicação**: casos de uso que orquestram regras de negócio por meio dos contratos do domínio.
- **Infraestrutura**: implementações concretas para banco de dados e serviços externos.
- **Apresentação**: componentes, hooks e modelos voltados à interface do usuário.
- **Composition root**: ponto de entrada que instancia implementações concretas e as conecta aos casos de uso.
- **Server Action**: fronteira entre a interface e a aplicação para fluxos iniciados pela UI.

## Índice

1. [Contexto e problema](#contexto-e-problema)
2. [Opções avaliadas](#opções-avaliadas)
3. [Decisão](#decisão)
4. [Estrutura adotada](#estrutura-adotada)
5. [Regras de dependência](#regras-de-dependência)
6. [Fluxos de execução](#fluxos-de-execução)
7. [Consequências](#consequências)
8. [Critérios de evolução](#critérios-de-evolução)

## Contexto e problema

O `concerts-recap` combina interface Next.js, persistência PostgreSQL via Prisma, upload de imagens no Firebase e extração de dados de ingressos por IA. Esses elementos possuem ritmos de mudança e responsabilidades distintos.

Sem uma separação explícita, regras de negócio tendem a migrar para componentes React, Server Actions ou repositórios Prisma. Isso acopla a experiência de usuário aos detalhes de persistência e de provedores externos, torna os testes mais caros e dificulta trocar integrações.

Precisamos de uma estrutura que:

- mantenha o domínio independente de Next.js, Prisma, Firebase e SDKs de IA;
- permita testar regras de negócio com dependências controladas;
- preserve a ergonomia do App Router e das Server Actions;
- explicite onde integrações concretas são criadas;
- cresça por contexto de negócio sem introduzir um container de injeção de dependência.

## Opções avaliadas

### Opção A: Organização por tipo técnico

Organizar a aplicação apenas por tipos genéricos de arquivo, como `components/`, `services/`, `repositories/` e `utils/`.

#### Vantagens

- Estrutura inicial simples.
- Convenção familiar para projetos pequenos.

#### Desvantagens

- Um fluxo de negócio fica espalhado por diretórios amplos.
- Regras de negócio podem depender diretamente de detalhes de infraestrutura.
- A origem de cada dependência concreta deixa de ser evidente.

### Opção B: Arquitetura em camadas com composição manual

Separar domínio, aplicação, infraestrutura e apresentação. As implementações concretas são conectadas somente em pontos de entrada de `app/`.

#### Vantagens

- Dependências apontam para contratos estáveis do domínio.
- Casos de uso podem ser testados sem Prisma, Firebase ou IA.
- Server Actions e Route Handlers permanecem finos e tratam validação, resposta e adaptação de erros.
- Não exige container de DI, decorators ou configuração global adicional.

#### Desvantagens

- A criação de dependências é repetida nos pontos de entrada.
- Um fluxo simples atravessa mais arquivos.
- Exige disciplina para não instanciar infraestrutura fora de `app/`.

### Opção C: Acesso direto à infraestrutura pela interface

Permitir que componentes e hooks utilizem Prisma, serviços externos ou casos de uso concretos diretamente.

#### Vantagens

- Menos arquivos para protótipos muito pequenos.

#### Desvantagens

- Viola a separação entre cliente e servidor.
- Mistura estado de UI, regra de negócio e integração externa.
- Reduz a testabilidade e amplia o impacto de alterações em provedores.

## Decisão

Adotamos a **Opção B: arquitetura em camadas com composição manual**.

O domínio define entidades e contratos. A aplicação implementa os casos de uso, recebendo contratos por construtor. A infraestrutura implementa esses contratos. A camada `app/` funciona como composition root e é a única autorizada a instanciar implementações de infraestrutura.

A apresentação chama Server Actions para executar fluxos da aplicação. Ela não acessa repositórios, serviços externos ou casos de uso diretamente.

## Estrutura adotada

```text
src/
├── app/                    # Páginas, Server Actions, Route Handlers e composição
├── core/
│   ├── domain/             # Entidades e contratos puros
│   └── application/        # Casos de uso e DTOs/schemas de entrada
├── infra/
│   ├── repository/         # Implementações Prisma dos contratos de persistência
│   └── services/           # Adaptadores de provedores externos
├── presentation/
│   ├── hooks/              # Estado e fluxos de UI; chamam Server Actions
│   ├── pages/              # Componentes de página por feature
│   ├── shared/             # Componentes e utilitários reutilizáveis
│   └── ui-model/           # Modelos de visualização específicos de feature
├── lib/                    # Utilitários de baixo nível compartilhados
└── generated/prisma/       # Cliente Prisma gerado; não editar manualmente
```

### Domínio

A camada `core/domain` contém tipos simples e interfaces de contrato. Ela não importa código de outras camadas, bibliotecas de framework ou SDKs externos.

Contratos recebem nomes descritivos, como `ConcertRepository` e `AIService`, sem prefixo `I`.

### Aplicação

A camada `core/application` contém um caso de uso por arquivo. Cada caso de uso expõe apenas o método público `execute()` e recebe contratos de domínio pelo construtor.

Schemas Zod e seus tipos inferidos ficam nesta camada como fronteira de validação de dados de entrada. Erros de regra de negócio usam mensagens sentinela em `UPPER_SNAKE_CASE`, traduzidas nas fronteiras da aplicação.

### Infraestrutura

A camada `infra` implementa contratos do domínio. Repositórios recebem o cliente Prisma por construtor; adaptadores de provedores externos recebem os clientes correspondentes. Ela não conhece componentes, hooks ou Server Actions.

### Apresentação

A camada `presentation` reúne componentes, hooks e modelos de UI organizados por feature. Hooks chamam Server Actions e mantêm estado da interface. O único acesso direto da apresentação a um SDK externo é o upload client-side para o Firebase, antes da chamada à Server Action responsável pelo fluxo.

### App como composition root

Páginas, Server Actions e Route Handlers em `app/` constroem repositórios, serviços e casos de uso. Quando a mesma composição é reutilizada em uma requisição, ela pode ser memoizada com `React.cache()`.

## Regras de dependência

```text
app -> presentation -> core/application -> core/domain <- infra
```

As seguintes regras são obrigatórias:

1. `core/domain` não importa outras camadas.
2. `core/application` importa somente `core/domain`.
3. `infra` implementa contratos de `core/domain` e não depende de apresentação ou `app/`.
4. `presentation` não instancia infraestrutura nem casos de uso; seus hooks chamam Server Actions.
5. Apenas `app/` instancia classes de `infra` e as conecta aos casos de uso.
6. Imports internos usam o alias `@/`; imports relativos não são permitidos.

## Fluxos de execução

### Consulta renderizada no servidor

```text
Page (app/) -> Repository/Service (infra/) -> Use case (application) -> Contract (domain)
Page (app/) -> Component (presentation)
```

Uma página Server Component cria a composição necessária, executa o caso de uso e delega a renderização a componentes de `presentation`.

### Mutação iniciada pela interface

```text
Component -> Hook -> Server Action (app/) -> Use case -> Contract <- Infraestrutura
```

A Server Action valida a entrada com Zod, cria a composição, executa o caso de uso, converte erros sentinela em mensagens apropriadas e retorna um resultado discriminado. Após mutações, ela revalida as rotas afetadas.

### Integração exposta a provedor externo

```text
Cliente externo -> Route Handler (app/api/) -> Use case/Service -> Contract <- Infraestrutura
```

Route Handlers são usados quando a fronteira é uma integração externa. Eles retornam `Response.json()` com o status HTTP adequado.

## Consequências

### Benefícios

- Regras de negócio permanecem independentes das escolhas de banco, framework e provedor.
- Testes unitários dos casos de uso usam contratos simulados, sem infraestrutura real.
- Integrações como Prisma, Firebase e IA podem ser substituídas com impacto concentrado em `infra/` e na composição.
- O local de criação de cada dependência fica explícito nos pontos de entrada.
- A organização é compatível com Server Components, Server Actions e Route Handlers do Next.js.

### Custos aceitos

- Um novo fluxo exige arquivos em mais de uma camada quando há regra de negócio e persistência.
- A composição manual pode repetir construções de objetos.
- A equipe precisa manter testes e limites de importação para impedir atalhos entre camadas.

## Critérios de evolução

A arquitetura deve evoluir somente quando houver necessidade concreta. Em especial:

- Extrair um helper de composição quando a mesma criação de dependências for repetida em múltiplos pontos de entrada e isso reduzir complexidade real.
- Introduzir um novo contexto de domínio quando a linguagem de negócio, os contratos e os casos de uso deixarem de ter alta coesão com `concerts` ou `ai`.
- Criar uma interface de domínio antes de adicionar ou substituir uma integração externa usada por um caso de uso.
- Manter novos fluxos seguindo os testes unitários por camada e testes e2e pelo comportamento observável do usuário.

Esta decisão será reavaliada caso a composição manual deixe de ser legível ou passe a gerar duplicação relevante entre múltiplos pontos de entrada.
