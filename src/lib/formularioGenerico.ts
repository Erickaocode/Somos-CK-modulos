import type { RespostaFormulario } from '../types';

export function serializarFormulario(dados: RespostaFormulario): string {
  return JSON.stringify(dados);
}

export function tentarParsearFormulario(resposta: string): RespostaFormulario | null {
  try {
    const obj = JSON.parse(resposta);
    if (obj && typeof obj === 'object' && obj.valores && typeof obj.valores === 'object') {
      return obj as RespostaFormulario;
    }
    return null;
  } catch {
    return null;
  }
}

export function camposPreenchidos(dados: RespostaFormulario): number {
  return Object.values(dados.valores).filter((v) => v.trim().length > 0).length;
}
