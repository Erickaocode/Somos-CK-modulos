import type { CategoriaDesejo, RespostaDesejos } from '../types';

interface ListaDesejosResumoProps {
  dados: RespostaDesejos;
  categorias: CategoriaDesejo[];
}

export default function ListaDesejosResumo({ dados, categorias }: ListaDesejosResumoProps) {
  const preenchidas = categorias.filter((c) => dados.categorias[c.id]?.sonhos.trim());

  return (
    <div className="resposta-salva">
      <div className="desejos-resumo-cabecalho">
        {dados.tipoParticipante} · {dados.modalidade}
      </div>

      {preenchidas.length === 0 ? (
        <p style={{ margin: '8px 0 0' }}>Nenhum sonho preenchido ainda.</p>
      ) : (
        preenchidas.map((categoria) => {
          const resposta = dados.categorias[categoria.id];
          return (
            <div className="desejos-resumo-categoria" key={categoria.id}>
              <span className="desejos-resumo-categoria-titulo">{categoria.titulo}</span>
              {resposta.prazo && <span className="status-pill status-pendente">{resposta.prazo}</span>}
              <div>{resposta.sonhos}</div>
            </div>
          );
        })
      )}
    </div>
  );
}
