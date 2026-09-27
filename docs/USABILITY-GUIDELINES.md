# Diretrizes de Usabilidade e Boas Práticas — concerts-recap

Este documento complementa o [ARCHITECTURE-GUIDELINES.MD](./ARCHITECTURE-GUIDELINES.MD) com diretrizes **genéricas de usabilidade (UX/UI), acessibilidade e boas práticas de front-end** observadas na base de código, para orientar a criação de novas telas e componentes de forma consistente.

## 1. Feedback ao usuário

- **Ações assíncronas (Server Actions)** devem sempre dar feedback visível ao usuário:
  - Sucesso/erro de mutações → `toast.success(...)` / `toast.error(...)` (`react-toastify`), com mensagem curta e acionável.
  - Operações demoradas (upload, extração via IA) → exibir `LoadingOverlay` (fullscreen, `bg-black/70`, ícone `LoaderCircle` animado) para bloquear interação e indicar progresso.
- Mensagens de toast devem ser específicas o suficiente para o usuário entender o que aconteceu (ex.: `'Ticket analyzed successfully!'`, `'Failed to analyze ticket image'`), nunca genéricas como "Erro".
- Erros de negócio conhecidos (ex.: `CONCERT_ALREADY_EXISTS`) devem ser traduzidos para mensagens amigáveis antes de chegar à UI — nunca expor mensagens técnicas/stack traces ao usuário final.
- `ToastContainer` é global (montado uma vez em `app/layout.tsx`), não deve ser remontado em páginas/componentes individuais.

## 2. Formulários

- Sempre usar `react-hook-form` + `@hookform/resolvers/zod` com o mesmo schema Zod usado na Server Action correspondente (evita duplicar regras de validação entre client e server).
- Todo campo de formulário deve ter `label` associado via `htmlFor`/`id` (ver componente `Input`), nunca depender apenas de `placeholder` como rótulo.
- Erros de campo devem ser exibidos com o componente `FieldError`, que usa `role="alert"` para ser anunciado por leitores de tela — reutilizar esse componente em vez de criar `<p>` de erro ad hoc.
- Estados de campo (`disabled`, erro, foco) devem seguir as classes já padronizadas nos componentes de `presentation/shared/components` (`disabled:opacity-60 disabled:cursor-not-allowed`, bordas de erro, etc.) em vez de estilos inline novos.
- Botões de submit devem refletir estado de carregamento (desabilitar + indicar loading) para evitar duplo envio.

## 3. Acessibilidade

- Todo elemento interativo sem texto visível (ícone-botão, botão de navegação) deve ter `aria-label` descritivo (ex.: `aria-label="next-button"`).
- Mensagens de erro/alerta usam `role="alert"`.
- `<html lang="en">` definido uma vez no layout raiz — não duplicar/alterar por página.
- Contraste: usar sempre os tokens de cor definidos em `globals.css` (`--color-text-body`, `--color-text-placeholder`, `--color-border-*`) em vez de cores hardcoded, para manter contraste consistente no tema escuro do app.
- Preferir elementos semânticos nativos (`<button>`, `<label>`, `<input>`) a `<div onClick>`.
- Estados `disabled` devem ser refletidos tanto visualmente (`opacity`, `cursor-not-allowed`) quanto via atributo HTML `disabled`, nunca apenas por estilo.

## 4. Responsividade

- Usar breakpoints do Tailwind (`sm:`, `md:`, `lg:`) para adaptar tipografia, espaçamento e layout — ver exemplos em `Input` (`text-sm lg:text-base`) e `LoadingOverlay` (`text-sm md:text-base`).
- Layouts devem funcionar em mobile-first: estilos base sem prefixo cobrem mobile, breakpoints maiores ajustam para telas maiores.
- Evitar larguras/alturas fixas em `px` para contêineres de página; preferir utilitários flexíveis (`flex`, `w-full`, `max-w-*`, `gap-*`).

