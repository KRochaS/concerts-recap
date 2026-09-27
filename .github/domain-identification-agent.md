---
description: 'Use quando for preciso identificar domínios, subdomínios, jornadas de usuário, fronteiras de contexto ou problemas de coesão em uma aplicação frontend baseada em DDD.'
globs: []
alwaysApply: false
---

# Agente de Identificação de Domínios no Frontend

## Quando ativar este agente

Use este agente quando a solicitação envolver:

- identificar ou mapear Domains e Subdomains;
- analisar jornadas de usuário, features ou fronteiras de contexto;
- encontrar baixa coesão entre páginas, componentes, hooks ou UI models;
- avaliar Bounded Contexts, Ubiquitous Language ou Design Estratégico em DDD;
- investigar se fluxos de interface misturam responsabilidades de negócio;
- preparar uma análise de domínios antes de refatorar features.

## Ativação e fontes de referência

Ao receber uma solicitação de identificação de Domain, Subdomain ou coesão, siga esta ordem:

1. Carregue `docs/DOMAIN-IDENTIFICATION-GUIDELINES.md` com `read_file`.
2. Carregue `docs/DDD-STRATEGIC-DESIGN-THEORY.md` para fundamentação teórica, quando a análise exigir classificação ou fronteiras estratégicas.
3. Leia `docs/ARCHITECTURE-GUIDELINES.md` para entender a organização de `app/`, `presentation/`, hooks e UI models.
4. Leia `docs/USABILITY-GUIDELINES.md` quando a análise envolver interação, estados, feedback, formulários ou acessibilidade.
5. Use as diretrizes de identificação de domínios como fonte de verdade para o processo e para o formato de saída.
6. Leia `docs/DOMAIN-IDENTIFICATION-EXAMPLE.md`para gerar a analise seguindo o exemplo.
7. **Após implementar qualquer correção motivada por esta análise, atualize obrigatoriamente o documento de análise antes de concluir a tarefa.** Remova os problemas efetivamente corrigidos ou marque-os como resolvidos, descrevendo de forma objetiva a correção aplicada. Reavalie as pontuações de coesão, a matriz e o resumo para que reflitam o estado atual do código. Não apresente como pendente um problema que já foi corrigido.

## Princípios de análise

1. **Comece pelo usuário**: identifique o objetivo, a entrada, as etapas e o resultado de cada jornada antes de examinar a estrutura de arquivos.
2. **Use a linguagem da interface**: títulos, labels, campos, mensagens, nomes de feature, hooks e UI models são evidências da Ubiquitous Language.
3. **Não confunda artefatos técnicos com Domains**: uma rota, um componente, uma Server Action ou um hook isolado não define um contexto de negócio.
4. **Agrupe por capacidade de negócio**: componentes, hooks e estados pertencem ao mesmo contexto quando contribuem para o mesmo objetivo de usuário.
5. **Separe primitivos de regras de negócio**: componentes compartilhados devem permanecer neutros; regras, validações e estados específicos pertencem à feature.
6. **Trate a implementação como evidência**: imports, dependências e histórico de mudanças ajudam a validar fronteiras, mas não as definem sozinhos.

## Processo de identificação

### Etapa 1: Mapear jornadas e features

Comece por rotas, páginas e componentes de feature. Para cada jornada, identifique:

- objetivo do usuário;
- evento que inicia o fluxo;
- informações visualizadas, informadas ou editadas;
- etapas de interação e transições;
- estados de carregamento, validação, erro e sucesso;
- resultado que conclui ou interrompe a jornada.

Procure principalmente por:

- páginas em `app/`;
- componentes em `presentation/pages/`;
- hooks `use<Feature>` em `presentation/hooks/`;
- UI models e estados de etapa em `presentation/ui-model/`;
- formulários, busca, upload, filtros, listas, detalhes e feedbacks visuais;
- Server Actions chamadas pela interface como fronteiras externas da feature.

### Etapa 2: Extrair a Ubiquitous Language

Para cada jornada, extraia os termos de negócio encontrados em:

- títulos, labels, descrições, botões e mensagens;
- nomes de campos, props, tipos e view models;
- nomes de páginas, componentes de feature e hooks;
- estados de interface, como rascunho, envio, análise, resultado e erro.

Agrupe conceitos que compartilham vocabulário e contribuem para o mesmo objetivo. Separe-os quando o mesmo termo muda de significado, nível de detalhe, regra ou critério de sucesso.

### Etapa 3: Delimitar Bounded Contexts

Considere que telas, componentes e hooks pertencem ao mesmo Bounded Context quando compartilham:

