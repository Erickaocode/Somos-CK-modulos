import { useState } from 'react';
import type { Modulo, Resposta } from '../types';
import { ATOS, MODULOS } from '../data/modulos';
import { trechoResposta } from '../lib/resumoResposta';
import RespostaModal from './RespostaModal';

interface MapaMentalProps {
  historico: Resposta[];
}

interface SelecaoModulo {
  modulo: Modulo;
  resposta: Resposta;
}

function posicaoOrbital(indice: number, total: number, raio: number) {
  const angulo = (indice / total) * 2 * Math.PI - Math.PI / 2;
  return {
    x: 50 + raio * Math.cos(angulo),
    y: 50 + raio * Math.sin(angulo),
  };
}

export default function MapaMental({ historico }: MapaMentalProps) {
  const [selecao, setSelecao] = useState<SelecaoModulo | null>(null);

  const concluidos = MODULOS.map((modulo) => {
    const resposta = historico.find((r) => r.moduloId === modulo.id);
    return resposta ? { modulo, resposta } : null;
  }).filter((item): item is SelecaoModulo => item !== null);

  const total = concluidos.length;
  const raio = Math.min(38, 20 + total * 3);
  const tamanhoContainer = Math.min(580, 260 + total * 40);

  return (
    <div className="mapa-mental">
      {total === 0 ? (
        <div className="mapa-radial mapa-radial--vazio">
          <div className="mapa-centro mapa-centro--estatico">Seu Mapa</div>
          <p className="mapa-radial-dica">
            Seu mapa vai se formar aqui conforme você for concluindo os módulos.
          </p>
        </div>
      ) : (
        <div className="mapa-radial" style={{ maxWidth: tamanhoContainer }}>
          <svg className="mapa-linhas" viewBox="0 0 100 100">
            {concluidos.map(({ modulo }, indice) => {
              const { x, y } = posicaoOrbital(indice, total, raio);
              return <line key={modulo.id} x1={50} y1={50} x2={x} y2={y} />;
            })}
          </svg>

          <div className="mapa-centro">Seu Mapa</div>

          {concluidos.map(({ modulo, resposta }, indice) => {
            const { x, y } = posicaoOrbital(indice, total, raio);
            const ato = ATOS.find((a) => a.id === modulo.atoId);

            return (
              <button
                key={modulo.id}
                type="button"
                className="mapa-no-orbita"
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => setSelecao({ modulo, resposta })}
              >
                <span className="mapa-no-orbita-ato">{ato?.titulo}</span>
                <span className="mapa-no-orbita-titulo">{modulo.titulo}</span>
                <span className="mapa-no-orbita-trecho">{trechoResposta(modulo, resposta)}</span>
              </button>
            );
          })}
        </div>
      )}

      {selecao && (
        <RespostaModal modulo={selecao.modulo} resposta={selecao.resposta} onFechar={() => setSelecao(null)} />
      )}
    </div>
  );
}
