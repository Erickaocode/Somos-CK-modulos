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