- objetivo de usuário;
- linguagem de negócio;
- regras de validação;
- dados necessários para completar a jornada;
- estados e transições relacionados;
- resultado compreensível para o usuário.

Considere contextos separados quando houver:

- mudança de objetivo ou de vocabulário;
- estados e erros que não são relevantes para a outra feature;
- mesma informação representada com significado ou granularidade diferente;
- necessidade de alterar uma jornada sem impactar a outra.

### Etapa 4: Identificar e classificar Domains

Classifique cada capacidade segundo o valor que entrega ao produto:

| Tipo                     | Sinais no frontend                                                                           |
| ------------------------ | -------------------------------------------------------------------------------------------- |
| **Core Domain**          | Jornada principal, vocabulário que diferencia o produto e entrega de valor que motiva o uso. |
| **Supporting Subdomain** | Capacidade específica do produto que viabiliza ou completa a jornada central.                |
| **Generic Subdomain**    | Capacidade comum e reutilizável, com linguagem neutra e sem regra exclusiva do negócio.      |

Para o concerts-recap, trate como hipótese inicial:

- **Core Domain**: registrar e organizar memórias de shows.
- **Supporting Subdomains**: capturar dados do ingresso e encontrar memórias registradas.
- **Generic Subdomains**: componentes visuais, toast, loading e demais primitivos neutros.

Valide essa classificação pelo valor de negócio, pela experiência do usuário e pela linguagem do produto. Não a derive da organização de pastas.

### Etapa 5: Medir coesão

Avalie cada contexto ou feature em quatro dimensões, de 0 a 2,5:

1. **Coesão linguística**: textos, nomes e termos pertencem ao mesmo vocabulário de negócio?
2. **Coesão de jornada**: os elementos colaboram para um único objetivo de usuário?
3. **Coesão de estado**: loading, validação, erro e sucesso fazem parte do mesmo fluxo?
4. **Coesão de mudança**: a feature evolui sem afetar jornadas não relacionadas?

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

Quando houver histórico Git disponível, use-o apenas para complementar a coesão de mudança. A ausência de histórico não reduz a pontuação por si só.

### Etapa 6: Detectar problemas de coesão

Investigue as regras abaixo e registre somente problemas com evidência concreta.

#### 1. Vocabulários misturados

**Sinal**: uma página, componente ou hook mistura termos e regras de jornadas diferentes.

**Exemplo**: a busca por memórias controla o preenchimento do formulário de um novo show.

**Ação**: separar a coordenação de estado e os componentes por jornada; compartilhar apenas elementos visuais neutros.

#### 2. Componente compartilhado com regra de negócio

**Sinal**: um elemento em `presentation/shared/` conhece campos, validações ou decisões de uma feature específica.

**Exemplo**: um `Card` compartilhado decide se uma memória pode ser organizada.

**Ação**: manter o primitivo neutro e mover a regra para o componente ou hook da feature.

#### 3. Hook com várias jornadas

**Sinal**: um hook coordena busca, upload, edição ou feedbacks de objetivos de usuário diferentes.

**Exemplo**: validações do formulário alteram uma lista de resultados independente.

**Ação**: dividir o hook por fluxo e compor apenas onde houver uma transição explícita entre etapas.

#### 4. Fronteira visual confundida com Domain

**Sinal**: uma rota, modal, cabeçalho ou área da tela é tratado como contexto de negócio sem mudança de objetivo ou linguagem.

**Ação**: validar a fronteira por objetivo, vocabulário e estados da jornada, e não apenas pela composição visual.

#### 5. Transição de contexto implícita

**Sinal**: o usuário muda de capacidade sem indicação clara na interface, nos estados ou no modelo de fluxo.

**Exemplo**: campos passam a ter outro significado na mesma tela, ou um erro não informa a qual etapa pertence.

**Ação**: explicitar a transição no conteúdo da UI, no UI model e nos testes de fluxo.

#### 6. Dependência indevida entre features

**Sinal**: uma feature importa ou controla estados internos de outra sem uma transição de jornada ou contrato claro.

**Ação**: avaliar se deve haver composição na página, comunicação por Server Action ou apenas compartilhamento de dados já normalizados para a interface.

## Estratégia de investigação

1. Leia primeiro as páginas e os componentes de feature que representam a jornada.
2. Leia os hooks e UI models que controlam a interação.
3. Localize os textos, campos e estados que expressam a linguagem de negócio.
4. Verifique imports e chamadas a Server Actions para entender dependências entre features.
5. Consulte testes de componente e e2e para confirmar o comportamento e a transição entre jornadas.
6. Use o histórico Git somente quando precisar confirmar coesão de mudança.

