# Diretrizes para Identificação de Domínios no Frontend

## Objetivo

Este guia orienta a análise de uma aplicação frontend para identificar **Domains**, **Subdomains**, fronteiras de contexto e pontos de baixa coesão a partir da experiência que ela oferece ao usuário.

A análise deve considerar principalmente:

- jornadas e objetivos do usuário;
- páginas, features, componentes, hooks e UI models;
- vocabulário exibido na interface e usado nos fluxos;
- estados de interação, validação, feedback e transições entre etapas.

> **Importante**: a estrutura técnica do frontend não define, por si só, um Domain. Pastas como `components`, `hooks` e `shared` são mecanismos de implementação. O Domain é definido pela capacidade de negócio que o usuário consegue realizar.

## Fundamentos de DDD aplicados ao frontend

### Domain e Subdomain

- **Domain**: a área de negócio atendida pela experiência do produto.
- **Subdomain**: uma capacidade de negócio menor, percebida pelo usuário como parte de uma jornada ou fluxo.
  - **Core Domain**: capacidade que diferencia o produto e entrega seu principal valor.
  - **Supporting Subdomain**: capacidade específica do produto que viabiliza o Core Domain, sem ser seu diferencial principal.
  - **Generic Subdomain**: capacidade comum, reutilizável e pouco específica do negócio.

No frontend, um Subdomain pode aparecer como uma página, um fluxo em etapas, uma área de uma página ou uma feature composta por componentes e hooks. Esses artefatos são evidências, não a definição do Subdomain.

### Bounded Context

Um **Bounded Context** é uma fronteira linguística e de interação na qual os termos, estados e regras de uma feature possuem significado inequívoco.

No frontend, um contexto geralmente fica evidente quando há:

- uma jornada de usuário com início, objetivo e conclusão próprios;
- vocabulário de interface específico;
- estados e validações que não fazem sentido em outra feature;
- um conjunto coeso de componentes, hooks e UI models;
- uma transição explícita para outro fluxo ou página.

> O mesmo termo pode ter representações diferentes em contextos distintos. Uma memória de show exibida em uma lista de busca pode ter apenas dados resumidos; no fluxo de organização, a mesma memória inclui campos editáveis e decisões sobre a experiência. Não presuma que ambas as interfaces usam o mesmo modelo de interação.

### Espaço do problema e espaço da solução

- **Espaço do problema**: necessidades de usuário e capacidades de negócio, como registrar uma memória de show, encontrá-la ou enriquecê-la.
- **Espaço da solução**: as telas, componentes, hooks, Server Actions e serviços que realizam essas capacidades.

Use os fluxos e os termos apresentados ao usuário para encontrar o problema. Use arquivos e dependências apenas para verificar se a implementação preserva ou mistura essas fronteiras.

## Processo de identificação

### 1. Mapear jornadas do usuário

Comece por rotas, páginas e componentes de feature. Para cada jornada, responda:

1. Qual objetivo o usuário quer alcançar?
2. Qual evento inicia o fluxo?
3. Quais informações o usuário fornece, consulta ou edita?
4. Quais etapas, estados de carregamento, erros e confirmações existem?
5. Qual resultado encerra a jornada?

Procure, por exemplo:

- páginas em `app/` e componentes em `presentation/pages/`;
- fluxos guiados por `ui-model/` ou por estados de etapa;
- hooks `use<Feature>` que coordenam interação e feedback;
- formulários, busca, upload, filtros, listas e detalhes;
- Server Actions chamadas pela UI como fronteiras externas da feature.

Não trate uma Server Action, um endpoint ou um componente isolado como um Domain. Eles podem participar de uma jornada, mas não descrevem sozinhos a capacidade de negócio.

### 2. Extrair a linguagem da interface

Para cada jornada, identifique os termos de negócio presentes em:

- títulos, labels, descrições e mensagens de validação;
- nomes de campos, props e view models;
- nomes de páginas, componentes de feature e hooks;
- estados que orientam o usuário, como rascunho, envio, análise, resultado e erro.

Agrupe termos que aparecem juntos e que respondem ao mesmo objetivo de usuário. Por exemplo:

