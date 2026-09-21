import type { Ato, Modulo, Resposta } from '../types';

export interface ProgressoAto {
  total: number;
  concluidos: number;
  pct: number;
  completo: boolean;
}

export function progressoDoAto(ato: Ato, modulos: Modulo[], historico: Resposta[]): ProgressoAto {
  const modulosDoAto = modulos.filter((m) => m.atoId === ato.id);
  const total = modulosDoAto.length;
  const concluidos = modulosDoAto.filter((m) => historico.some((r) => r.moduloId === m.id)).length;
  const pct = total === 0 ? 100 : Math.round((concluidos / total) * 100);
  return { total, concluidos, pct, completo: pct === 100 };
}

/** Um ato fica bloqueado até que todos os atos anteriores (na ordem de `atos`) estejam 100% concluídos. */
export function atoBloqueado(indice: number, atos: Ato[], modulos: Modulo[], historico: Resposta[]): boolean {
  for (let i = 0; i < indice; i++) {
    if (!progressoDoAto(atos[i], modulos, historico).completo) return true;
  }
  return false;
}

/**
 * Um módulo fica bloqueado se o ato dele estiver bloqueado, ou se algum
 * módulo anterior do MESMO ato ainda não tiver sido respondido — os
 * módulos de um ato são liberados em sequência.
 */
export function moduloBloqueado(
  modulo: Modulo,
  modulos: Modulo[],
  historico: Resposta[],
  atoDoModuloBloqueado: boolean,
): boolean {
  if (atoDoModuloBloqueado) return true;

  const modulosDoAto = modulos.filter((m) => m.atoId === modulo.atoId);
  const indice = modulosDoAto.findIndex((m) => m.id === modulo.id);

  for (let i = 0; i < indice; i++) {
    if (!historico.some((r) => r.moduloId === modulosDoAto[i].id)) return true;
  }
  return false;
}