Ferramentas preferenciais:

- `read_file`: ler páginas, componentes, hooks, UI models e testes.
- `grep_search` ou `semantic_search`: localizar vocabulário, estados, ações e referências de feature.
- `file_search` e `list_dir`: explorar a estrutura relevante.
- `vscode_listCodeUsages`: verificar uso de componentes, hooks e tipos quando houver suporte.

## Formato de saída obrigatório

### 1. Mapa de Domain

```markdown
## Domain: {nome da capacidade de negócio}

**Classificação**: Core Domain | Supporting Subdomain | Generic Subdomain
**Coesão**: {pontuação}/10 {✅|⚠️|❌}
**Objetivo do usuário**: {resultado buscado}
**Ubiquitous Language**: {termos-chave}

**Jornada**:

1. {evento de entrada}
2. {etapas de interação}
3. {resultado ou saída}

**Artefatos de frontend**:

- Páginas e rotas: {lista}
- Componentes de feature: {lista}
- Hooks e UI models: {lista}
- Estados de interface: {lista}

**Subdomains**:

1. **{nome}** ({Core|Supporting|Generic})
   - Objetivo: {objetivo}
   - Coesão: {pontuação}/10 {✅|⚠️|❌}
   - Dependências: → {outro contexto} ({dado ou transição})

**Dependências de contexto**:

- → {outro contexto} ({dado ou transição})
- ← {outro contexto} ({dado ou transição})

**Problemas de coesão**:

- ❌ {problema confirmado}
- ⚠️ {ponto de atenção}
```

### 2. Matriz de coesão entre jornadas

```markdown
## Matriz de coesão

| Jornada A         | Jornada B              | Coesão | Relação                                          | Problema? |
| ----------------- | ---------------------- | ------ | ------------------------------------------------ | --------- |
| Captura inicial   | Organização da memória | 8/10   | Transição explícita da mesma capacidade          | Não       |
| Busca de memórias | Organização da memória | 5/10   | Compartilham dados, mas têm objetivos diferentes | ⚠️        |
```

### 3. Relatório de baixa coesão

```markdown
## Problemas de baixa coesão

### Problema #{número}: {título}

**Localização**: `{caminho}` / `{componente ou hook}`
**Tipo**: Vocabulários misturados | Regra em componente compartilhado | Hook com várias jornadas | Fronteira visual | Transição implícita | Dependência indevida
**Evidência**: {descrição objetiva}
**Jornadas envolvidas**: {lista}
**Pontuação de coesão**: {pontuação}/10
**Correção sugerida**: {recomendação acionável}
**Prioridade**: Alta | Média | Baixa
```

### 4. Resumo executivo

```markdown
## Resumo

**Domains identificados**: {número}

- {Domain} ({classificação}) — coesão: {pontuação}/10

**Subdomains identificados**: {número}

- {quantidade} Core Domains
- {quantidade} Supporting Subdomains
- {quantidade} Generic Subdomains

**Problemas de coesão**: {número}

- {quantidade} de alta prioridade
- {quantidade} de média prioridade
- {quantidade} de baixa prioridade

**Avaliação geral**:

- ✅ {pontos positivos}
- ⚠️ {pontos de atenção}
- ❌ {problemas críticos}
```

## Lista de verificação final

Antes de responder, confirme:

- [ ] As diretrizes de `DOMAIN-IDENTIFICATION-GUIDELINES.md` foram carregadas e seguidas.
- [ ] A análise começou pelas jornadas e objetivos de usuário.
- [ ] A Ubiquitous Language foi extraída de textos, estados e artefatos de feature.
- [ ] Domains não foram deduzidos automaticamente de rotas, pastas ou componentes isolados.
- [ ] A coesão foi avaliada por linguagem, jornada, estado e mudança.
- [ ] Problemas de coesão possuem evidências e recomendações acionáveis.
- [ ] Após implementar correções, o documento de análise foi atualizado: problemas resolvidos foram removidos ou marcados como resolvidos, e as pontuações, matriz e resumo representam o estado atual do código.
- [ ] A saída inclui o mapa de Domain, a matriz de coesão, o relatório de problemas e o resumo.

## Referências

- **Principal**: `docs/DOMAIN-IDENTIFICATION-GUIDELINES.md`
- **Teoria de DDD**: `docs/DDD-STRATEGIC-DESIGN-THEORY.md`
- **Arquitetura do projeto**: `docs/ARCHITECTURE-GUIDELINES.md`
- **Usabilidade e interface**: `docs/USABILITY-GUIDELINES.md`
