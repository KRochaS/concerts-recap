# Plano: Sugestões de IA no formulário "Organize Memory" (Etapa 2)

## Objetivo

Ao clicar em NEXT na etapa `InitialMemory` (Etapa 1), o texto já digitado no campo
"Tell us how the night felt." (`description`, `DescriptionSection.tsx`) é enviado à IA,
que retorna **apenas** sugestões para campos que tenham correspondência explícita no texto
(tour, support, songMissed, bestLiveSong, experienceTags, ratings). Nada é inventado.
Essas sugestões pré-preenchem os campos correspondentes na etapa `OrganizeMemory` (Etapa 2).

## Contexto relevante já mapeado

- Fluxo: `src/presentation/ui-model/newConcert/newConcertFlow.ts` (`NewConcertStepEnum.INITIAL/ORGANIZE`, `STEP_COMPONENT`, `NewConcertStepProps { onContinue, onBack }`).
- Orquestração: `src/presentation/pages/newConcert/NewConcertClient.tsx` + `src/presentation/hooks/newConcert/useNewConcertFlow.ts` (hoje só troca `step`, sem estado compartilhado entre etapas).
- Etapa 1: `src/presentation/pages/newConcert/steps/initialMemory/InitialMemory.tsx` + `useInitialMemoryForm.ts` (RHF + `createConcertSchema`), `DescriptionSection.tsx` (textarea `description`, testid `description-input`), submit chama `createConcertAction` (`src/app/actions/concert.actions.ts`) → `CreateConcertUseCase.execute` (`src/core/application/concerts/create-concert.usecase.ts`) → `PrismaConcertRepository.create` (`src/infra/repository/prisma-concert.repository.ts`). **Hoje `create()` retorna `void`** — não expõe o `id` do registro criado.
- Etapa 2: `src/presentation/pages/newConcert/steps/organizeMemory/OrganizeMemory.tsx` é **mockup sem RHF**: inputs sem `register`, sem schema, sem persistência; `selectedIds`/`date` são `useState` locais; botão "Save" só faz `router.push('/concerts')`.
- Domínio já modela os campos: `Concert` (`src/core/domain/concerts/concert.entity.ts`) tem `tour, support, songMissed, bestLiveSong, description, kmTraveled`, ratings (`entranceRating`...`energyAfter`), `experienceTags: string[]`. Já existe `ConcertAISuggestions = Omit<Concert, 'id'|'date'|'artist'|'venue'|'city'|'ticketImageUrl'|'createdAt'|'updatedAt'>` pronto para ser o shape de saída da IA (todos os campos devem virar opcionais/nuláveis na saída da IA).
- IA hoje: `AIService` (`src/core/domain/ai/ai.service.ts`) só tem `extractConcertDataFromImage`. Implementação em `src/infra/services/ai-api.service.ts` usa `generateText` + `Output.object({ schema })` do Vercel AI SDK (`model: 'openai/gpt-4o'`), com prompt explícito "Do not add extra fields". Este é o padrão a replicar.
- Badges de tags fixos (`OrganizeMemory.tsx`, 12 itens `{id, name, icon, color}`) — precisam virar uma constante compartilhada (hoje só existe inline no componente).
- Repositório (`ConcertRepository`) não tem método de update — precisa ser criado.

## Decisões confirmadas com o usuário

1. **Escopo**: plano cobre TUDO — wiring real do form da Etapa 2 (RHF + schema + persistência via update) + feature de sugestão por IA. Não é possível ligar sugestões a um form que não existe de fato.
2. **Gatilho de texto**: o campo `description` da Etapa 1 (`DescriptionSection.tsx`), não um campo novo.
3. **Disparo da IA**: automático ao clicar em **NEXT** (submit) da `InitialMemory` — não é debounce nem botão separado. Ou seja, o submit da Etapa 1 passa a fazer 2 chamadas: criar o concert e gerar sugestões a partir do `description`.
4. **Campos elegíveis**: todos os campos de `OrganizeMemory` (tour, support, songMissed, bestLiveSong, experienceTags **e também os ratings numéricos**), sempre condicionados a haver menção explícita/inferível diretamente do texto — nunca inventar. Campos sem correspondência voltam `null`/ausentes do form.
5. **Sobrescrita**: como as sugestões chegam **antes** da Etapa 2 ser montada (via `defaultValues` do RHF), não há conflito de sobrescrever edição manual — elas simplesmente populam o estado inicial do form. Depois de montado, o usuário edita livremente sem qualquer nova chamada de IA sobrescrevendo.

