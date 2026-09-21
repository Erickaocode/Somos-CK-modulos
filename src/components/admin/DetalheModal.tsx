import type { Jovem, Modulo } from '../../types';
import { mascararCPF } from '../../lib/cpf';
import { formatarData } from '../../lib/format';
import { tentarParsearDesejos } from '../../lib/desejos';
import ListaDesejosResumo from '../ListaDesejosResumo';

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
            <p>{jovem ? mascararCPF(jovem.cpf) : '—'}</p>
          </div>
          <button className="fechar-modal" onClick={onFechar}>
            ×
          </button>
        </div>
        <div>
          {respostasOrdenadas.map((r) => {
            const modulo = modulos.find((m) => m.id === r.moduloId);
            const dadosDesejos = modulo?.categoriasDesejos ? tentarParsearDesejos(r.resposta) : null;
            return (
              <div className="resposta-admin-item" key={`${r.moduloId}-${r.data}`}>
                <div className="modulo">{modulo ? modulo.titulo : r.moduloId}</div>
                <div className="data">{formatarData(r.data)}</div>
                {dadosDesejos && modulo?.categoriasDesejos ? (
                  <ListaDesejosResumo dados={dadosDesejos} categorias={modulo.categoriasDesejos} />
                ) : (
                  <div className="texto">{r.resposta}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
