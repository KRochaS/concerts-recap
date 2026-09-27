# Teoria do Design Estratégico em DDD

> **Objetivo**: Este documento resume os princípios de Design Estratégico do Domain-Driven Design para servir de base à identificação de domínios e à análise de fronteiras.

## Definições fundamentais

### Domínio

Um **Domain** é o campo de negócio em que a organização atua e o contexto no qual ela opera.

- **Definição de negócio**: conjunto de operações, conhecimentos e métodos da organização.
- **Definição técnica**: espaço de problema que o software busca resolver.
- **Ponto importante**: o termo pode significar o negócio inteiro ou uma área específica, como Core Domain ou Subdomain.

```
Domínio = Campo de negócio da organização + Forma de operar + Conhecimento exclusivo
```

### Subdomínio

Um **Subdomain** é uma área distinta dentro do domínio geral de negócio.

- **Objetivo**: dividir a complexidade do domínio em partes gerenciáveis.
- Todo domínio de software possui vários subdomínios, que representam funções de negócio diferentes.
- **Regra**: separe funções de negócio distintas para evitar acúmulo de complexidade.

```
Domínio = Subdomínio₁ + Subdomínio₂ + Subdomínio₃ + ... + Subdomínioₙ
```

#### Tipos de subdomínio

| Tipo                     | Descrição                                                                       | Valor para o negócio | Prioridade da equipe                                | Exemplo                                        |
| ------------------------ | ------------------------------------------------------------------------------- | -------------------- | --------------------------------------------------- | ---------------------------------------------- |
| **Core Domain**          | Central para o sucesso do negócio e fonte de vantagem competitiva.              | Máximo               | Melhores desenvolvedores e especialistas do domínio | Algoritmo de previsão de uma empresa varejista |
| **Supporting Subdomain** | Essencial, mas não diferenciador; é específico da empresa e dá suporte ao Core. | Médio                | Desenvolvedores competentes                         | Gestão de estoque                              |
| **Generic Subdomain**    | Funcionalidade comum, que pode ser comprada ou terceirizada.                    | Menor                | Pode ser terceirizado                               | Autenticação, envio de e-mail                  |

**Matriz de decisão para classificação:**

```
É uma vantagem competitiva?
  SIM → Core Domain
  NÃO → Exige conhecimento específico do negócio?
         SIM → Supporting Subdomain
         NÃO → Generic Subdomain
```

### Contexto delimitado

Um **Bounded Context** é uma fronteira explícita dentro da qual existe um modelo de domínio.

- É, antes de tudo, uma **fronteira linguística**: seus termos têm significados específicos.
- Dentro da fronteira, os termos da Ubiquitous Language são inequívocos.
- Pode conter o modelo de domínio, esquema de banco de dados, componentes de UI, Application Services e serviços web.

> **O contexto é soberano**: o mesmo termo pode ter significados completamente diferentes em contextos distintos. Por exemplo, "Account" no contexto bancário e no contexto literário.

```
Bounded Context = Fronteira linguística explícita + Modelo de domínio + Infraestrutura de suporte
```

## Espaço do problema e espaço da solução

### Espaço do problema

- **Definição**: partes do Domain que precisam ser desenvolvidas ou atendidas.
- **Composição**: Core Domain e os Supporting Subdomains necessários.
- **Objetivo**: avaliação estratégica dos desafios de negócio.
- **Ferramenta**: Subdomains.

### Espaço da solução

- **Definição**: modelos de software específicos que concretizam a solução.
- **Composição**: um ou mais Bounded Contexts.
- **Objetivo**: implementação efetiva do software.
- **Ferramenta**: Bounded Contexts.

```
Espaço do problema (o que resolver) → avaliado com → Subdomínios
                ↓ transforma-se em ↓
Espaço da solução (como resolver) → realizado com → Bounded Contexts
```

**Objetivo ideal**: alinhar Subdomains e Bounded Contexts em uma relação 1:1, segregando os modelos de domínio por objetivo de negócio.

**Realidade**: em sistemas legados, um Subdomain pode atravessar vários Bounded Contexts, ou um Bounded Context pode conter vários modelos implícitos.

## Linguagem ubíqua

A **Ubiquitous Language** é o vocabulário compartilhado entre desenvolvedores e especialistas do domínio.

1. **A linguagem orienta as fronteiras**: os limites de Bounded Context são principalmente linguísticos.
2. **Mesmo termo, significado diferente**: termos com sentidos distintos pertencem a contextos diferentes.
3. **Não há definições globais**: não tente dar um único significado a todos os conceitos.
4. **Aceite as diferenças**: use Bounded Contexts para delimitar explicitamente onde elas existem.

