import { useState } from 'react';
import type { Ato, Modulo, Resposta } from '../types';
import { atoBloqueado, moduloBloqueado, progressoDoAto } from '../lib/atos';
import { trechoResposta } from '../lib/resumoResposta';
import RespostaModal from './RespostaModal';

interface MapaMentalProps {
  atos: Ato[];
  modulos: Modulo[];
  historico: Resposta[];
}

interface SelecaoModulo {
  modulo: Modulo;
  resposta: Resposta;
}

interface Ponto {
  x: number;
  y: number;
}

const RAIO_ATO = 22;
const RAIO_MODULO_DESEJADO = 34;
const MARGEM_SEGURA = 9;
const OFFSET_MINIMO = 24;
const PASSO_INCREMENTO = 16;
const FOLGA_TOPO = 11;
const FOLGA_BASE = 17;

function ponto(anguloGraus: number, raio: number, origem: Ponto = { x: 50, y: 50 }): Ponto {
  const rad = (anguloGraus * Math.PI) / 180;
  return { x: origem.x + raio * Math.cos(rad), y: origem.y + raio * Math.sin(rad) };
}

// Afasta cada módulo do ângulo do próprio Ato (nunca alinhado com ele, senão
// ficaria colado ao nó do Ato) e usa um deslocamento diferente por módulo
// (não espelhado aos pares) para que as linhas nunca fiquem retas/alinhadas
// por coincidência — sempre com aquele ângulo torto de mapa mental.
function anguloDoModulo(anguloAto: number, indice: number) {
  const sinal = indice % 2 === 0 ? 1 : -1;
  const offset = OFFSET_MINIMO + indice * PASSO_INCREMENTO;
  return anguloAto + sinal * offset;
}

// Raio máximo, a partir do próprio nó do Ato, que ainda mantém o módulo
// dentro da área segura do mapa (evita cortar nas bordas em qualquer direção).
function raioLocalSeguro(origem: Ponto, anguloGraus: number, desejado: number) {
  const rad = (anguloGraus * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const limiteX = cos > 0.001 ? (100 - MARGEM_SEGURA - origem.x) / cos : cos < -0.001 ? (MARGEM_SEGURA - origem.x) / cos : Infinity;
  const limiteY = sin > 0.001 ? (100 - MARGEM_SEGURA - origem.y) / sin : sin < -0.001 ? (MARGEM_SEGURA - origem.y) / sin : Infinity;
  return Math.min(desejado, limiteX, limiteY);
}

export default function MapaMental({ atos, modulos, historico }: MapaMentalProps) {
  const [atoExpandido, setAtoExpandido] = useState<string | null>(null);
  const [avisoAtoId, setAvisoAtoId] = useState<string | null>(null);
  const [selecao, setSelecao] = useState<SelecaoModulo | null>(null);

  const atosVisiveis = atos.filter((_, i) => !atoBloqueado(i, atos, modulos, historico));
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
  const modulosExpandidos = indiceAtoExpandido >= 0 ? modulos.filter((m) => m.atoId === atoExpandido) : [];
  const anguloAtoExpandido = indiceAtoExpandido >= 0 ? anguloAtos[indiceAtoExpandido] : 0;
  const pontoAtoExpandido = indiceAtoExpandido >= 0 ? ponto(anguloAtoExpandido, RAIO_ATO) : null;

  const modulosPosicionados = pontoAtoExpandido
    ? modulosExpandidos.map((modulo, j) => {
        const angulo = anguloDoModulo(anguloAtoExpandido, j);
        const raio = raioLocalSeguro(pontoAtoExpandido, angulo, RAIO_MODULO_DESEJADO);
        return { modulo, ponto: ponto(angulo, raio, pontoAtoExpandido) };
      })
    : [];

  const atoPontos = atosVisiveis.map((_, i) => ponto(anguloAtos[i], RAIO_ATO));

  // O mapa só mostra a faixa vertical realmente usada pelos nós (com uma
  // folga), em vez de sempre ocupar um quadrado inteiro — evita sobrar
  // fundo roxo vazio quando poucos Atos ou módulos estão em tela.
  const todosOsY = [50, ...atoPontos.map((p) => p.y), ...modulosPosicionados.map((m) => m.ponto.y)];
  const yMin = Math.max(0, Math.min(...todosOsY) - FOLGA_TOPO);
  const yMax = Math.min(100, Math.max(...todosOsY) + FOLGA_BASE);
  const altura = yMax - yMin;

  function paraTop(y: number) {
    return ((y - yMin) / altura) * 100;
  }

  return (
    <div className="mapa-mental">
      <div className="mapa-radial" style={{ aspectRatio: `100 / ${altura}` }}>
        <svg className="mapa-linhas" viewBox={`0 ${yMin} 100 ${altura}`}>
          {atosVisiveis.map((ato, i) => {
            const p = atoPontos[i];
            return <line key={ato.id} className="mapa-linha" x1={50} y1={50} x2={p.x} y2={p.y} />;
          })}
          {pontoAtoExpandido &&
            modulosPosicionados.map(({ modulo, ponto: p }) => (
              <line
                key={modulo.id}
                className="mapa-linha mapa-linha-modulo"
                x1={pontoAtoExpandido.x}
                y1={pontoAtoExpandido.y}
                x2={p.x}
                y2={p.y}
              />
            ))}
        </svg>

        <div className="mapa-centro" style={{ top: `${paraTop(50)}%` }}>
          Seu Mapa
        </div>

        {atosVisiveis.map((ato, i) => {
          const progresso = progressoDoAto(ato, modulos, historico);
          const modulosDoAto = modulos.filter((m) => m.atoId === ato.id);
          const semModulos = modulosDoAto.length === 0;
          const p = atoPontos[i];
          const expandido = atoExpandido === ato.id;

          return (
            <div key={ato.id} className="mapa-no-wrap" style={{ left: `${p.x}%`, top: `${paraTop(p.y)}%` }}>
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

        {modulosPosicionados.map(({ modulo, ponto: p }) => {
          const resposta = historico.find((r) => r.moduloId === modulo.id);
          const concluido = !!resposta;
          const bloqueadoModulo = moduloBloqueado(modulo, modulos, historico, false);

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
              style={{ left: `${p.x}%`, top: `${paraTop(p.y)}%` }}
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
