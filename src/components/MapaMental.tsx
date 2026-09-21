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

const RAIO_ATO = 30;

function ponto(anguloGraus: number, raio: number) {
  const rad = (anguloGraus * Math.PI) / 180;
  return { x: 50 + raio * Math.cos(rad), y: 50 + raio * Math.sin(rad) };
}

export default function MapaMental({ historico }: MapaMentalProps) {
  const [atoExpandido, setAtoExpandido] = useState<string | null>(null);
  const [avisoAtoId, setAvisoAtoId] = useState<string | null>(null);
  const [selecao, setSelecao] = useState<SelecaoModulo | null>(null);

  const atosVisiveis = ATOS.filter((_, i) => !atoBloqueado(i, ATOS, MODULOS, historico));
  const anguloAtos = atosVisiveis.map((_, i) => -90 + i * (360 / atosVisiveis.length));

  function alternarAto(atoId: string, semModulos: boolean) {
    if (semModulos) {
      setAvisoAtoId(atoId);
      window.setTimeout(() => setAvisoAtoId((atual) => (atual === atoId ? null : atual)), 2200);
      return;
    }
    setAtoExpandido((atual) => (atual === atoId ? null : atoId));
  }

  const atoAtual = atosVisiveis.find((a) => a.id === atoExpandido) ?? null;
  const modulosDoAtoAtual = atoAtual ? MODULOS.filter((m) => m.atoId === atoAtual.id) : [];

  return (
    <div className="mapa-mental">
      <div className="mapa-radial">
        <svg className="mapa-linhas" viewBox="0 0 100 100">
          {atosVisiveis.map((ato, i) => {
            const p = ponto(anguloAtos[i], RAIO_ATO);
            return <line key={ato.id} className="mapa-linha" x1={50} y1={50} x2={p.x} y2={p.y} />;
          })}
        </svg>

        <div className="mapa-centro">Seu Mapa</div>

        {atosVisiveis.map((ato, i) => {
          const progresso = progressoDoAto(ato, MODULOS, historico);
          const modulosDoAto = MODULOS.filter((m) => m.atoId === ato.id);
          const semModulos = modulosDoAto.length === 0;
          const p = ponto(anguloAtos[i], RAIO_ATO);
          const expandido = atoExpandido === ato.id;

          return (
            <div key={ato.id} className="mapa-no-wrap" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
              <button
                type="button"
                className={`mapa-no-ato${expandido ? ' expandido' : ''}`}
                onClick={() => alternarAto(ato.id, semModulos)}
              >
                <span className="mapa-no-titulo">{ato.titulo}</span>
                <span className="mapa-no-tag">
                  {semModulos ? 'Em breve' : `${progresso.concluidos}/${progresso.total} concluídos`}
                </span>
                {!semModulos && <span className={`mapa-seta${expandido ? ' expandido' : ''}`}>▾</span>}
              </button>

              {avisoAtoId === ato.id && <div className="mapa-aviso">Os módulos deste ato chegam em breve.</div>}
            </div>
          );
        })}
      </div>

      {atoAtual && (
        <div className="mapa-drawer">
          <div className="mapa-drawer-titulo">Módulos de {atoAtual.titulo}</div>
          <div className="mapa-drawer-modulos">
            {modulosDoAtoAtual.map((modulo) => {
              const resposta = historico.find((r) => r.moduloId === modulo.id);
              const concluido = !!resposta;
              const bloqueadoModulo = moduloBloqueado(modulo, MODULOS, historico, false);

              const statusIcone = bloqueadoModulo ? '🔒' : concluido ? '✓' : '○';
              const statusTitulo = bloqueadoModulo
                ? 'Bloqueado — conclua os módulos anteriores.'
                : concluido
                  ? trechoResposta(modulo, resposta)
                  : 'Pendente';

              return (
                <button
                  key={modulo.id}
                  type="button"
                  className={`mapa-chip${bloqueadoModulo ? ' bloqueado' : ''}${concluido ? ' concluido' : ''}`}
                  disabled={bloqueadoModulo || !concluido}
                  title={`${modulo.titulo} — ${statusTitulo}`}
                  onClick={() => resposta && setSelecao({ modulo, resposta })}
                >
                  <span className="mapa-chip-status">{statusIcone}</span>
                  <span className="mapa-chip-titulo">{modulo.titulo}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selecao && (
        <RespostaModal modulo={selecao.modulo} resposta={selecao.resposta} onFechar={() => setSelecao(null)} />
      )}
    </div>
  );
}
