import type { RespostaRodaVida } from '../types';

export function serializarRodaVida(dados: RespostaRodaVida): string {
  return JSON.stringify(dados);
}

export function tentarParsearRodaVida(resposta: string): RespostaRodaVida | null {
  try {
    const obj = JSON.parse(resposta);
    if (obj && typeof obj === 'object' && obj.areas && typeof obj.areas === 'object') {
      return obj as RespostaRodaVida;
    }
    return null;
  } catch {
    return null;
  }
}

export function areasPreenchidas(dados: RespostaRodaVida): number {
  return Object.values(dados.areas).filter((a) => a.nota > 0 || a.reflexao.trim().length > 0).length;
}

export function mediaGeral(dados: RespostaRodaVida): number | null {
  const notas = Object.values(dados.areas)
    .map((a) => a.nota)
    .filter((n) => n > 0);
  if (notas.length === 0) return null;
  return Math.round((notas.reduce((soma, n) => soma + n, 0) / notas.length) * 10) / 10;
}
