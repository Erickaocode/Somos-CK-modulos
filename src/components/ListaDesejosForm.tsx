import { useState } from 'react';
import type { CategoriaDesejo, RespostaDesejos } from '../types';
import { MODALIDADES_CURSO, PRAZOS_DESEJO, TIPOS_PARTICIPANTE } from '../data/categoriasDesejos';

interface ListaDesejosFormProps {
  categorias: CategoriaDesejo[];
  valorInicial?: RespostaDesejos;
  onSalvar: (dados: RespostaDesejos) => void;
}

function estadoInicial(categorias: CategoriaDesejo[], valorInicial?: RespostaDesejos): RespostaDesejos {
  return {
    tipoParticipante: valorInicial?.tipoParticipante ?? '',
    modalidade: valorInicial?.modalidade ?? '',
    categorias: Object.fromEntries(
      categorias.map((c) => [c.id, valorInicial?.categorias[c.id] ?? { sonhos: '', prazo: '' }]),
    ),
  };
}

export default function ListaDesejosForm({ categorias, valorInicial, onSalvar }: ListaDesejosFormProps) {
  const [dados, setDados] = useState<RespostaDesejos>(() => estadoInicial(categorias, valorInicial));

  const podeSalvar =
    dados.tipoParticipante.trim() !== '' &&
    dados.modalidade.trim() !== '' &&
    Object.values(dados.categorias).some((c) => c.sonhos.trim() !== '');

  function atualizarCategoria(id: string, campo: 'sonhos' | 'prazo', valor: string) {
    setDados((atual) => ({
      ...atual,
      categorias: { ...atual.categorias, [id]: { ...atual.categorias[id], [campo]: valor } },
    }));
  }

  return (
    <div className="form-desejos" onClick={(e) => e.stopPropagation()}>
      <div className="form-desejos-linha">
        <div className="campo">
          <label>Tipo de participante</label>
          <select value={dados.tipoParticipante} onChange={(e) => setDados((a) => ({ ...a, tipoParticipante: e.target.value }))}>
            <option value="">Selecione...</option>
            {TIPOS_PARTICIPANTE.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

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
      </div>

      {categorias.map((categoria) => (
        <div className="categoria-desejo" key={categoria.id}>
          <div className="categoria-desejo-titulo">{categoria.titulo}</div>

          <div className="campo">
            <label>Liste de 2 a 3 sonhos nessa área</label>
            <textarea
              placeholder="Escreva seus sonhos..."
              value={dados.categorias[categoria.id].sonhos}
              onChange={(e) => atualizarCategoria(categoria.id, 'sonhos', e.target.value)}
            />
          </div>

          <div className="campo">
            <label>Prazo estimado</label>
            <select
              value={dados.categorias[categoria.id].prazo}
              onChange={(e) => atualizarCategoria(categoria.id, 'prazo', e.target.value)}
            >
              <option value="">Selecione...</option>
              {PRAZOS_DESEJO.map((prazo) => (
                <option key={prazo} value={prazo}>
                  {prazo}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <button
        className="btn btn-primario btn-pequeno"
        style={{ marginTop: 10 }}
        disabled={!podeSalvar}
        onClick={() => onSalvar(dados)}
      >
        Salvar lista de desejos
      </button>
    </div>
  );
}
