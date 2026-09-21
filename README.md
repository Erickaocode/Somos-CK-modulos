# Fichário Inteligente

Aplicação do fluxo de módulos do programa de aprendizagem/estágio, em **React + TypeScript** (Vite):

1. **Identificação (`/`)** — o jovem informa **nome** e **CPF** (com máscara e
   validação real do dígito verificador). Ao confirmar, é redirecionado para
   os módulos.
2. **Meus Módulos (`/modulos`)** — área do jovem. Lista os módulos do curso,
   permite responder cada um (texto livre) e mostra, na coluna da direita, o
   **histórico de respostas já enviadas** (módulo, data e texto), além de uma
   barra de progresso.
3. **Administração (`/admin`)** — área administrativa com sidebar, cards de
   estatística e tabela de jovens que já responderam algo, progresso de cada
   um, e um botão "Ver respostas" que abre um modal com todas as respostas
   daquele jovem, módulo a módulo.

A área administrativa não tem link visível na tela de identificação — é
acessada diretamente pela rota `/admin`.

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- [react-router-dom](https://reactrouter.com/) para as rotas `/`, `/modulos` e `/admin`
- CSS global (`src/index.css`) portado do protótipo original, sem framework de UI

## Como rodar

```bash
npm install
npm run dev
```

Outros scripts:

```bash
npm run build    # build de produção (tsc + vite build)
npm run lint      # oxlint
npm run preview   # serve o build de produção localmente
```

## Estrutura

```
src/
  components/       # componentes de UI reutilizáveis
  components/admin/ # componentes específicos da área administrativa
  data/modulos.ts    # conteúdo mock dos módulos do curso
  lib/               # utilitários (CPF, formatação, persistência)
  pages/             # páginas/rotas (Identificação, Módulos, Admin)
  types/             # tipos compartilhados (Modulo, Resposta, Sessao, Jovem)
```

## O que é mock e o que já é "de verdade"

- ✅ **Validação de CPF** (algoritmo real do dígito verificador) e máscara de
  digitação — já é lógica real, reaproveitável.
- ✅ **Fluxo de navegação** entre identificação → módulos → admin — rotas
  reais do React Router.
- ⚠️ **Persistência dos dados**: usa `localStorage` do navegador como um
  "banco de dados fake" (`src/lib/storage.ts`), só para o protótipo funcionar
  sem back-end. Isso significa que os dados ficam presos ao navegador de
  quem respondeu — não são compartilhados entre dispositivos nem visíveis de
  verdade para o administrador em outra máquina.
- ⚠️ **Login do administrador**: não existe ainda. A rota `/admin` está
  aberta livremente neste protótipo — é só para validar o layout e o fluxo.

## Sugestão de próximos passos para integrar no seu stack

Como vocês trabalham com **Laravel + Vue/React + MySQL/Supabase**, a
migração natural seria:

1. Trocar as funções de `src/lib/storage.ts` (`salvarResposta`,
   `obterRespostasDoJovem`, `obterJovensUnicos`) por chamadas a uma API
   Laravel (`POST /api/respostas`, `GET /api/jovens`, etc.), mantendo os
   mesmos nomes de campos (`nome`, `cpf`, `moduloId`, `resposta`, `data`)
   para facilitar a troca.
2. Criar uma tabela `respostas_modulo` (cpf, modulo_id, resposta, jovem_id,
   created_at) e uma tabela `jovens` (nome, cpf, criado_em).
3. Proteger `/admin` com autenticação real (Laravel Breeze/Sanctum, ou login
   da própria intranet da Checkout RH), já que hoje qualquer pessoa com o
   link acessa.
4. Considerar LGPD: o CPF deve trafegar sempre por HTTPS e ficar mascarado em
   qualquer tela administrativa que não precise do número completo (a tabela
   de jovens já mascara o CPF, mostrando completo só ao próprio jovem).

## Conteúdo de exemplo

Os 4 módulos ("Boas-vindas ao Programa", "Ética e Postura Profissional",
"Comunicação Assertiva", "Meu Plano de Carreira") e os 2 jovens fictícios que
aparecem na área admin na primeira visita são só para preencher a tela —
edite a lista `MODULOS` em `src/data/modulos.ts` para os módulos reais do
curso.

## Protótipo original

O protótipo estático anterior (HTML/CSS/JS puro) foi preservado em
[`legacy-html/`](legacy-html/) como referência.
