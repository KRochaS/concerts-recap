# Exemplo de Identificação de Domínios

Este documento mostra como aplicar as [Diretrizes de Identificação de Domínios](./DOMAIN-IDENTIFICATION-GUIDELINES.md) a uma aplicação frontend. A análise parte da linguagem do produto, dos fluxos de interface e dos módulos que sustentam esses fluxos.

## Exemplo: aplicação de descoberta de shows

A aplicação permite pesquisar shows, consultar detalhes, montar uma agenda e salvar apresentações favoritas. O código está inicialmente organizado por tipo técnico, com componentes, hooks e clientes HTTP em pastas genéricas.

### Etapa 1: extrair conceitos

**Entidades e modelos encontrados:**

- `Show`, `Artista`, `Local`, `Cidade`, `DataDoShow`, `GeneroMusical`
- `BuscaDeShows`, `FiltroDeBusca`, `ResultadoDaBusca`, `Ordenacao`
- `Agenda`, `ItemDaAgenda`, `Favorito`, `Usuario`
- `EstadoDeCarregamento`, `ErroDeFormulario`, `Paginacao`

**Componentes encontrados:**

- `FormularioDeBusca`, `CampoDeBusca`, `PainelDeFiltros`, `ListaDeResultados`
- `CardDeShow`, `DetalheDoShow`, `CabecalhoDaAgenda`, `ItemDaAgenda`
- `BotaoFavorito`, `ListaDeFavoritos`, `MensagemVazia`, `OverlayDeCarregamento`

**Hooks encontrados:**

- `useBuscaDeShows`, `useFiltrosDeBusca`, `usePaginacao`
- `useAgenda`, `useFavoritos`, `useAutenticacao`
- `useToast`, `useEstadoDeEnvio`

**Integrações encontradas:**

- `ShowsApiClient`, `AgendaApiClient`, `FavoritosApiClient`, `AuthApiClient`
- `AnalyticsService`, `ImageUploadService`

### Etapa 2: agrupar por linguagem ubíqua

#### Grupo 1: descoberta de shows

**Termos:** busca, filtro, resultado, ordenação, página, artista, cidade, período.

**Conceitos:**

- Modelos: `BuscaDeShows`, `FiltroDeBusca`, `ResultadoDaBusca`, `Ordenacao`
- Componentes: `FormularioDeBusca`, `CampoDeBusca`, `PainelDeFiltros`, `ListaDeResultados`
- Hooks: `useBuscaDeShows`, `useFiltrosDeBusca`, `usePaginacao`
- Integração: `ShowsApiClient`

**Análise:** ✅ alta coesão linguística. Os conceitos existem para ajudar a pessoa usuária a localizar shows relevantes.

#### Grupo 2: agenda

**Termos:** agenda, adicionar, remover, lembrete, data, item, planejamento.

**Conceitos:**

- Modelos: `Agenda`, `ItemDaAgenda`
- Componentes: `CabecalhoDaAgenda`, `ItemDaAgenda`, `MensagemVazia`
- Hooks: `useAgenda`, `useEstadoDeEnvio`
- Integração: `AgendaApiClient`

**Análise:** ✅ alta coesão linguística. O grupo trata da organização dos shows que a pessoa pretende acompanhar.

#### Grupo 3: favoritos

**Termos:** favorito, salvar, remover dos salvos, coleção, preferência.

**Conceitos:**

- Modelos: `Favorito`, `Usuario`
- Componentes: `BotaoFavorito`, `ListaDeFavoritos`
- Hooks: `useFavoritos`
- Integração: `FavoritosApiClient`

**Análise:** ✅ alta coesão linguística. A funcionalidade representa uma escolha persistente da pessoa usuária, não apenas um detalhe visual do card.

#### Grupo 4: identidade e sessão

**Termos:** entrar, sair, sessão, conta, acesso, pessoa usuária.

**Conceitos:**

- Modelo: `Usuario`
- Hook: `useAutenticacao`
- Integração: `AuthApiClient`

**Análise:** ✅ coesão alta, mas é um subdomínio genérico. Ele fornece contexto para outros domínios sem assumir suas regras.

### Etapa 3: identificar domínios

#### Domínio 1: descoberta de shows

**Tipo:** 🎯 domínio central

**Linguagem ubíqua:** busca, filtro, resultado, artista, local, cidade, data, ordenação e paginação.

**Conceitos principais:**

- Consulta: `BuscaDeShows`, `FiltroDeBusca`, `useBuscaDeShows`
- Refinamento: `PainelDeFiltros`, `useFiltrosDeBusca`, `Ordenacao`
- Apresentação: `ListaDeResultados`, `CardDeShow`, `Paginacao`

**Subdomínios:**

1. **Pesquisa de shows** (central)
   - Conceitos: `FormularioDeBusca`, `BuscaDeShows`, `ResultadoDaBusca`
   - Coesão: alta (9/10)
2. **Filtragem e ordenação** (de apoio)
   - Conceitos: `PainelDeFiltros`, `FiltroDeBusca`, `Ordenacao`
   - Coesão: alta (8/10)
   - Dependência: pesquisa de shows
