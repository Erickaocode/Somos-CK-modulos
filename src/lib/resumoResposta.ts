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

/** Texto completo (não truncado) de uma resposta, usado na exportação para planilha. */
export function textoCompletoResposta(modulo: Modulo | undefined, resposta: Resposta): string {
  if (modulo?.tipo === 'lista-desejos') {
    const dados = tentarParsearDesejos(resposta.resposta);
    if (dados) {
      const partes = Object.entries(dados.categorias)
        .filter(([, c]) => c.sonhos.trim())
        .map(([categoriaId, c]) => {
          const categoria = modulo.categoriasDesejos.find((cat) => cat.id === categoriaId);
          return `${categoria?.titulo ?? categoriaId}: ${c.sonhos} (prazo: ${c.prazo || 'não informado'})`;
        });
      return [`Tipo: ${dados.tipoParticipante}`, `Modalidade: ${dados.modalidade}`, ...partes].join(' | ');
    }
  }

  if (modulo?.tipo === 'roda-vida') {
    const dados = tentarParsearRodaVida(resposta.resposta);
    if (dados) {
      const partes = Object.entries(dados.areas)
        .filter(([, a]) => a.nota > 0 || a.reflexao.trim())
        .map(([areaId, a]) => {
          const area = modulo.areasRodaVida.find((ar) => ar.id === areaId);
          return `${area?.titulo ?? areaId}: nota ${a.nota}${a.reflexao ? ` — ${a.reflexao}` : ''}`;
        });
      return [`Modalidade: ${dados.modalidade}`, ...partes].join(' | ');
    }
  }

  if (modulo?.tipo === 'formulario') {
    const dados = tentarParsearFormulario(resposta.resposta);
    if (dados) {
      const cabecalho = modulo.incluirModalidade && dados.modalidade ? [`Modalidade: ${dados.modalidade}`] : [];
      const partes = modulo.campos
        .filter((c) => dados.valores[c.id]?.trim())
        .map((c) => `${c.label}: ${dados.valores[c.id]}`);
      return [...cabecalho, ...partes].join(' | ');
    }
  }

  return resposta.resposta;
}