- `show`, `artista`, `local`, `cidade` e `ingresso` indicam a captura de uma memória de show;
- `busca`, `termo`, `resultado` e `resumo` indicam a descoberta de memórias registradas;
- `turnê`, `banda de abertura`, `melhor música` e `avaliação` indicam o enriquecimento da memória.

### 3. Delimitar contextos de interação

Um conjunto de telas ou componentes pertence ao mesmo contexto quando compartilha:

- o mesmo objetivo de usuário;
- termos de negócio e regras de validação compatíveis;
- dados necessários para completar a jornada;
- transições de estado relacionadas;
- uma conclusão compreensível para o usuário.

Considere contextos separados quando:

- o mesmo termo muda de significado ou nível de detalhe;
- a interface exige outra linguagem e outros critérios de sucesso;
- os estados e erros de uma feature não são relevantes para a outra;
- a alteração de uma jornada não deveria exigir alterar a outra.

### 4. Classificar Domains e Subdomains

Classifique cada capacidade a partir de seu valor para o produto, não pelo tipo de componente usado para implementá-la.

| Tipo                     | Sinais no frontend                                                                                                          |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **Core Domain**          | É a jornada principal, concentra o vocabulário que diferencia o produto e representa a entrega de valor que motiva o uso.   |
| **Supporting Subdomain** | Viabiliza ou completa a jornada principal e possui regras específicas do produto, mas não é o motivo principal para usá-lo. |
| **Generic Subdomain**    | É comum a muitas aplicações, tem linguagem neutra e pode ser oferecido por componentes ou serviços compartilhados.          |

Para o concerts-recap, uma análise inicial pode considerar:

| Capacidade                                   | Classificação provável | Evidências de interface                                                                    |
| -------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| Registrar e organizar memórias de shows      | Core Domain            | Fluxo de novo show, campos da memória, organização da experiência e feedback de conclusão. |
| Capturar dados iniciais a partir do ingresso | Supporting Subdomain   | Upload, extração, revisão e preenchimento inicial dos dados.                               |
| Encontrar memórias registradas               | Supporting Subdomain   | Busca por artista, local ou cidade e lista de resumos.                                     |
| Componentes visuais, toast e loading         | Generic Subdomain      | Elementos reutilizáveis sem vocabulário de memória de show.                                |

Essa classificação é uma hipótese a ser validada com quem conhece o produto. Não converta pastas de código diretamente em Domains.

## Coesão no frontend

Coesão mede quanto os elementos de uma feature contribuem para a mesma jornada e usam a mesma linguagem de negócio.

### Indicadores de alta coesão

- Componentes, hooks e UI models atendem ao mesmo objetivo de usuário.
- Campos, mensagens e ações usam vocabulário consistente.
- Estados da interface representam etapas naturais da mesma jornada.
- Alterações de regra de negócio ficam concentradas na mesma feature.
- Testes de componente e e2e descrevem o mesmo fluxo de forma compreensível.

### Indicadores de baixa coesão

- Uma página reúne jornadas não relacionadas apenas para compartilhar layout.
- Um hook controla estados de features com vocabulários diferentes.
- Um componente de feature contém regras e feedbacks de outro contexto.
- Os mesmos termos mudam de significado sem uma transição clara.
- A mudança em uma jornada exige alterar componentes de uma capacidade sem relação.

### Métricas de coesão

Avalie cada dimensão de 0 a 2,5:

1. **Coesão linguística**: os textos e nomes da feature usam o mesmo vocabulário de negócio?
2. **Coesão de jornada**: os elementos colaboram para um único objetivo de usuário?
3. **Coesão de estado**: carregamento, erro, validação e sucesso pertencem ao mesmo fluxo?
4. **Coesão de mudança**: os arquivos da feature evoluem juntos sem impactar áreas não relacionadas?

```
Pontuação de coesão = (
  Coesão linguística +
  Coesão de jornada +
  Coesão de estado +
  Coesão de mudança
) / 10

8-10: Alta coesão ✅
5-7: Coesão média ⚠️
0-4: Baixa coesão ❌
```