3. **Navegação de resultados** (de apoio)
   - Conceitos: `ListaDeResultados`, `Paginacao`, `CardDeShow`
   - Coesão: média (7/10)
   - Dependência: pesquisa de shows

**Dependências:**

- recebe o contexto de identidade para personalizar ações disponíveis;
- fornece referências de `Show` para agenda e favoritos por contratos de visualização;
- consulta a API de shows por uma porta específica do domínio.

**Pontuação de coesão:** 8/10 (✅ alta)

#### Domínio 2: agenda

**Tipo:** domínio de apoio

**Linguagem ubíqua:** agenda, adicionar, remover, item, planejamento e lembrete.

**Conceitos principais:**

- Gestão: `Agenda`, `ItemDaAgenda`, `useAgenda`
- Interação: `CabecalhoDaAgenda`, `ItemDaAgenda`, `MensagemVazia`
- Persistência: `AgendaApiClient`

**Subdomínios:**

1. **Gestão de itens da agenda** (de apoio) - 9/10
2. **Visualização da agenda** (de apoio) - 8/10

**Dependências:**

- recebe o identificador do show, sem importar o estado interno da busca;
- depende da identidade para recuperar a agenda da pessoa autenticada.

**Pontuação de coesão:** 8/10 (✅ alta)

#### Domínio 3: favoritos

**Tipo:** subdomínio de apoio

**Linguagem ubíqua:** favorito, salvar, remover, coleção e preferência.

**Conceitos principais:**

- Gestão: `Favorito`, `useFavoritos`, `FavoritosApiClient`
- Interação: `BotaoFavorito`, `ListaDeFavoritos`

**Dependências:**

- recebe `showId` e não manipula filtros ou paginação da busca;
- depende da identidade para associar a preferência à pessoa autenticada.

**Pontuação de coesão:** 9/10 (✅ alta)

#### Domínio 4: identidade e sessão

**Tipo:** subdomínio genérico

**Linguagem ubíqua:** conta, entrar, sair, sessão, acesso e pessoa usuária.

**Conceitos principais:**

- Sessão: `Usuario`, `useAutenticacao`, `AuthApiClient`
- Controle de acesso: guardas de rota e estado de sessão

**Pontuação de coesão:** 9/10 (✅ alta)

### Etapa 4: analisar a coesão

#### Coesão interna

| Domínio             | Pontuação | Situação |
| ------------------- | --------- | -------- |
| Descoberta de shows | 8/10      | ✅ Alta  |
| Agenda              | 8/10      | ✅ Alta  |
| Favoritos           | 9/10      | ✅ Alta  |
| Identidade e sessão | 9/10      | ✅ Alta  |

#### Coesão entre domínios

| Domínio A  | Domínio B  | Coesão | Relação                          | Problema?                  |
| ---------- | ---------- | ------ | -------------------------------- | -------------------------- |
| Descoberta | Agenda     | 6/10   | Agenda recebe `showId`           | ✅ Adequada                |
| Descoberta | Favoritos  | 6/10   | Favorito recebe `showId`         | ✅ Adequada                |
| Agenda     | Identidade | 3/10   | Recupera agenda por sessão       | ⚠️ Usar contrato de sessão |
| Descoberta | Identidade | 2/10   | Card consulta sessão diretamente | ❌ Acoplamento indevido    |

### Etapa 5: problemas de baixa coesão

#### ❌ Problema 1: componente de busca acoplado à sessão

**Localização:** `CardDeShow`

```tsx
const usuario = useAutenticacao();
const podeAdicionar = usuario?.permissoes.includes('agenda:editar');
```

**Problema:**

- o componente de descoberta conhece detalhes da autorização;
- a regra de acesso fica duplicada em outros cards e telas;
- testes de `CardDeShow` passam a depender de um provedor de autenticação que não é necessário para apresentar o show.

**Coesão:** 2/10 (❌ muito baixa)

**Correção sugerida:**

- resolver permissões no limite da rota ou no hook que compõe a tela;
- passar uma prop semântica, como `podeAdicionarNaAgenda`, ao componente;
- manter `CardDeShow` focado em apresentar dados e emitir intenções de interação.

#### ❌ Problema 2: favoritos misturados ao estado de filtros

**Localização:** `useBuscaDeShows`

**Problema:**

- o hook armazena filtros, paginação e a mutação de favoritar;
- uma falha ao salvar favorito altera o estado de erro da busca;
- a funcionalidade não pode ser reutilizada na tela de detalhes do show.

**Coesão:** 3/10 (❌ baixa)

**Correção sugerida:**

- manter `useBuscaDeShows` responsável apenas pela consulta e paginação;
- mover a mutação para `useFavoritos`;
- atualizar o estado visual por um contrato compartilhado, evento local ou invalidação da consulta, conforme o padrão adotado pela aplicação.

#### ⚠️ Problema 3: feedback assíncrono fora do fluxo que o iniciou

**Localização:** `AgendaPage`

**Problema:**

