import type { Resposta, RespostaDesejos } from '../types';

/* O módulo "Lista de Desejos" guarda uma resposta estruturada (JSON) dentro
   do mesmo campo `resposta: string` usado pelos módulos de texto livre,
   para não precisar mudar o formato de persistência (localStorage). */

export function serializarDesejos(dados: RespostaDesejos): string {
  return JSON.stringify(dados);
}

export function tentarParsearDesejos(resposta: string): RespostaDesejos | null {
  try {
    const obj = JSON.parse(resposta);
    if (obj && typeof obj === 'object' && obj.categorias && typeof obj.categorias === 'object') {
      return obj as RespostaDesejos;
    }
    return null;
  } catch {
    return null;
  }
}

export function contarSonhosPreenchidos(dados: RespostaDesejos): number {
  return Object.values(dados.categorias).filter((c) => c.sonhos.trim().length > 0).length;
}

/** Lê o tipo de participante (Estagiário/Jovem Aprendiz) a partir da resposta da Lista de Desejos. */
export function obterTipoParticipante(respostas: Resposta[]): string | null {
  const respostaLista = respostas.find((r) => r.moduloId === 'lista-desejos');
  if (!respostaLista) return null;
  return tentarParsearDesejos(respostaLista.resposta)?.tipoParticipante || null;
}