## Regras para detectar fronteiras inadequadas

### 1. Vocabulários misturados na mesma feature

**Problema**: uma página, componente ou hook mistura termos de jornadas diferentes.

- A busca por memórias também controla o preenchimento do formulário de novo show.
- Um componente de organização apresenta regras de upload de ingresso sem fazer parte daquela etapa.
- O mesmo estado de `loading` representa operações não relacionadas.

**Ação**: separar a coordenação de estado e os componentes por jornada, mantendo apenas componentes visuais genéricos compartilhados.

### 2. Componentes compartilhados com regra de negócio

**Problema**: um componente em `presentation/shared/` incorpora vocabulário, validação ou decisão de uma feature específica.

- Um `Input` conhece campos de memória de show.
- Um `Card` decide se um show pode ser organizado.
- Um botão compartilhado dispara uma ação específica de cadastro.

**Ação**: mantenha o componente compartilhado neutro; deixe as regras no componente ou hook da feature.

### 3. Hook com responsabilidades de várias jornadas

**Problema**: um hook coordena estados de interação que não possuem o mesmo objetivo de usuário.

- Um hook controla busca, upload e edição detalhada.
- Validações de um formulário alteram o estado de uma lista independente.
- Um único erro genérico representa falhas de operações distintas.

**Ação**: dividir o hook por fluxo e compor apenas quando houver uma transição real entre etapas.

### 4. Fronteira visual usada como fronteira de Domain

**Problema**: a separação é feita somente porque os elementos ocupam áreas diferentes da tela ou usam componentes distintos.

- Um menu, cabeçalho ou modal é tratado como Domain.
- O mesmo fluxo é dividido em contextos sem mudança de objetivo ou linguagem.
- Uma rota é classificada como Domain apenas por existir.

**Ação**: usar objetivo, vocabulário e estados da jornada como evidência principal; a composição visual é evidência secundária.

### 5. Transições de fluxo implícitas

**Problema**: o usuário muda de contexto sem receber indicação de que agora está em outra capacidade.

- Termos e campos mudam de significado na mesma tela.
- Uma ação inicia outro fluxo sem feedback ou título contextual.
- Estados de erro não deixam claro a qual etapa pertencem.

**Ação**: tornar a transição explícita na interface, nos UI models e nos testes de fluxo.

## Mapa de contexto orientado ao frontend

Use um mapa de capacidades e interações, em vez de um mapa de entidades e serviços:

```
Domain: Memórias de shows
├── Subdomain: Captura inicial (Supporting)
│   ├── Objetivo: registrar os dados mínimos de um show
│   ├── Interface: upload de ingresso, formulário inicial e feedback
│   ├── Estados: ocioso, enviando, extraindo, pronto, erro
│   └── Dependências: → Extração de dados do ingresso
│
├── Subdomain: Organização da memória (Core)
│   ├── Objetivo: enriquecer a recordação da experiência
│   ├── Interface: formulário de detalhes, avaliações e tags
│   ├── Estados: edição, validação, salvamento, concluído, erro
│   └── Dependências: ← Captura inicial
│
└── Subdomain: Busca de memórias (Supporting)
    ├── Objetivo: encontrar shows registrados
    ├── Interface: campo de busca e lista de resumos
    ├── Estados: consulta vazia, buscando, resultados, sem resultados, erro
    └── Dependências: → Dados de memórias registradas
```

## Checklists de análise

### Para cada jornada

- [ ] Qual objetivo de usuário ela atende?
- [ ] Qual vocabulário de negócio é visível na interface?
- [ ] Quais dados o usuário visualiza, informa ou altera?
- [ ] Quais estados de carregamento, validação, erro e sucesso pertencem ao fluxo?
- [ ] Qual evento inicia e qual resultado conclui a jornada?
- [ ] A jornada depende de outra ou apenas compartilha componentes genéricos?

### Para cada feature

- [ ] Componentes, hooks e UI models pertencem ao mesmo objetivo?
- [ ] Os textos, props e estados usam a mesma Ubiquitous Language?
- [ ] Há regras de negócio em componentes compartilhados?
- [ ] Há transições claras para outros contextos?
- [ ] A feature pode evoluir sem alterar jornadas não relacionadas?