- a página controla o carregamento de todas as ações de agenda e favoritos;
- o botão que iniciou a ação não recebe estado `disabled` nem feedback próximo;
- operações simultâneas podem bloquear a interface inteira sem necessidade.

**Coesão:** 5/10 (⚠️ média)

**Correção sugerida:**

- encapsular o estado da mutação no hook do domínio correspondente;
- expor estados por item quando a ação for individual;
- apresentar feedback de sucesso ou erro no fluxo de interação, seguindo os padrões de acessibilidade da aplicação.

### Etapa 6: mapa de coesão

```text
┌───────────────────────────┐
│ IDENTIDADE E SESSÃO       │ Coesão: 9/10
│ (Genérico)                │
│ - Usuário                 │
│ - Sessão                  │
└─────────────┬─────────────┘
              │ contrato de sessão
              ▼
┌───────────────────────────┐       showId       ┌───────────────────────────┐
│ DESCOBERTA DE SHOWS       │───────────────────►│ AGENDA                    │
│ (Central)                 │                    │ (Apoio)                   │
│ - Busca                   │                    │ - Itens da agenda         │
│ - Filtros                 │                    └───────────────────────────┘
│ - Resultados              │
└─────────────┬─────────────┘       showId       ┌───────────────────────────┐
              └─────────────────────────────────►│ FAVORITOS                 │
                                                  │ (Apoio)                   │
                                                  └───────────────────────────┘
```

### Etapa 7: recomendações

#### ❌ Alta prioridade

1. **Remover dependências diretas de sessão dos componentes de descoberta**
   - Resolver autorização no nível de página, rota ou hook de composição.
   - Passar permissões como props semânticas.
   - Evitar acoplar componentes de apresentação a provedores globais.

2. **Separar busca e favoritos**
   - Manter consulta, filtros e paginação em `useBuscaDeShows`.
   - Manter mutações e estado de favoritos em `useFavoritos`.
   - Reutilizar a funcionalidade de favoritos em listas e detalhes.

#### ⚠️ Média prioridade

3. **Definir contratos entre contextos de frontend**
   - Preferir tipos de entrada e view models explícitos, como `showId` e `ShowResumo`.
   - Não compartilhar o estado interno de hooks entre domínios.
   - Centralizar chamadas HTTP em clientes ou Server Actions adequados à arquitetura da aplicação.

4. **Padronizar feedback de mutações**
   - O controle que inicia uma ação deve refletir carregamento e indisponibilidade.
   - Erros devem ser específicos, acessíveis e próximos ao contexto da ação.
   - Não usar um estado global de carregamento para operações independentes.

#### ✅ Baixa prioridade

5. **Documentar a linguagem ubíqua da interface**
   - Criar um glossário de termos por domínio.
   - Usar os mesmos termos em componentes, hooks, testes e textos de interface.
   - Revisar nomes genéricos como `DataManager` ou `CommonState` quando esconderem uma responsabilidade de negócio.

### Etapa 8: mapa final de domínios

```markdown
## Domínio: descoberta de shows

**Tipo:** 🎯 domínio central
**Coesão:** 8/10 (✅ alta)
**Linguagem ubíqua:** busca, filtro, resultado, artista, local, cidade, ordenação

**Subdomínios:**

1. Pesquisa de shows (central) - 9/10
2. Filtragem e ordenação (de apoio) - 8/10
3. Navegação de resultados (de apoio) - 7/10

**Dependências:**

- Identidade e sessão para ações personalizadas.
- Agenda e favoritos recebem referências de shows por contrato.

---

## Domínio: agenda

**Tipo:** subdomínio de apoio
**Coesão:** 8/10 (✅ alta)
**Linguagem ubíqua:** agenda, item, adicionar, remover, planejamento

**Subdomínios:**

1. Gestão de itens da agenda (de apoio) - 9/10
2. Visualização da agenda (de apoio) - 8/10

---

## Domínio: favoritos

**Tipo:** subdomínio de apoio
**Coesão:** 9/10 (✅ alta)
**Linguagem ubíqua:** favorito, salvar, remover, coleção, preferência

---

## Domínio: identidade e sessão

**Tipo:** subdomínio genérico
**Coesão:** 9/10 (✅ alta)
**Linguagem ubíqua:** conta, entrar, sair, sessão, acesso
```

## Resumo

**Domínios identificados:** 4

- Descoberta de shows (central)
- Agenda (de apoio)
- Favoritos (de apoio)
- Identidade e sessão (genérico)

**Principais sinais de limite de domínio no frontend:**

- vocabulário próprio em componentes, hooks e estados de tela;
- fluxos de usuário que podem evoluir independentemente;
- contratos explícitos entre domínios, em vez de acesso ao estado interno de outro hook;
- responsabilidade local por carregamento, erros e feedback de cada interação.

**Avaliação geral:** os domínios têm boa coesão interna quando a interface mantém os fluxos de descoberta, agenda, favoritos e sessão separados. As integrações devem ocorrer por props, view models, Server Actions ou contratos de API, e não por imports diretos de estados ou serviços internos de outro contexto.
