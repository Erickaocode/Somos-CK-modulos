import type { Modulo, Resposta } from '../types';
import { formatarData } from '../lib/format';
import RespostaResumo from './RespostaResumo';

interface RespostaModalProps {
  modulo: Modulo;
  resposta: Resposta;
  onFechar: () => void;
}

export default function RespostaModal({ modulo, resposta, onFechar }: RespostaModalProps) {
  return (
    <div
      className="overlay visivel"
      onClick={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div className="modal">
        <div className="modal-topo">
          <div>
            <h2>{modulo.titulo}</h2>
            <p>{formatarData(resposta.data)}</p>
          </div>
          <button className="fechar-modal" onClick={onFechar}>
            ×
          </button>
        </div>
        <RespostaResumo modulo={modulo} resposta={resposta} />
      </div>
    </div>
  );
}
