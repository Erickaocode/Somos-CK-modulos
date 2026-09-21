import { useState } from 'react';
import type { AreaRodaVida, DimensaoRodaVida, RespostaRodaVida } from '../types';
import { MODALIDADES_CURSO } from '../data/categoriasDesejos';

interface RodaVidaFormProps {
  dimensoes: DimensaoRodaVida[];
  areas: AreaRodaVida[];
  valorInicial?: RespostaRodaVida;
  onSalvar: (dados: RespostaRodaVida) => void;
}

function estadoInicial(areas: AreaRodaVida[], valorInicial?: RespostaRodaVida): RespostaRodaVida {
  return {
    modalidade: valorInicial?.modalidade ?? '',
    areas: Object.fromEntries(
      areas.map((a) => [a.id, valorInicial?.areas[a.id] ?? { nota: 0, reflexao: '' }]),
    ),
  };
}

export default function RodaVidaForm({ dimensoes, areas, valorInicial, onSalvar }: RodaVidaFormProps) {
  const [dados, setDados] = useState<RespostaRodaVida>(() => estadoInicial(areas, valorInicial));

  const podeSalvar =
    dados.modalidade.trim() !== '' && Object.values(dados.areas).some((a) => a.nota > 0 || a.reflexao.trim() !== '');

  function atualizarArea(id: string, campo: 'nota' | 'reflexao', valor: string | number) {
    setDados((atual) => ({
      ...atual,
      areas: { ...atual.areas, [id]: { ...atual.areas[id], [campo]: valor } },
    }));
  }

  return (
    <div className="form-desejos" onClick={(e) => e.stopPropagation()}>
      <div className="campo">
        <label>Modalidade do curso</label>
        <select value={dados.modalidade} onChange={(e) => setDados((a) => ({ ...a, modalidade: e.target.value }))}>
          <option value="">Selecione...</option>
          {MODALIDADES_CURSO.map((modalidade) => (
            <option key={modalidade} value={modalidade}>
              {modalidade}
            </option>
          ))}
        </select>
      </div>

      {dimensoes.map((dimensao) => (
        <div key={dimensao.id}>
          <div className="categoria-desejo-titulo" style={{ marginTop: 20 }}>
            {dimensao.titulo}
          </div>

          {areas
            .filter((area) => area.dimensaoId === dimensao.id)
            .map((area) => (
              <div className="area-roda-vida" key={area.id}>
                <div className="area-roda-vida-titulo">{area.titulo}</div>
                <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--cinza-700)' }}>{area.reflexao}</p>

                <div className="campo">
                  <label>
                    Nota de satisfação: <strong>{dados.areas[area.id].nota}</strong> / 10
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={dados.areas[area.id].nota}
                    onChange={(e) => atualizarArea(area.id, 'nota', Number(e.target.value))}
                  />
                </div>

                <div className="campo">
                  <label>O que falta para essa nota subir?</label>
                  <textarea
                    placeholder="Escreva sua reflexão..."
                    value={dados.areas[area.id].reflexao}
                    onChange={(e) => atualizarArea(area.id, 'reflexao', e.target.value)}
                  />
                </div>
              </div>
            ))}
        </div>
      ))}

      <button
        className="btn btn-primario btn-pequeno"
        style={{ marginTop: 10 }}
        disabled={!podeSalvar}
        onClick={() => onSalvar(dados)}
      >
        Salvar roda da vida
      </button>
    </div>
  );
}
