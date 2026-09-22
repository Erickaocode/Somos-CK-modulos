import type { Ato, Modulo } from '../types';
import { ATOS, MODULOS } from '../data/modulos';

/* Permite que o admin edite/adicione conteúdo dos módulos (títulos, textos
   e, no caso de formulários, os campos) sem mexer no código, além de criar
   novos Atos e novos módulos do zero. As edições e os itens novos ficam
   guardados à parte (localStorage) e são aplicados por cima dos Atos/módulos
   padrão (definidos em data/modulos.ts) sempre que a lista é lida. */

const CHAVE_EDICOES = 'fichario_edicoes_modulos_v1';
const CHAVE_ATOS_CUSTOM = 'fichario_atos_customizados_v1';
const CHAVE_MODULOS_CUSTOM = 'fichario_modulos_customizados_v1';

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

/** Um módulo é "padrão" quando já vem definido em data/modulos.ts (pode ter sido editado, mas não excluído). */
export function ehModuloPadrao(id: string): boolean {
  return MODULOS.some((m) => m.id === id);
}

export function obterAtosCustomizados(): Ato[] {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_ATOS_CUSTOM) || '[]');
  } catch {
    return [];
  }
}

export function adicionarAto(ato: Ato): void {
  const atos = obterAtosCustomizados();
  localStorage.setItem(CHAVE_ATOS_CUSTOM, JSON.stringify([...atos, ato]));
}

/** Remove um Ato criado pelo admin e todos os módulos customizados que pertencem a ele. */
export function removerAtoCustomizado(id: string): void {
  const atos = obterAtosCustomizados().filter((a) => a.id !== id);
  localStorage.setItem(CHAVE_ATOS_CUSTOM, JSON.stringify(atos));

  const modulos = obterModulosCustomizados().filter((m) => m.atoId !== id);
  localStorage.setItem(CHAVE_MODULOS_CUSTOM, JSON.stringify(modulos));
}

/** Todos os Atos: os padrão (data/modulos.ts) + os criados pelo admin. */
export function obterAtosCompletos(): Ato[] {
  return [...ATOS, ...obterAtosCustomizados()];
}

export function obterModulosCustomizados(): Modulo[] {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_MODULOS_CUSTOM) || '[]');
  } catch {
    return [];
  }
}

/** Cria ou atualiza um módulo criado pelo admin (não existe em data/modulos.ts). */
export function salvarModuloCustomizado(modulo: Modulo): void {
  const modulos = obterModulosCustomizados();
  const indice = modulos.findIndex((m) => m.id === modulo.id);
  if (indice === -1) modulos.push(modulo);
  else modulos[indice] = modulo;
  localStorage.setItem(CHAVE_MODULOS_CUSTOM, JSON.stringify(modulos));
}

export function removerModuloCustomizado(id: string): void {
  const modulos = obterModulosCustomizados().filter((m) => m.id !== id);
  localStorage.setItem(CHAVE_MODULOS_CUSTOM, JSON.stringify(modulos));
}

/**
 * Todos os módulos, na ordem certa para exibição: para cada Ato (padrão
 * primeiro, depois os customizados), os módulos padrão (com edições) seguidos
 * dos módulos customizados desse Ato.
 */
export function obterModulosCompletos(): Modulo[] {
  const atosCompletos = obterAtosCompletos();
  const padraoComEdicoes = aplicarEdicoes(MODULOS);
  const customizados = obterModulosCustomizados();

  const resultado: Modulo[] = [];
  atosCompletos.forEach((ato) => {
    resultado.push(...padraoComEdicoes.filter((m) => m.atoId === ato.id));
    resultado.push(...customizados.filter((m) => m.atoId === ato.id));
  });
  return resultado;
}

function slugificar(texto: string): string {
  return (
    texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'item'
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

/** Gera um id único para um novo Ato criado pelo admin. */
export function gerarIdAto(titulo: string): string {
  const idsExistentes = [...ATOS, ...obterAtosCustomizados()].map((a) => a.id);
  const base = slugificar(titulo);
  let id = base;
  let contador = 2;
  while (idsExistentes.includes(id)) {
    id = `${base}-${contador}`;
    contador++;
  }
  return id;
}

/** Gera um id único para um novo módulo criado pelo admin. */
export function gerarIdModulo(titulo: string): string {
  const idsExistentes = [...MODULOS, ...obterModulosCustomizados()].map((m) => m.id);
  const base = slugificar(titulo);
  let id = base;
  let contador = 2;
  while (idsExistentes.includes(id)) {
    id = `${base}-${contador}`;
    contador++;
  }
  return id;
}