## Fases de implementação

### Fase 0 — Expor o `id` do concert criado (fundação)

- `ConcertRepository.create` (`src/core/domain/concerts/concerts.repository.ts`): mudar assinatura para `Promise<string>` (retorna o id) — ou alternativa: `Promise<Pick<Concert, 'id'>>`. Preferir `Promise<string>` por simplicidade.
- `PrismaConcertRepository.create`: usar retorno do `this.prisma.concertMemory.create({ data, select: { id: true } })` e devolver `created.id`.
- `CreateConcertUseCase.execute`: retornar `Promise<string>` (o id).
- `createConcertAction`: incluir `concertId` no retorno de sucesso: `{ success: true, message, concertId }`.
- Atualizar mocks de teste (`src/tests/mocks/*ConcertRepository*`) e specs existentes (`create-concert.usecase.spec.ts`, testes de `PrismaConcertRepository`, testes da server action) para refletir o novo retorno.

### Fase 1 — Estado compartilhado entre etapas do wizard

- `NewConcertStepProps` (`newConcertFlow.ts`): estender para incluir dados que trafegam entre etapas, ex.: `onContinue?: (payload: { concertId: string; suggestions?: Partial<ConcertAISuggestions> }) => void`.
- `useNewConcertFlow.ts`: guardar `concertId` e `suggestions` em estado (`useState`), expor junto de `step`; `goToOrganize` passa a aceitar o payload e armazená-lo.
- `NewConcertClient.tsx`: repassar `concertId`/`suggestions` como props extras ao `StepComponent` quando for a etapa `ORGANIZE` (ex.: `<OrganizeMemory onBack={goToInitial} concertId={concertId} suggestions={suggestions} />`). Ajustar tipagem de `STEP_COMPONENT` se necessário (pode exigir um tipo de props mais amplo ou um componente wrapper).

### Fase 2 — Persistência da Etapa 2 (Organize Memory)

1. **DTO**: `src/core/application/concerts/update-concert-organize-details.dto.ts` com `updateConcertOrganizeDetailsSchema` (zod) cobrindo: `tour, support, songMissed, bestLiveSong, description, kmTraveled`, ratings (todos `z.number().min(1).max(5).nullish()` ou conforme escala usada nos `Select`), `experienceTags: z.array(z.string())`. Exportar `UpdateConcertOrganizeDetailsDTO`.
2. **Domínio**: adicionar `update(id: string, data: UpdateConcertInput): Promise<void>` em `ConcertRepository` (novo método), com `UpdateConcertInput` como novo tipo em `concert.entity.ts` (`Partial<Omit<Concert, 'id'|'date'|'artist'|'venue'|'city'|'createdAt'|'updatedAt'>>` ou equivalente explícito).
3. **Infra**: implementar `update` em `PrismaConcertRepository` (`this.prisma.concertMemory.update({ where: { id }, data })`).
4. **Use case**: `UpdateConcertOrganizeDetailsUseCase` em `src/core/application/concerts/update-concert-organize-details.usecase.ts`, único método `execute(id, data)`, delega ao repositório (tratar `CONCERT_NOT_FOUND` se aplicável).
5. **Server Action**: `updateConcertOrganizeDetailsAction(concertId, data)` em `concert.actions.ts`, seguindo o padrão (`safeParse` → instanciar repo/use case → `try/catch` → `{ success, message }`) + `revalidatePath` da rota de detalhe/lista.
6. **Form da Etapa 2**: criar `useOrganizeMemoryForm.ts` (mesmo padrão de `useInitialMemoryForm.ts`) usando `zodResolver(updateConcertOrganizeDetailsSchema)`, com `defaultValues` vindos das `suggestions` recebidas via props (Fase 1).
7. **Reescrever `OrganizeMemory.tsx`** para usar `register`/`control`/`handleSubmit` do novo hook em vez de estado solto; `selectedIds` de tags deve virar um campo controlado do form (ex.: `Controller` para `experienceTags`); `date` idem. Extrair a lista de badges fixos para uma constante compartilhada, ex. `src/presentation/ui-model/newConcert/experienceTags.const.ts` (`EXPERIENCE_TAG_OPTIONS: { id: string; name: string; icon: LucideIcon; color: string }[]`), usada tanto pela UI quanto (por nome) pela validação/mapeamento da IA. Erros de campo devem usar o componente `FieldError` já existente (não criar `<p>` de erro ad hoc), conforme guideline de formulários.
8. Botão "Save" chama `handleSubmit` → `updateConcertOrganizeDetailsAction(concertId, data)` → toast de sucesso/erro (guideline de feedback) → navega para `/concerts`. `revalidatePath` deve mirar a rota específica afetada (ex.: `/concerts`), não `'/', 'layout'`, conforme guideline de performance percebida (seção 8).

