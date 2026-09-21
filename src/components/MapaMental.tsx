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

const RAIO_ATO = 26;
const RAIO_MODULO = 46;
const ESPALHAMENTO_MODULOS = 100;

function ponto(anguloGraus: number, raio: number) {
  const rad = (anguloGraus * Math.PI) / 180;
  return { x: 50 + raio * Math.cos(rad), y: 50 + raio * Math.sin(rad) };
}

function anguloDoModulo(anguloAto: number, indice: number, total: number) {
  if (total <= 1) return anguloAto;
  return anguloAto - ESPALHAMENTO_MODULOS / 2 + (indice / (total - 1)) * ESPALHAMENTO_MODULOS;
}

export default function MapaMental({ historico }: MapaMentalProps) {
  const [atoExpandido, setAtoExpandido] = useState<string | null>(null);
  const [avisoAtoId, setAvisoAtoId] = useState<string | null>(null);
  const [selecao, setSelecao] = useState<SelecaoModulo | null>(null);

  const anguloAtos = ATOS.map((_, i) => -90 + i * (360 / ATOS.length));

  function alternarAto(atoId: string, bloqueado: boolean, semModulos: boolean) {
    if (bloqueado || semModulos) {
      setAvisoAtoId(atoId);
      window.setTimeout(() => setAvisoAtoId((atual) => (atual === atoId ? null : atual)), 2200);
      return;
    }
    setAtoExpandido((atual) => (atual === atoId ? null : atoId));
  }

  const indiceAtoExpandido = atoExpandido ? ATOS.findIndex((a) => a.id === atoExpandido) : -1;
  const modulosExpandidos = indiceAtoExpandido >= 0 ? MODULOS.filter((m) => m.atoId === atoExpandido) : [];
  const anguloAtoExpandido = indiceAtoExpandido >= 0 ? anguloAtos[indiceAtoExpandido] : 0;
  const bloqueadoAtoExpandido =
    indiceAtoExpandido >= 0 ? atoBloqueado(indiceAtoExpandido, ATOS, MODULOS, historico) : false;
  const pontoAtoExpandido = indiceAtoExpandido >= 0 ? ponto(anguloAtoExpandido, RAIO_ATO) : null;

  return (
    <div className="mapa-mental">
      <div className="mapa-radial">
        <svg className="mapa-linhas" viewBox="0 0 100 100">
          {ATOS.map((ato, i) => {
            const p = ponto(anguloAtos[i], RAIO_ATO);
            return <line key={ato.id} className="mapa-linha" x1={50} y1={50} x2={p.x} y2={p.y} />;
          })}
          {pontoAtoExpandido &&
            modulosExpandidos.map((modulo, j) => {
              const p = ponto(anguloDoModulo(anguloAtoExpandido, j, modulosExpandidos.length), RAIO_MODULO);
              return (
                <line
                  key={modulo.id}
                  className="mapa-linha mapa-linha-modulo"
                  x1={pontoAtoExpandido.x}
                  y1={pontoAtoExpandido.y}
                  x2={p.x}
                  y2={p.y}
                />
              );
            })}
        </svg>

        <div className="mapa-centro">Seu Mapa</div>

        {ATOS.map((ato, i) => {
          const bloqueado = atoBloqueado(i, ATOS, MODULOS, historico);
          const progresso = progressoDoAto(ato, MODULOS, historico);
          const modulosDoAto = MODULOS.filter((m) => m.atoId === ato.id);
          const semModulos = modulosDoAto.length === 0;
          const p = ponto(anguloAtos[i], RAIO_ATO);
          const expandido = atoExpandido === ato.id;

          return (
            <div key={ato.id} className="mapa-no-wrap" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
              <button
                type="button"
                className={`mapa-no-ato${bloqueado ? ' bloqueado' : ''}${expandido ? ' expandido' : ''}`}
                onClick={() => alternarAto(ato.id, bloqueado, semModulos)}
              >
                <span className="mapa-no-titulo">{ato.titulo}</span>
                <span className="mapa-no-tag">
                  {bloqueado ? '🔒 Bloqueado' : semModulos ? 'Em breve' : `${progresso.concluidos}/${progresso.total} concluídos`}
                </span>
                {!bloqueado && !semModulos && (
                  <span className={`mapa-seta${expandido ? ' expandido' : ''}`}>▾</span>
                )}
              </button>

              {avisoAtoId === ato.id && (
                <div className="mapa-aviso">
                  {bloqueado ? 'Conclua o ato anterior para desbloquear este.' : 'Os módulos deste ato chegam em breve.'}
                </div>
              )}
            </div>
          );
        })}

        {pontoAtoExpandido &&
          modulosExpandidos.map((modulo, j) => {
            const p = ponto(anguloDoModulo(anguloAtoExpandido, j, modulosExpandidos.length), RAIO_MODULO);
            const resposta = historico.find((r) => r.moduloId === modulo.id);
            const concluido = !!resposta;
            const bloqueadoModulo = moduloBloqueado(modulo, MODULOS, historico, bloqueadoAtoExpandido);

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
                className={`mapa-no-orbita${bloqueadoModulo ? ' bloqueado' : ''}${concluido ? ' concluido' : ''}`}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                disabled={bloqueadoModulo || !concluido}
                title={`${modulo.titulo} — ${statusTitulo}`}
                onClick={() => resposta && setSelecao({ modulo, resposta })}
              >
                <span className="mapa-no-orbita-status">{statusIcone}</span>
                <span className="mapa-no-orbita-titulo">{modulo.titulo}</span>
              </button>
            );
          })}
      </div>

      {selecao && (
        <RespostaModal modulo={selecao.modulo} resposta={selecao.resposta} onFechar={() => setSelecao(null)} />
      )}
    </div>
  );
}
