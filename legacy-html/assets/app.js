/* ============================================================
   Fichário Inteligente — lógica compartilhada do protótipo
   ------------------------------------------------------------
   IMPORTANTE (leia o README.md):
   Este protótipo usa localStorage só para simular um banco de
   dados no navegador, e sessionStorage para simular a sessão do
   jovem logado. Numa versão real, isso deve ser substituído por
   chamadas a uma API (ex.: Laravel) e autenticação de verdade.
   ============================================================ */

const CHAVE_RESPOSTAS = "fichario_respostas_v1";
const CHAVE_SESSAO = "fichario_sessao_v1";

/* ---------- Módulos do curso (mock de conteúdo) ---------- */
const MODULOS = [
  {
    id: "boas-vindas",
    titulo: "Boas-vindas ao Programa",
    descricao: "Conheça os objetivos do programa de aprendizagem e o que esperar dos próximos meses.",
    pergunta: "O que você mais espera aprender durante o programa?",
  },
  {
    id: "postura-profissional",
    titulo: "Ética e Postura Profissional",
    descricao: "Boas práticas de conduta, pontualidade e relacionamento no ambiente de trabalho.",
    pergunta: "Descreva uma situação em que você precisou agir com responsabilidade em um trabalho, escola ou grupo.",
  },
  {
    id: "comunicacao",
    titulo: "Comunicação Assertiva",
    descricao: "Como se comunicar com clareza e respeito com colegas, líderes e clientes.",
    pergunta: "Cite um exemplo de como você se comunicaria para pedir ajuda em uma tarefa que não entendeu.",
  },
  {
    id: "plano-carreira",
    titulo: "Meu Plano de Carreira",
    descricao: "Primeiros passos para pensar sua trajetória profissional a partir do estágio ou aprendizagem.",
    pergunta: "Onde você se imagina profissionalmente daqui a 2 anos?",
  },
];

/* ---------- Utilidades de CPF ---------- */
function apenasNumeros(valor) {
  return (valor || "").replace(/\D/g, "");
}

function formatarCPF(valor) {
  const n = apenasNumeros(valor).slice(0, 11);
  return n
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function cpfValido(cpf) {
  const n = apenasNumeros(cpf);
  if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;

  const calcDigito = (fatorInicial) => {
    let soma = 0;
    for (let i = 0; i < fatorInicial - 1; i++) {
      soma += parseInt(n[i], 10) * (fatorInicial - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const d1 = calcDigito(10);
  const d2 = calcDigito(11);
  return d1 === parseInt(n[9], 10) && d2 === parseInt(n[10], 10);
}

function mascararCPF(cpf) {
  const n = apenasNumeros(cpf);
  if (n.length !== 11) return cpf;
  return `${n.slice(0, 3)}.***.***-${n.slice(9)}`;
}

/* ---------- Sessão do jovem (mock) ---------- */
function salvarSessao(nome, cpf) {
  sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify({ nome, cpf }));
}

function obterSessao() {
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE_SESSAO) || "null");
  } catch (e) {
    return null;
  }
}

function encerrarSessao() {
  sessionStorage.removeItem(CHAVE_SESSAO);
}

/* ---------- Respostas (mock de banco de dados) ---------- */
function obterTodasRespostas() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_RESPOSTAS) || "[]");
  } catch (e) {
    return [];
  }
}

function salvarResposta({ nome, cpf, moduloId, resposta }) {
  const respostas = obterTodasRespostas();
  const existente = respostas.find((r) => r.cpf === cpf && r.moduloId === moduloId);
  const registro = {
    nome,
    cpf,
    moduloId,
    resposta,
    data: new Date().toISOString(),
  };
  if (existente) {
    Object.assign(existente, registro);
  } else {
    respostas.push(registro);
  }
  localStorage.setItem(CHAVE_RESPOSTAS, JSON.stringify(respostas));
}

function obterRespostasDoJovem(cpf) {
  return obterTodasRespostas()
    .filter((r) => r.cpf === cpf)
    .sort((a, b) => new Date(b.data) - new Date(a.data));
}

function obterJovensUnicos() {
  const respostas = obterTodasRespostas();
  const mapa = new Map();
  respostas.forEach((r) => {
    if (!mapa.has(r.cpf)) {
      mapa.set(r.cpf, { nome: r.nome, cpf: r.cpf, respostas: [] });
    }
    mapa.get(r.cpf).respostas.push(r);
  });
  return Array.from(mapa.values());
}

function formatarData(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }) +
    " às " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function iniciaisNome(nome) {
  const partes = (nome || "").trim().split(/\s+/);
  const primeira = partes[0]?.[0] || "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

/* ---------- Dados de demonstração (opcional) ----------
   Popula alguns jovens fictícios na primeira visita, só para a
   área administrativa não começar totalmente vazia. Pode remover
   esta função com segurança. */
function semearDadosDemo() {
  if (obterTodasRespostas().length > 0) return;
  const demo = [
    { nome: "Marcos Dourado", cpf: "123.456.789-09", moduloId: "boas-vindas", resposta: "Espero aprender a lidar melhor com o público e entender como funciona o dia a dia de um supermercado." },
    { nome: "Marcos Dourado", cpf: "123.456.789-09", moduloId: "postura-profissional", resposta: "Uma vez avisei com antecedência que chegaria atrasado no colégio por causa de um imprevisto, e expliquei o motivo ao invés de simplesmente faltar." },
    { nome: "Ana Beatriz Souza", cpf: "987.654.321-00", moduloId: "boas-vindas", resposta: "Quero aprender sobre atendimento ao cliente e crescer dentro da empresa." },
  ];
  demo.forEach((d) => salvarResposta(d));
}