### Fase 3 — Serviço de IA para sugestões a partir de texto livre

1. **Domínio** (`src/core/domain/ai/ai.service.ts`): estender `AIService` com
   `generateConcertSuggestions(description: string): Promise<Partial<ConcertAISuggestions>>`.
   Criar tipo de saída explícito (ex. `ConcertSuggestionsResult`) com todos os campos opcionais/nuláveis, e `experienceTags` como lista de **nomes válidos apenas dentre os badges existentes** (não strings livres).
2. **Infra** (`src/infra/services/ai-api.service.ts`): novo método `generateConcertSuggestions`, seguindo o padrão de `extractConcertDataFromImage`:
   - `generateText` com `Output.object({ schema })` (schema Zod com todos campos `.nullable()`/`.optional()`).
   - Prompt explícito e restritivo, nos moldes do já usado ("Do not add extra fields"), reforçando: _"Only fill a field if the user's text explicitly or unambiguously implies it. If not mentioned, return null. Never invent facts. For experienceTags, only choose from this fixed list: [...nomes dos badges...]. For rating fields (1-5), only infer a number if the sentiment about that specific aspect is clearly expressed in the text; otherwise return null."_
   - Passar a lista de tags válidas (nomes) e a escala de ratings dentro do prompt para ancorar a saída (mesma técnica de restrição usada na extração de ticket).
   - Normalizar a saída (filtrar tags que não batem com a lista fixa; ratings fora de 1-5 viram `null`).
3. **Aplicação**: `GenerateConcertSuggestionsUseCase` em `src/core/application/ai/generate-concert-suggestions.usecase.ts`, único `execute(description: string)`, delega ao `AIService`. Erros de IA propagam (mesmo padrão de `ExtractConcertDataUseCase`).
4. **DTO** (se necessário validar entrada): `src/core/application/ai/generate-concert-suggestions.dto.ts` com `generateConcertSuggestionsSchema = z.object({ description: z.string().min(10) })`.
5. **Server Action**: `generateConcertSuggestionsAction(description: string)` em `concert.actions.ts` (ou novo `ai.actions.ts` se preferir separar — mesmo padrão dos demais). Retorno: `{ success: true, suggestions } | { success: false, message }`. Falhas na sugestão **não devem bloquear a criação do concert** — devem degradar graciosamente (ex.: se a chamada de IA falhar, seguir para Etapa 2 sem sugestões, sem toast de erro bloqueante, no máximo um toast informativo neutro).

### Fase 4 — Integração no submit da Etapa 1

- `InitialMemory.tsx` (`submitData`): após `createConcertAction` retornar sucesso (com `concertId` da Fase 0), chamar `generateConcertSuggestionsAction(data.description)` **em paralelo/sequência controlada**, e então `onContinue?.({ concertId: result.concertId, suggestions: suggestionsResult?.suggestions })`.
- Extrair essa orquestração para um hook dedicado, ex. `useInitialMemorySubmit.ts` (ou ampliar `useInitialMemoryForm`), mantendo `InitialMemory.tsx` enxuto — hooks não chamam repositório/use case diretamente, apenas Server Actions (regra já seguida).
- **Feedback de carregamento** (guideline de usabilidade): como a chamada de IA acontece de forma síncrona ao clique de NEXT (bloqueia a navegação), exibir `LoadingOverlay` cobrindo desde o clique em NEXT até a navegação para a Etapa 2 (reaproveitar o mesmo padrão do `useTicketImageExtraction`/overlay já usado na extração de ticket — cuidado com a race condition documentada em memória do repositório: aguardar um frame de animação logo após `setIsSubmitting(true)`).
- Botão "NEXT" deve refletir estado de loading (desabilitado durante o processamento), conforme guideline de formulários.

### Fase 5 — Testes (seguir convenções de `src/tests/**`, sufixo `.spec.ts(x)`)

