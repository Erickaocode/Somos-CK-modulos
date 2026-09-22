import type { Modulo } from '../types';

/* Permite que o admin edite/adicione conteúdo dos módulos (títulos, textos
   e, no caso de formulários, os campos) sem mexer no código. As edições
   ficam guardadas à parte, por id de módulo, e são aplicadas por cima dos
   módulos padrão (definidos em data/modulos.ts) sempre que a lista é lida. */

const CHAVE_EDICOES = 'fichario_edicoes_modulos_v1';

export function obterEdicoes(): Record<string, Modulo> {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_EDICOES) || '{}');
  } catch {
    return {};
  }
}

export function salvarEdicaoModulo(modulo: Modulo): void {
  const edicoes = obterEdicoes();
  edicoes[modulo.id] = modulo;
  localStorage.setItem(CHAVE_EDICOES, JSON.stringify(edicoes));
}

export function removerEdicaoModulo(id: string): void {
  const edicoes = obterEdicoes();
  delete edicoes[id];
  localStorage.setItem(CHAVE_EDICOES, JSON.stringify(edicoes));
}

export function temEdicao(id: string): boolean {
  return id in obterEdicoes();
}

/** Mescla os módulos padrão com qualquer edição salva pelo admin. */
export function aplicarEdicoes(modulosPadrao: Modulo[]): Modulo[] {
  const edicoes = obterEdicoes();
  return modulosPadrao.map((m) => edicoes[m.id] ?? m);
}

function slugificar(texto: string): string {
  return (
    texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'campo'
  );
}

/** Gera um id único (a partir do texto do campo) para um novo campo de formulário. */
export function gerarIdCampo(label: string, idsExistentes: string[]): string {
  const base = slugificar(label);
  let id = base;
  let contador = 2;
  while (idsExistentes.includes(id)) {
    id = `${base}-${contador}`;
    contador++;
  }
  return id;
}