### Para a coesão

- [ ] Calcule a pontuação por linguagem, jornada, estado e mudança.
- [ ] Identifique estados ou mensagens que misturam contextos.
- [ ] Verifique se hooks e componentes compartilhados permanecem neutros.
- [ ] Use testes de interface e e2e para confirmar o limite de cada jornada.

## Formato de saída

```markdown
## Domain: {nome da capacidade de negócio}

**Classificação**: Core Domain | Supporting Subdomain | Generic Subdomain

**Objetivo do usuário**: {resultado que a pessoa busca}

**Ubiquitous Language**: {termos visíveis e termos de código relacionados}

**Jornada**:

1. {evento de entrada}
2. {etapas de interação}
3. {resultado ou saída}

**Artefatos de frontend**:

- Páginas e rotas: {lista}
- Componentes de feature: {lista}
- Hooks e UI models: {lista}
- Estados de interface: {lista}

**Dependências de contexto**:

- → {outro contexto} ({tipo de transição ou dado})
- ← {outro contexto} ({tipo de transição ou dado})

**Coesão**: {pontuação}/10

**Problemas identificados**:

- ❌ {descrição}
- ⚠️ {aviso}
```

```markdown
## Matriz de coesão entre jornadas

| Jornada A          | Jornada B                  | Coesão | Relação                                              |
| ------------------ | -------------------------- | ------ | ---------------------------------------------------- |
| Captura inicial    | Organização da memória     | 8/10   | Transição explícita da mesma capacidade              |
| Busca de memórias  | Organização da memória     | 5/10   | Compartilham a memória, mas têm objetivos diferentes |
| Upload de ingresso | Componentes compartilhados | 2/10   | Deve compartilhar apenas elementos visuais neutros   |
```

## Técnicas e artefatos

### Técnicas de análise

1. **Análise de jornadas**: siga o caminho do usuário entre páginas, ações e resultados.
2. **Análise de vocabulário**: compare textos de UI, nomes de campos, componentes de feature e estados.
3. **Análise de estado**: identifique quem cria, consome e encerra cada estado de interação.
4. **Análise de dependências**: examine imports entre features, hooks e UI models para localizar acoplamento indevido.
5. **Análise de testes**: use testes de componente e e2e para confirmar limites de jornada e transições.
6. **Análise de mudanças**: use o histórico Git, quando disponível, para descobrir quais features evoluem juntas.

### Artefatos de saída

1. **Mapa de jornadas**: capacidades, etapas e resultados para o usuário.
2. **Mapa de contexto de interface**: vocabulário, estados e fronteiras de cada feature.
3. **Matriz de coesão**: pontuação entre jornadas e features.
4. **Relatório de baixa coesão**: mistura de vocabulário, estado e responsabilidades de interface.
5. **Dicionário da Ubiquitous Language**: termos de negócio apresentados em cada contexto.

## Critérios de validação

Uma identificação de Domains em frontend é adequada quando:

- ✅ cada contexto descreve uma capacidade compreensível para o usuário;
- ✅ a Ubiquitous Language é consistente em textos, estados e componentes da feature;
- ✅ páginas e rotas não são confundidas automaticamente com Domains;
- ✅ componentes compartilhados permanecem neutros em relação às regras de negócio;
- ✅ estados de carregamento, erro e sucesso pertencem a uma jornada identificável;
- ✅ dependências entre jornadas são explícitas e preservam a autonomia das features.

## Princípios finais

1. Comece pelo objetivo do usuário, não pela árvore de arquivos.
2. Agrupe componentes, hooks e UI models pela jornada que eles viabilizam.
3. Use a linguagem apresentada na interface para descobrir fronteiras de contexto.
4. Compartilhe primitivos visuais, mas não estados ou regras de negócio sem uma necessidade explícita.
5. Valide fronteiras com fluxos e2e, acessibilidade, estados de erro e feedback de sucesso.
6. Trate a estrutura de código como evidência para ajustar contextos, nunca como a única fonte de verdade.