- `create-concert.usecase.spec.ts`: atualizar para novo retorno (`string`).
- Novo: `update-concert-organize-details.usecase.spec.ts` (mock de repositório parcial).
- Novo: `generate-concert-suggestions.usecase.spec.ts` (mock de `AIService`, casos: sucesso com campos parciais, propagação de erro).
- Novo: teste de `PrismaConcertRepository.update` (mock do Prisma Client).
- Novo: testes de Server Actions (`updateConcertOrganizeDetailsAction`, `generateConcertSuggestionsAction`) mockando use case e prisma, cobrindo validação Zod e mapeamento de erro.
- Novo: `useOrganizeMemoryForm.spec.ts` / teste de componente `OrganizeMemory.spec.tsx` verificando que `defaultValues` são preenchidos a partir das `suggestions` recebidas via props.
- Atualizar mocks em `src/tests/mocks/` (`MockConcertRepository` deve implementar `update` e retorno de `id` em `create`).
- E2E (`e2e/create-concert.spec.ts` ou novo spec): fluxo completo digitando descrição com dados explícitos (ex. "A melhor música foi X, fiquei na moshpit") e verificando que a Etapa 2 chega com os campos correspondentes pré-preenchidos (`data-testid` estáveis a definir nos inputs da Etapa 2, hoje ausentes — precisam ser adicionados nesta fase, conforme guideline de testabilidade).

## Relevant files (visão geral)

- `src/core/domain/concerts/concert.entity.ts` — `UpdateConcertInput`, ajustar `ConcertAISuggestions` se necessário.
- `src/core/domain/concerts/concerts.repository.ts` — `create` retorna `string`; novo `update`.
- `src/core/domain/ai/ai.service.ts` — novo método `generateConcertSuggestions`.
- `src/infra/repository/prisma-concert.repository.ts` — `create`/`update`.
- `src/infra/services/ai-api.service.ts` — novo método com `generateText`/`Output.object`.
- `src/core/application/concerts/create-concert.usecase.ts` — retorno `string`.
- `src/core/application/concerts/update-concert-organize-details.usecase.ts` (novo).
- `src/core/application/concerts/update-concert-organize-details.dto.ts` (novo).
- `src/core/application/ai/generate-concert-suggestions.usecase.ts` (novo).
- `src/core/application/ai/generate-concert-suggestions.dto.ts` (novo).
- `src/app/actions/concert.actions.ts` — `createConcertAction` retorna `concertId`; novas actions `updateConcertOrganizeDetailsAction`, `generateConcertSuggestionsAction`.
- `src/presentation/ui-model/newConcert/newConcertFlow.ts` — `NewConcertStepProps` estendido.
- `src/presentation/ui-model/newConcert/experienceTags.const.ts` (novo) — lista fixa de badges extraída de `OrganizeMemory.tsx`.
- `src/presentation/hooks/newConcert/useNewConcertFlow.ts` — estado `concertId`/`suggestions`.
- `src/presentation/pages/newConcert/NewConcertClient.tsx` — repassar props extras.
- `src/presentation/pages/newConcert/steps/initialMemory/InitialMemory.tsx` (+ novo hook de submit) — orquestrar create + suggestions + loading overlay.
- `src/presentation/pages/newConcert/steps/organizeMemory/OrganizeMemory.tsx` + novo `useOrganizeMemoryForm.ts` — form real, `defaultValues` de `suggestions`, submit real.
- `src/tests/**` — specs novos/atualizados conforme Fase 5.

## Fora de escopo (deliberado)

- Qualquer sugestão que não venha explicitamente do texto do usuário (não inferir artista/venue/city/tour "prováveis" fora do que o texto diz).
- Edição/reprocessamento de sugestões após a Etapa 2 já estar montada (sem botão "re-gerar sugestões" nesta versão).
- Alterar o fluxo de extração de imagem de ticket (Fase de IA por imagem permanece igual).
- Internacionalização/localização de textos (mantém padrão atual: UI em inglês).

## Verificação

1. `npm run lint` / `tsc --noEmit` (pre-push hook já roda isso via lefthook).
2. `npm run test` (Jest) cobrindo os specs novos/atualizados da Fase 5.
3. Teste manual: criar concert com descrição contendo menções explícitas a tour, support act, música perdida, melhor música e ao menos uma tag de experiência; confirmar que só esses campos chegam preenchidos na Etapa 2 e os demais ficam vazios/`null`.
4. Teste manual de resiliência: descrição genérica sem menções específicas → Etapa 2 abre sem nenhum campo pré-preenchido, sem erro bloqueante.
5. `npx playwright test` no spec e2e atualizado/novo.