### Detecção de fronteiras linguísticas

**Sinais de que conceitos pertencem a Bounded Contexts diferentes:**

- O mesmo termo tem propriedades ou comportamentos diferentes.
- O mesmo termo é usado em estágios distintos de um ciclo de vida.
- Especialistas usam vocabulários diferentes para conceitos parecidos.
- Os conceitos se relacionam de forma diferente conforme o contexto.

**Exemplo: "Customer" no e-commerce:**

| Contexto              | Significado de Customer                                                 |
| --------------------- | ----------------------------------------------------------------------- |
| Navegação no catálogo | Compras anteriores, fidelidade, produtos disponíveis, descontos         |
| Realização do pedido  | Nome, endereço de entrega, endereço de cobrança, condições de pagamento |

São conceitos diferentes que compartilham um nome; portanto, pertencem a Bounded Contexts diferentes.

**Exemplo: "Book" no setor editorial:**

| Estágio do ciclo de vida | Definição de Book                               |
| ------------------------ | ----------------------------------------------- |
| Concepção                | Ideia proposta, possível autor                  |
| Contrato                 | Título provisório, acordo com o autor           |
| Editorial                | Rascunhos, comentários, correções, versão final |
| Produção                 | Diagramação, imagens para impressão, chapas     |
| Marketing                | Capa e descrições                               |
| Envio                    | Identidade, local de estoque, tamanho e peso    |

Cada estágio possui um modelo de "Book" diferente; portanto, são Bounded Contexts separados.

## Antipadrões do design estratégico

### Big Ball of Mud

**Definição**: sistema improvisado, com código espaguete, no qual tudo está conectado a todo o resto.

**Causas:**

- Mistura de vocabulários de negócio diferentes em um único modelo.
- Falta de separação entre fronteiras linguísticas.
- Combinação do Core Domain com preocupações genéricas.
- Ausência de Bounded Contexts explícitos.

**Prevenção:** compreender o Domain e seus Subdomains, criar fronteiras explícitas e separar preocupações linguísticas.

### Modelo abrangente (Enterprise Model)

**Definição**: tentativa de criar um único modelo coeso para todo o domínio de negócio de uma organização.

**Por que falha:**

- É impossível estabelecer consenso global sobre o significado de todos os conceitos.
- As partes interessadas têm perspectivas diferentes.
- Definições globais duradouras são improváveis e geram conflitos.

**Solução**: aceite que as diferenças sempre existirão e use Bounded Contexts para delimitar cada modelo de domínio separadamente.

### Conceitos linguísticos misturados

**Exemplo do SaaSOvation:**

```
❌ INCORRETO: Forum, Post, Discussion acoplados a User, Permission
   - User/Permission são conceitos de identidade e segurança
   - Forum/Post/Discussion são conceitos de colaboração
   - Eles não se harmonizam na Ubiquitous Language de colaboração

✅ CORRETO: Forum, Post, Discussion acoplados a Author, Moderator, Participant
   - Todos os conceitos têm associação linguística com colaboração
   - Conceitos de identidade pertencem ao contexto de identidade e acesso
```

**Regra**: todo conceito de um Bounded Context deve ter associação linguística com o domínio daquele contexto.

## Tamanho dos Bounded Contexts

### Princípio orientador

> Um Bounded Context deve ter o tamanho necessário para expressar por completo sua Ubiquitous Language.

### Princípio de Mozart

> "Há exatamente tantas notas quanto eu precisei, nem mais nem menos."

- Não deve ser pequeno demais, com lacunas causadas por conceitos ausentes.
- Nem grande demais, com excesso de conceitos estranhos ao contexto.

### O que incluir

- ✅ Conceitos que fazem parte da Ubiquitous Language.
- ✅ Conceitos que especialistas descrevem como relacionados.
- ✅ Componentes que se encaixam naturalmente em um modelo coeso.

### O que excluir

- ❌ Conceitos que não fazem parte da Ubiquitous Language.
- ❌ Conceitos que não pertencem de fato ao Core Domain.
- ❌ Funcionalidades genéricas que pertencem a Supporting ou Generic Subdomains.

### Motivos inadequados para definir o tamanho

| Motivo inadequado                             | Por que é inadequado                                                       |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| Componentes arquiteturais                     | Componentes técnicos não definem fronteiras linguísticas.                  |
| Distribuição de tarefas entre desenvolvedores | Forçar fronteiras para gerir tarefas contraria as motivações linguísticas. |
| Convenções de plataforma ou framework         | A infraestrutura não deve orientar as fronteiras do domínio.               |

