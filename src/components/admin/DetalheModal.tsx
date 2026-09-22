import type { Jovem, Modulo } from '../../types';
import { formatarCPF } from '../../lib/cpf';
import { formatarData } from '../../lib/format';
import { obterAcessosDoJovem } from '../../lib/storage';
import RespostaResumo from '../RespostaResumo';

interface DetalheModalProps {
  jovem: Jovem | null;
  modulos: Modulo[];
  onFechar: () => void;
}

export default function DetalheModal({ jovem, modulos, onFechar }: DetalheModalProps) {
  const visivel = !!jovem;
  const respostasOrdenadas = jovem
    ? jovem.respostas.slice().sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    : [];
  const acessos = jovem ? obterAcessosDoJovem(jovem.cpf) : [];

  return (
    <div
      className={`overlay${visivel ? ' visivel' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div className="modal">
        <div className="modal-topo">
          <div>
            <h2>{jovem?.nome ?? '—'}</h2>
            <p>{jovem ? formatarCPF(jovem.cpf) : '—'}</p>
          </div>
          <button className="fechar-modal" onClick={onFechar}>
            ×
          </button>
        </div>
        {acessos.length > 0 && (
          <div className="acessos-bloco">
            <div className="acessos-titulo">Histórico de acessos ({acessos.length})</div>
            <div className="acessos-lista">
              {acessos.map((a, i) => (
                <span className="acesso-item" key={`${a.data}-${i}`}>
                  {formatarData(a.data)}
                </span>
              ))}
            </div>
          </div>
        )}
        <div>
          {respostasOrdenadas.map((r) => {
            const modulo = modulos.find((m) => m.id === r.moduloId);
            return (
              <div className="resposta-admin-item" key={`${r.moduloId}-${r.data}`}>
                <div className="modulo">{modulo ? modulo.titulo : r.moduloId}</div>
                <div className="data">{formatarData(r.data)}</div>
                {modulo ? <RespostaResumo modulo={modulo} resposta={r} /> : <div className="texto">{r.resposta}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
