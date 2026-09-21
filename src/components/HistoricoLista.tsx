import type { Modulo, Resposta } from '../types';
import { formatarData } from '../lib/format';
import { contarSonhosPreenchidos, tentarParsearDesejos } from '../lib/desejos';

interface HistoricoListaProps {
  historico: Resposta[];
  modulos: Modulo[];
}

function trechoDaResposta(r: Resposta, modulo: Modulo | undefined): string {
  if (modulo?.categoriasDesejos) {
    const dados = tentarParsearDesejos(r.resposta);
    if (dados) {
      const total = modulo.categoriasDesejos.length;
      return `${contarSonhosPreenchidos(dados)} de ${total} áreas preenchidas`;
    }
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
