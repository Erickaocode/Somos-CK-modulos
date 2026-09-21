import type { Modulo, Resposta } from '../types';
import { formatarData } from '../lib/format';
import { contarSonhosPreenchidos, tentarParsearDesejos } from '../lib/desejos';
import { areasPreenchidas, mediaGeral, tentarParsearRodaVida } from '../lib/rodaVida';
import { tentarParsearFormulario } from '../lib/formularioGenerico';

interface HistoricoListaProps {
  historico: Resposta[];
  modulos: Modulo[];
}

function trechoDaResposta(r: Resposta, modulo: Modulo | undefined): string {
  if (modulo?.tipo === 'lista-desejos') {
    const dados = tentarParsearDesejos(r.resposta);
    if (dados) {
      return `${contarSonhosPreenchidos(dados)} de ${modulo.categoriasDesejos.length} áreas preenchidas`;
    }
  }

  if (modulo?.tipo === 'roda-vida') {
    const dados = tentarParsearRodaVida(r.resposta);
    if (dados) {
      const media = mediaGeral(dados);
      const preenchidas = `${areasPreenchidas(dados)} de ${modulo.areasRodaVida.length} áreas avaliadas`;
      return media !== null ? `${preenchidas} · nota média ${media}` : preenchidas;
    }
  }

  if (modulo?.tipo === 'formulario') {
    const dados = tentarParsearFormulario(r.resposta);
    const areaFoco = dados?.valores['area-foco'];
    if (dados && areaFoco) return `Foco escolhido: ${areaFoco}`;
    if (dados) return `${modulo.campos.length} campos preenchidos`;
  }

  return r.resposta;
}

export default function HistoricoLista({ historico, modulos }: HistoricoListaProps) {
  if (historico.length === 0) {
    return <div className="vazio">Suas respostas aparecerão aqui assim que você concluir o primeiro módulo.</div>;
  }

  return (
    <>
      {historico.map((r) => {
        const modulo = modulos.find((m) => m.id === r.moduloId);
        return (
          <div className="historico-item" key={`${r.moduloId}-${r.data}`}>
            <div className="historico-modulo">{modulo ? modulo.titulo : r.moduloId}</div>
            <div className="historico-data">{formatarData(r.data)}</div>
            <div className="historico-trecho">{trechoDaResposta(r, modulo)}</div>
          </div>
        );
      })}
    </>
  );
}
