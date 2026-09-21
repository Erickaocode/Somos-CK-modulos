import type { Jovem, Modulo, Resposta } from '../../types';
import { mascararCPF } from '../../lib/cpf';
import { formatarData } from '../../lib/format';
import { tentarParsearDesejos } from '../../lib/desejos';
import { tentarParsearRodaVida } from '../../lib/rodaVida';
import ListaDesejosResumo from '../ListaDesejosResumo';
import RodaVidaResumo from '../RodaVidaResumo';

interface DetalheModalProps {
  jovem: Jovem | null;
  modulos: Modulo[];
  onFechar: () => void;
}

function renderResposta(r: Resposta, modulo: Modulo | undefined) {
  if (modulo?.tipo === 'lista-desejos') {
    const dados = tentarParsearDesejos(r.resposta);
    if (dados) return <ListaDesejosResumo dados={dados} categorias={modulo.categoriasDesejos} />;
  }

  if (modulo?.tipo === 'roda-vida') {
    const dados = tentarParsearRodaVida(r.resposta);
    if (dados) return <RodaVidaResumo dados={dados} dimensoes={modulo.dimensoesRodaVida} areas={modulo.areasRodaVida} />;
  }

  return <div className="texto">{r.resposta}</div>;
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
            return (
              <div className="resposta-admin-item" key={`${r.moduloId}-${r.data}`}>
                <div className="modulo">{modulo ? modulo.titulo : r.moduloId}</div>
                <div className="data">{formatarData(r.data)}</div>
                {renderResposta(r, modulo)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
