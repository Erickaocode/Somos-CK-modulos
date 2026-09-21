/* ============================================================
   Plano de vida — camada de persistência do protótipo
   ------------------------------------------------------------
   Usa localStorage como "banco de dados" e sessionStorage para a
   sessão do jovem logado. Numa versão conectada a back-end, esta
   é a camada a ser substituída por chamadas de API — as funções
   abaixo mantêm os mesmos nomes de campos (nome, cpf, moduloId,
   resposta, data) para facilitar essa troca futura.
   ============================================================ */

import type { Jovem, Resposta, Sessao } from '../types';

const CHAVE_RESPOSTAS = 'fichario_respostas_v1';
const CHAVE_SESSAO = 'fichario_sessao_v1';

/* ---------- Sessão do jovem ---------- */
export function salvarSessao(nome: string, cpf: string): void {
  sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify({ nome, cpf }));
}

export function obterSessao(): Sessao | null {
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE_SESSAO) || 'null');
  } catch {
    return null;
  }
}

export function encerrarSessao(): void {
  sessionStorage.removeItem(CHAVE_SESSAO);
}

/* ---------- Respostas ---------- */
export function obterTodasRespostas(): Resposta[] {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_RESPOSTAS) || '[]');
  } catch {
    return [];
  }
}

export function salvarResposta({ nome, cpf, moduloId, resposta }: Omit<Resposta, 'data'>): void {
  const respostas = obterTodasRespostas();
  const existente = respostas.find((r) => r.cpf === cpf && r.moduloId === moduloId);
  const registro: Resposta = {
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

export function obterRespostasDoJovem(cpf: string): Resposta[] {
  return obterTodasRespostas()
    .filter((r) => r.cpf === cpf)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
}

export function obterJovensUnicos(): Jovem[] {
  const respostas = obterTodasRespostas();
  const mapa = new Map<string, Jovem>();
  respostas.forEach((r) => {
    if (!mapa.has(r.cpf)) {
      mapa.set(r.cpf, { nome: r.nome, cpf: r.cpf, respostas: [] });
    }
    mapa.get(r.cpf)!.respostas.push(r);
  });
  return Array.from(mapa.values());
}

/* ---------- Dados de demonstração (opcional) ----------
   Popula alguns jovens fictícios na primeira visita, só para a
   área administrativa não começar totalmente vazia. */
export function semearDadosDemo(): void {
  if (obterTodasRespostas().length > 0) return;
  const demo: Omit<Resposta, 'data'>[] = [
    {
      nome: 'Marcos Dourado',
      cpf: '123.456.789-09',
      moduloId: 'lista-desejos',
      resposta:
        'Espero aprender a lidar melhor com o público e entender como funciona o dia a dia de um supermercado.',
    },
    {
      nome: 'Marcos Dourado',
      cpf: '123.456.789-09',
      moduloId: 'roda-da-vida',
      resposta:
        'Uma vez avisei com antecedência que chegaria atrasado no colégio por causa de um imprevisto, e expliquei o motivo ao invés de simplesmente faltar.',
    },
    {
      nome: 'Ana Beatriz Souza',
      cpf: '987.654.321-00',
      moduloId: 'lista-desejos',
      resposta: 'Quero aprender sobre atendimento ao cliente e crescer dentro da empresa.',
    },
  ];
  demo.forEach((d) => salvarResposta(d));
}
