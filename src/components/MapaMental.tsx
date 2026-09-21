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

const RAIO_ATO = 24;
const RAIO_MODULO_DESEJADO = 60;
const MARGEM_SEGURA = 11;
const OFFSET_MINIMO = 30;
const PASSO_ENTRE_PARES = 28;

function ponto(anguloGraus: number, raio: number) {
  const rad = (anguloGraus * Math.PI) / 180;
  return { x: 50 + raio * Math.cos(rad), y: 50 + raio * Math.sin(rad) };
}

// Afasta cada módulo do ângulo do próprio Ato (nunca alinhado com ele, senão
// ficaria colado ao nó do Ato), alternando para os dois lados e abrindo mais
// a cada par para não empilhar módulos vizinhos.
function anguloDoModulo(anguloAto: number, indice: number) {
  const par = Math.floor(indice / 2);
  const sinal = indice % 2 === 0 ? 1 : -1;
  const offset = OFFSET_MINIMO + par * PASSO_ENTRE_PARES;
  return anguloAto + sinal * offset;
}

function raioSeguro(anguloGraus: number, desejado: number) {
  const rad = (anguloGraus * Math.PI) / 180;
  const limite = 50 - MARGEM_SEGURA;
  const maxX = limite / Math.abs(Math.cos(rad));
  const maxY = limite / Math.abs(Math.sin(rad));
  return Math.min(desejado, maxX, maxY);
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

  const indiceAtoExpandido = atoExpandido ? atosVisiveis.findIndex((a) => a.id === atoExpandido) : -1;
  const modulosExpandidos = indiceAtoExpandido >= 0 ? MODULOS.filter((m) => m.atoId === atoExpandido) : [];
  const anguloAtoExpandido = indiceAtoExpandido >= 0 ? anguloAtos[indiceAtoExpandido] : 0;
  const pontoAtoExpandido = indiceAtoExpandido >= 0 ? ponto(anguloAtoExpandido, RAIO_ATO) : null;

  return (
    <div className="mapa-mental">
      <div className="mapa-radial">
        <svg className="mapa-linhas" viewBox="0 0 100 100">
          {atosVisiveis.map((ato, i) => {
            const p = ponto(anguloAtos[i], RAIO_ATO);
            return <line key={ato.id} className="mapa-linha" x1={50} y1={50} x2={p.x} y2={p.y} />;
          })}
          {pontoAtoExpandido &&
            modulosExpandidos.map((modulo, j) => {
              const angulo = anguloDoModulo(anguloAtoExpandido, j);
              const p = ponto(angulo, raioSeguro(angulo, RAIO_MODULO_DESEJADO));
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

        {pontoAtoExpandido &&
          modulosExpandidos.map((modulo, j) => {
            const angulo = anguloDoModulo(anguloAtoExpandido, j);
            const p = ponto(angulo, raioSeguro(angulo, RAIO_MODULO_DESEJADO));
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
                className={`mapa-chip mapa-chip--orbita${bloqueadoModulo ? ' bloqueado' : ''}${concluido ? ' concluido' : ''}`}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
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

      {selecao && (
        <RespostaModal modulo={selecao.modulo} resposta={selecao.resposta} onFechar={() => setSelecao(null)} />
      )}
    </div>
  );
}
