# Fichário Inteligente — Protótipo de Layout

Protótipo funcional (HTML/CSS/JS puro, sem framework) do fluxo:

1. **`index.html`** — tela de identificação. O jovem informa **nome** e **CPF**
   (com máscara e validação real do dígito verificador). Ao confirmar, ele é
   redirecionado para os módulos.
2. **`modulos.html`** — área do jovem. Lista os módulos do curso, permite
   responder cada um (texto livre) e mostra, na coluna da direita, o
   **histórico de respostas já enviadas** (módulo, data e o texto), além de
   uma barra de progresso.
3. **`admin/index.html`** — **área administrativa em rota separada**
   (`/admin`), com layout próprio (sidebar escura, tabela, cards de
   estatística). Lista todos os jovens que já responderam algo, progresso de
   cada um, e um botão "Ver respostas" que abre um modal com todas as
   respostas daquele jovem, módulo a módulo.

Um link discreto "Sou administrador(a) →" na tela de identificação leva para
`admin/index.html`, exatamente como pedido: uma rota separada, não a mesma
página.

## Como abrir

Basta abrir `index.html` num servidor local (não em `file://`, porque o
histórico entre páginas usa `localStorage`, que exige http/https). O jeito
mais simples:

```bash
cd pasta-do-projeto
python3 -m http.server 8080
# depois acesse http://localhost:8080/index.html
```

## O que é mock e o que já é "de verdade"

- ✅ **Validação de CPF** (algoritmo real do dígito verificador) e máscara de
  digitação — já é lógica real, reaproveitável.
- ✅ **Fluxo de navegação** entre identificação → módulos → admin — rotas
  reais (arquivos/URLs separados).
- ⚠️ **Persistência dos dados**: usa `localStorage` do navegador como um
  "banco de dados fake", só para o protótipo funcionar sem back-end. Isso
  significa que os dados ficam presos ao navegador de quem respondeu — não
  são compartilhados entre dispositivos nem visíveis de verdade para o
  administrador em outra máquina.
- ⚠️ **Login do administrador**: não existe ainda. A rota `/admin` está
  aberta livremente neste protótipo — é só para validar o layout e o fluxo.

## Sugestão de próximos passos para integrar no seu stack

Como vocês trabalham com **Laravel + Vue/React + MySQL/Supabase**, a
migração natural seria:

1. Trocar as funções de `assets/app.js` (`salvarResposta`,
   `obterRespostasDoJovem`, `obterJovensUnicos`) por chamadas a uma API
   Laravel (`POST /api/respostas`, `GET /api/jovens`, etc.), mantendo os
   mesmos nomes de campos (`nome`, `cpf`, `moduloId`, `resposta`, `data`)
   para facilitar a troca.
2. Criar uma tabela `respostas_modulo` (cpf, modulo_id, resposta, jovem_id,
   created_at) e uma tabela `jovens` (nome, cpf, criado_em).
3. Proteger `/admin` com autenticação real (Laravel Breeze/Sanctum, ou
   login da própria intranet da Checkout RH), já que hoje qualquer pessoa
   com o link acessa.
4. Se for reescrever em Vue, cada "página" deste protótipo vira uma rota do
   Vue Router (`/`, `/modulos`, `/admin`) e os componentes de módulo e de
   histórico podem ser extraídos como componentes reutilizáveis
   (`ModuloCard.vue`, `HistoricoRespostas.vue`, `TabelaJovens.vue`).
5. Considerar LGPD: o CPF deve trafegar sempre por HTTPS e ficar mascarado
   em qualquer tela administrativa que não precise do número completo (o
   protótipo já mascara o CPF na tabela e mostra completo só ao próprio
   jovem).

## Conteúdo de exemplo

Os 4 módulos ("Boas-vindas ao Programa", "Ética e Postura Profissional",
"Comunicação Assertiva", "Meu Plano de Carreira") e os 2 jovens fictícios que
aparecem na área admin na primeira visita são só para preencher a tela —
edite a lista `MODULOS` em `assets/app.js` para os módulos reais do curso.
