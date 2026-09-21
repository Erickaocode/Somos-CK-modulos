import { useState } from 'react';
import type { CampoFormulario, RespostaFormulario } from '../types';
import { MODALIDADES_CURSO } from '../data/categoriasDesejos';

interface FormularioGenericoFormProps {
  campos: CampoFormulario[];
  incluirModalidade?: boolean;
  valorInicial?: RespostaFormulario;
  onSalvar: (dados: RespostaFormulario) => void;
}

function opcoesSelecionadas(valor: string): string[] {
  return valor ? valor.split(', ').filter(Boolean) : [];
}

function estadoInicial(campos: CampoFormulario[], valorInicial?: RespostaFormulario): RespostaFormulario {
  return {
    modalidade: valorInicial?.modalidade ?? '',
    valores: Object.fromEntries(campos.map((c) => [c.id, valorInicial?.valores[c.id] ?? ''])),
  };
}

export default function FormularioGenericoForm({
  campos,
  incluirModalidade,
  valorInicial,
  onSalvar,
}: FormularioGenericoFormProps) {
  const [dados, setDados] = useState<RespostaFormulario>(() => estadoInicial(campos, valorInicial));

  const podeSalvar =
    (!incluirModalidade || dados.modalidade.trim() !== '') && campos.every((c) => dados.valores[c.id].trim() !== '');

  function atualizarCampo(id: string, valor: string) {
    setDados((atual) => ({ ...atual, valores: { ...atual.valores, [id]: valor } }));
  }

  function alternarOpcaoMultipla(campo: CampoFormulario, opcao: string) {
    const selecionadas = opcoesSelecionadas(dados.valores[campo.id]);
    const jaMarcada = selecionadas.includes(opcao);

    if (!jaMarcada && campo.maximoSelecoes && selecionadas.length >= campo.maximoSelecoes) return;

    const novaSelecao = jaMarcada ? selecionadas.filter((o) => o !== opcao) : [...selecionadas, opcao];
    atualizarCampo(campo.id, novaSelecao.join(', '));
  }

  return (
    <div className="form-desejos" onClick={(e) => e.stopPropagation()}>
      {incluirModalidade && (
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
      )}

      {campos.map((campo) => (
        <div className="campo" key={campo.id}>
          <label>
            {campo.label}
            {campo.tipo === 'multi-select' && campo.maximoSelecoes && ` (escolha até ${campo.maximoSelecoes})`}
          </label>
          {campo.tipo === 'select' && (
            <select value={dados.valores[campo.id]} onChange={(e) => atualizarCampo(campo.id, e.target.value)}>
              <option value="">Selecione...</option>
              {campo.opcoes?.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              ))}
            </select>
          )}
          {campo.tipo === 'multi-select' && (
            <div className="opcoes-multi-select">
              {campo.opcoes?.map((opcao) => (
                <label key={opcao} className="opcao-checkbox">
                  <input
                    type="checkbox"
                    checked={opcoesSelecionadas(dados.valores[campo.id]).includes(opcao)}
                    onChange={() => alternarOpcaoMultipla(campo, opcao)}
                  />
                  {opcao}
                </label>
              ))}
            </div>
          )}
          {campo.tipo === 'texto' && (
            <textarea
              placeholder="Escreva sua resposta..."
              value={dados.valores[campo.id]}
              onChange={(e) => atualizarCampo(campo.id, e.target.value)}
            />
          )}
        </div>
      ))}

      <button
        className="btn btn-primario btn-pequeno"
        style={{ marginTop: 10 }}
        disabled={!podeSalvar}
        onClick={() => onSalvar(dados)}
      >
        Salvar resposta
      </button>
    </div>
  );
}
