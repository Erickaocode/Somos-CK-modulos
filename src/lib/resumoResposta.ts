import type { Modulo, Resposta } from '../types';
import { contarSonhosPreenchidos, tentarParsearDesejos } from './desejos';
import { areasPreenchidas, mediaGeral, tentarParsearRodaVida } from './rodaVida';
import { tentarParsearFormulario } from './formularioGenerico';

/** Resumo curto (uma linha) de uma resposta, usado no histórico e no mapa mental. */
export function trechoResposta(modulo: Modulo | undefined, resposta: Resposta): string {
  if (modulo?.tipo === 'lista-desejos') {
    const dados = tentarParsearDesejos(resposta.resposta);
    if (dados) {
      return `${contarSonhosPreenchidos(dados)} de ${modulo.categoriasDesejos.length} áreas preenchidas`;
    }
  }

  if (modulo?.tipo === 'roda-vida') {
    const dados = tentarParsearRodaVida(resposta.resposta);
    if (dados) {
      const media = mediaGeral(dados);
      const preenchidas = `${areasPreenchidas(dados)} de ${modulo.areasRodaVida.length} áreas avaliadas`;
      return media !== null ? `${preenchidas} · nota média ${media}` : preenchidas;
    }
  }

  if (modulo?.tipo === 'formulario') {
    const dados = tentarParsearFormulario(resposta.resposta);
    const areaFoco = dados?.valores['area-foco'];
    if (dados && areaFoco) return `Foco escolhido: ${areaFoco}`;
    if (dados) return `${modulo.campos.length} campos preenchidos`;
  }

  return resposta.resposta;
}
