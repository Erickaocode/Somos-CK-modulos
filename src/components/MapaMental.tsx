import { useState } from 'react';
import type { Modulo, Resposta } from '../types';
import { ATOS, MODULOS } from '../data/modulos';
import { atoBloqueado, moduloBloqueado, progressoDoAto } from '../lib/atos';
import { trechoResposta } from '../lib/resumoResposta';
import RespostaModal from './RespostaModal';

interface MapaMentalProps {
  historico: Resposta[];
}

interface SelecaoModulo {
  modulo: Modulo;
  resposta: Resposta;
}

export default function MapaMental({ historico }: MapaMentalProps) {
  const [selecao, setSelecao] = useState<SelecaoModulo | null>(null);

  return (
    <div className="mapa-mental">
      <div className="mapa-centro-wrap">
        <div className="mapa-centro">Seu Mapa</div>
      </div>

      <div className="mapa-ramos">
        {ATOS.map((ato, indice) => {
          const bloqueadoAto = atoBloqueado(indice, ATOS, MODULOS, historico);
          const progresso = progressoDoAto(ato, MODULOS, historico);
          const modulosDoAto = MODULOS.filter((m) => m.atoId === ato.id);

          return (
            <div className="mapa-ramo" key={ato.id}>
              <div className={`mapa-no mapa-no-ato${bloqueadoAto ? ' bloqueado' : ''}`}>
                <div className="mapa-no-titulo">{ato.titulo}</div>
                <span className="mapa-no-tag">
                  {bloqueadoAto ? '🔒 Bloqueado' : progresso.total > 0 ? `${progresso.concluidos}/${progresso.total}` : 'Em breve'}
                </span>
              </div>

              {modulosDoAto.length > 0 && (
                <div className="mapa-ramos mapa-ramos--modulos">
                  {modulosDoAto.map((modulo) => {
                    const resposta = historico.find((r) => r.moduloId === modulo.id);
                    const bloqueadoModulo = moduloBloqueado(modulo, MODULOS, historico, bloqueadoAto);
                    const concluido = !!resposta;

                    return (
                      <div className="mapa-ramo" key={modulo.id}>
                        <button
                          type="button"
                          className={`mapa-no mapa-no-modulo${bloqueadoModulo ? ' bloqueado' : ''}${concluido ? ' concluido' : ''}`}
                          disabled={bloqueadoModulo || !concluido}
                          title={bloqueadoModulo ? 'Conclua os módulos anteriores para desbloquear.' : undefined}
                          onClick={() => resposta && setSelecao({ modulo, resposta })}
                        >
                          <div className="mapa-no-titulo">{modulo.titulo}</div>
                          <div className="mapa-no-trecho">
                            {bloqueadoModulo ? '🔒 Bloqueado' : concluido ? trechoResposta(modulo, resposta) : 'Pendente'}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selecao && (
        <RespostaModal modulo={selecao.modulo} resposta={selecao.resposta} onFechar={() => setSelecao(null)} />
      )}
    </div>
  );
}