**Alternativa para distribuir tarefas**: use módulos dentro de um Bounded Context para dividir responsabilidades de desenvolvimento.

## Integração entre Bounded Contexts

1. **Bounded Contexts raramente são isolados**: mesmo sistemas grandes não fazem tudo.
2. **Integração é necessária**: modelos diferentes precisam trabalhar em conjunto.
3. **Mapeamento é obrigatório**: ao integrar, deve haver tradução entre Bounded Contexts.
4. **Identidade compartilhada, modelos distintos**: objetos podem compartilhar uma identidade entre contextos, mas ter propriedades diferentes.

### Exemplo de integração

```
User (Contexto de identidade) + Role (Contexto de identidade)
           ↓ Integração e tradução ↓
      Moderator (Contexto de colaboração)
```

- Atributos de User são usados para criar um Moderator.
- Moderator é um conceito diferente, com propriedades diferentes.
- A tradução respeita as Ubiquitous Languages de ambos os contextos.

## Perguntas de avaliação

### Espaço do problema

1. Qual é o nome e a visão do Core Domain estratégico?
2. Quais conceitos fazem parte do Core Domain?
3. Quais Supporting Subdomains e Generic Subdomains são necessários?
4. Quem deve realizar o trabalho em cada área do domínio?
5. É possível formar as equipes adequadas?

### Espaço da solução

1. Quais ativos de software já existem e podem ser reutilizados?
2. Quais ativos precisam ser adquiridos ou criados?
3. Como esses elementos se conectam ou se integram?
4. Que integração adicional será necessária?
5. Em quais pontos os termos das Ubiquitous Languages são completamente diferentes?
6. Onde há sobreposição e compartilhamento de conceitos entre Bounded Contexts?
7. Como termos compartilhados são mapeados e traduzidos?
8. Qual Bounded Context contém os conceitos do Core Domain?

## Aplicação prática na análise de código

### Identificação de domínios

1. **Procure agrupamentos de entidades**: grupos relacionados que compartilham vocabulário.
2. **Analise as responsabilidades dos serviços**: quais operações de negócio eles realizam?
3. **Verifique o escopo dos use cases**: quais problemas de negócio eles resolvem?
4. **Examine os agrupamentos de controllers**: quais capacidades eles expõem?

### Detecção de fronteiras inadequadas

| Sinal                                                        | Interpretação                                                |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Mesma classe em vários contextos, com propriedades idênticas | Possível erro de modelagem, exceto em caso de Shared Kernel. |
| Conceitos com vocabulários diferentes no mesmo módulo        | Fronteiras linguísticas misturadas.                          |
| Serviço que trata vários domínios de negócio                 | Baixa coesão; deve ser dividido.                             |
| Entidade relacionada a domínios não relacionados             | Fronteiras pouco claras.                                     |

### Validação de fronteiras corretas

| Sinal                                                          | Interpretação                 |
| -------------------------------------------------------------- | ----------------------------- |
| Todos os conceitos compartilham vocabulário de negócio         | Boa coesão linguística.       |
| Conceitos têm propriedades e operações específicas do contexto | Separação apropriada.         |
| Pontos claros de integração com outros contextos               | Fronteiras explícitas.        |
| Especialistas descrevem os conceitos sem confusão              | Ubiquitous Language saudável. |

## Resumo: pontos essenciais para LLMs

1. **Domain** = campo de negócio; **Subdomain** = função de negócio específica dentro dele.
2. **Bounded Context** = fronteira linguística em que os termos têm significados específicos e inequívocos.
3. A **Ubiquitous Language** orienta as fronteiras, e não a arquitetura técnica.
4. **Core Domain** = vantagem competitiva; **Supporting** = essencial, mas não diferenciador; **Generic** = pode ser terceirizado.
5. Espaço do problema (Subdomains) → espaço da solução (Bounded Contexts).
6. Antipadrões: Big Ball of Mud, Enterprise Model e conceitos linguísticos misturados.
7. O tamanho do contexto é determinado pela completude da Ubiquitous Language, não pela arquitetura ou distribuição de tarefas.
8. Bounded Contexts precisam se integrar; mapeamento e tradução são necessários.
9. Mesmo termo em contextos diferentes = conceito diferente = Bounded Context diferente.
10. Sempre consulte especialistas do domínio para compreender as fronteiras linguísticas.
