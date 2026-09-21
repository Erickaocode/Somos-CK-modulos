import type { AreaRodaVida, DimensaoRodaVida, RespostaRodaVida } from '../types';
import { mediaGeral } from '../lib/rodaVida';

interface RodaVidaResumoProps {
  dados: RespostaRodaVida;
  dimensoes: DimensaoRodaVida[];
  areas: AreaRodaVida[];
}

export default function RodaVidaResumo({ dados, dimensoes, areas }: RodaVidaResumoProps) {
  const media = mediaGeral(dados);
  const areasComNota = areas.filter((a) => dados.areas[a.id]?.nota > 0 || dados.areas[a.id]?.reflexao.trim());

  return (
    <div className="resposta-salva">
      <div className="desejos-resumo-cabecalho">
        {dados.modalidade}
        {media !== null && ` · Nota média: ${media} / 10`}
      </div>

      {areasComNota.length === 0 ? (
        <p style={{ margin: '8px 0 0' }}>Nenhuma área avaliada ainda.</p>
      ) : (
        dimensoes.map((dimensao) => {
          const areasDaDimensao = areasComNota.filter((a) => a.dimensaoId === dimensao.id);
          if (areasDaDimensao.length === 0) return null;
          return (
            <div key={dimensao.id} className="desejos-resumo-categoria">
              <span className="desejos-resumo-categoria-titulo">{dimensao.titulo}</span>
              {areasDaDimensao.map((area) => {
                const resposta = dados.areas[area.id];
                return (
                  <div key={area.id} className="area-roda-vida-resumo">
                    <span className="status-pill status-pendente">
                      {area.titulo}: {resposta.nota}/10
                    </span>
                    {resposta.reflexao && <div>{resposta.reflexao}</div>}
                  </div>
                );
              })}
            </div>
          );
        })
      )}
    </div>
  );
}