## 5. Consistência visual e reuso de componentes

- Nunca estilizar um elemento HTML nativo (`<button>`, `<input>`, `<select>`) diretamente em uma página/feature — sempre usar (ou estender) os componentes de `presentation/shared/components/` (`Button`, `Input`, `Select`, `Checkbox`, `Radio`, `Card`, etc.).
- Novas variantes visuais de um componente existente devem seguir o padrão de prop `variant` já usado (`Button`: `primary | secondary | outlined`), com estilos aplicados via `cn()` — nunca com `style={{ ... }}` inline.
- Sempre usar o helper `cn()` (clsx + tailwind-merge) para compor classes condicionais/mescladas, permitindo que `className` recebido via props sobrescreva o padrão do componente.
- Cores, espaçamentos e tipografia devem vir de tokens do tema Tailwind (`bg-accent-purple`, `text-content-body`, etc.), não de valores arbitrários (`bg-[#123456]`), exceto quando não houver token equivalente.
- Ícones: usar `lucide-react` (já otimizado em `next.config.ts` via `optimizePackageImports`) por padrão; `react-icons` só quando o ícone não existir em `lucide-react`.

## 6. Testabilidade da UI

- Todo elemento interativo relevante para fluxos de e2e/teste (inputs de busca, campos de formulário críticos, botões de ação) deve expor `data-testid` estável e descritivo (ex.: `artist-input`, `search-input`).
- Não usar seletores de texto ou classes CSS como alvo de teste em specs e2e — sempre via `data-testid` (Playwright) ou `getByRole`/`getByLabelText` (Testing Library) quando fizer sentido semanticamente.
- Mudar um `data-testid` existente é uma alteração que quebra testes — ao renomear, atualizar specs correspondentes em `src/tests/` e `e2e/` no mesmo commit.

## 7. Conteúdo e idioma

- Textos de UI (labels, mensagens de toast, textos de botão) no código atual estão em **inglês**; documentação e comunicação com o usuário do repositório (README, comentários de PR) estão em **português**. Ao adicionar textos novos, seguir o idioma predominante do arquivo/contexto em que está inserindo — não misturar os dois no mesmo componente.
- Mensagens de erro voltadas ao usuário devem ser curtas, no tom direto já usado (ex.: `'Failed to create concert. Please try again later.'`), sem jargão técnico.

## 8. Performance percebida

- Preferir Server Components (`app/**/page.tsx`) para busca inicial de dados, evitando client-side fetching desnecessário; usar `*Client.tsx` só para a parte realmente interativa da tela.
- Usar `<Suspense>` ao redor de conteúdo carregado no servidor que pode demorar, para exibir fallback em vez de travar a navegação.
- Evitar `revalidatePath` mais amplo do que o necessário (preferir o path específico da rota afetada em vez de `'/', 'layout'` quando possível), para não invalidar cache além do necessário.
- Fontes carregadas via `next/font/google` com `display: 'swap'` — manter esse padrão para qualquer fonte nova, evitando bloqueio de renderização.

## 9. Boas práticas gerais de front-end

1. Nenhum estado de carregamento assíncrono deve deixar a UI "presa" sem feedback — sempre acompanhar de loading state ou overlay.
2. Nenhuma ação destrutiva ou de mutação deve ocorrer sem possibilidade de o usuário perceber o resultado (toast/redirecionamento/atualização visível).
3. Não duplicar lógica de validação entre client e server — o schema Zod é a fonte única de verdade.
4. Não introduzir bibliotecas de UI novas (outro design system, outra lib de ícones, outro toast) sem necessidade clara — reaproveitar o que já existe em `presentation/shared`.
5. Componentes novos de UI compartilhável devem nascer em `presentation/shared/components/<nome>/<Nome>.tsx`, com suas props tipadas em `shared/ui-model/shared.model.ts`, seguindo o mesmo padrão dos componentes existentes.
