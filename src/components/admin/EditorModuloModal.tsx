import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { CampoFormulario, MaterialModulo, Modulo } from '../../types';
import { gerarIdCampo } from '../../lib/edicoesModulos';

const TAMANHO_MAXIMO_MATERIAL = 8 * 1024 * 1024; // 8 MB — limite prático para caber no localStorage

function formatarTamanho(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface EditorModuloModalProps {
  modulo: Modulo;
  temEdicaoSalva: boolean;
  modoNovo?: boolean;
  onFechar: () => void;
  onSalvar: (modulo: Modulo) => void;
  onRestaurarPadrao: () => void;
  onExcluir?: () => void;
}

interface CampoEditavel extends CampoFormulario {
  opcoesTexto: string;
}

function campoParaEditavel(campo: CampoFormulario): CampoEditavel {
  return { ...campo, opcoesTexto: (campo.opcoes ?? []).join('\n') };
}

export default function EditorModuloModal({
  modulo,
  temEdicaoSalva,
  modoNovo,
  onFechar,
  onSalvar,
  onRestaurarPadrao,
  onExcluir,
}: EditorModuloModalProps) {
  const [titulo, setTitulo] = useState(modulo.titulo);
  const [descricao, setDescricao] = useState(modulo.descricao);
  const [pergunta, setPergunta] = useState(modulo.pergunta);
  const [campos, setCampos] = useState<CampoEditavel[]>(
    modulo.tipo === 'formulario' ? modulo.campos.map(campoParaEditavel) : [],
  );
  const [material, setMaterial] = useState<MaterialModulo | undefined>(modulo.material);
  const [erroMaterial, setErroMaterial] = useState('');

  function handleSelecionarArquivo(e: ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    e.target.value = '';
    if (!arquivo) return;

    if (arquivo.size > TAMANHO_MAXIMO_MATERIAL) {
      setErroMaterial(`Arquivo muito grande (${formatarTamanho(arquivo.size)}). O limite é ${formatarTamanho(TAMANHO_MAXIMO_MATERIAL)}.`);
      return;
    }

    setErroMaterial('');
    const leitor = new FileReader();
    leitor.onload = () => {
      setMaterial({ nome: arquivo.name, tipoArquivo: arquivo.type || 'application/octet-stream', dadosUrl: String(leitor.result) });
    };
    leitor.readAsDataURL(arquivo);
  }

  function atualizarCampo(indice: number, dados: Partial<CampoEditavel>) {
    setCampos((atual) => atual.map((c, i) => (i === indice ? { ...c, ...dados } : c)));
  }

  function removerCampo(indice: number) {
    setCampos((atual) => atual.filter((_, i) => i !== indice));
  }

  function adicionarCampo() {
    setCampos((atual) => [...atual, { id: '', label: '', tipo: 'texto', opcoesTexto: '' }]);
  }

  function handleSalvar() {
    const idsExistentes = campos.filter((c) => c.id).map((c) => c.id);
    const camposFinal: CampoFormulario[] = campos
      .filter((c) => c.label.trim())
      .map((c) => {
        const id = c.id || gerarIdCampo(c.label, idsExistentes);
        if (!c.id) idsExistentes.push(id);
        const campoFinal: CampoFormulario = { id, label: c.label.trim(), tipo: c.tipo };
        if (c.tipo !== 'texto') {
          campoFinal.opcoes = c.opcoesTexto
            .split('\n')
            .map((o) => o.trim())
            .filter(Boolean);
        }
        if (c.tipo === 'multi-select' && c.maximoSelecoes) {
          campoFinal.maximoSelecoes = c.maximoSelecoes;
        }
        return campoFinal;
      });

    const moduloEditado: Modulo =
      modulo.tipo === 'formulario'
        ? { ...modulo, titulo: titulo.trim(), descricao: descricao.trim(), pergunta: pergunta.trim(), campos: camposFinal }
        : { ...modulo, titulo: titulo.trim(), descricao: descricao.trim(), pergunta: pergunta.trim() };

    moduloEditado.material = material;

    onSalvar(moduloEditado);
  }

  const podeSalvar = titulo.trim() !== '' && descricao.trim() !== '' && pergunta.trim() !== '';

  return (
    <div
      className="overlay visivel"
      onClick={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div className="modal modal-editor">
        <div className="modal-topo">
          <div>
            <h2>{modoNovo ? 'Novo módulo' : 'Editar módulo'}</h2>
            <p>{modulo.titulo || 'Preencha os campos abaixo'}</p>
          </div>
          <button className="fechar-modal" onClick={onFechar}>
            ×
          </button>
        </div>

        <div className="campo">
          <label>Título</label>
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>
        <div className="campo">
          <label>Descrição (mostrada na listagem)</label>
          <textarea rows={2} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        </div>
        <div className="campo">
          <label>Pergunta / instrução principal</label>
          <textarea rows={2} value={pergunta} onChange={(e) => setPergunta(e.target.value)} />
        </div>

        <div className="campo">
          <label>Material de apoio (arquivo opcional)</label>
          {material ? (
            <div className="material-anexo-linha">
              <span>📎 {material.nome}</span>
              <button type="button" className="btn btn-ghost btn-pequeno" onClick={() => setMaterial(undefined)}>
                Remover
              </button>
            </div>
          ) : (
            <input type="file" onChange={handleSelecionarArquivo} />
          )}
          {erroMaterial && <div className="erro" style={{ display: 'block' }}>{erroMaterial}</div>}
        </div>

        {modulo.tipo === 'formulario' && (
          <div className="campos-editor-lista">
            <div className="campos-editor-titulo">Perguntas do formulário</div>

            {campos.map((campo, i) => (
              <div className="campo-formulario-editor" key={i}>
                <input
                  type="text"
                  placeholder="Texto da pergunta"
                  value={campo.label}
                  onChange={(e) => atualizarCampo(i, { label: e.target.value })}
                />
                <div className="linha-tipo">
                  <select
                    value={campo.tipo}
                    onChange={(e) => atualizarCampo(i, { tipo: e.target.value as CampoFormulario['tipo'] })}
                  >
                    <option value="texto">Resposta em texto</option>
                    <option value="select">Escolher 1 opção</option>
                    <option value="multi-select">Escolher várias opções</option>
                  </select>
                  {campo.tipo === 'multi-select' && (
                    <input
                      type="number"
                      min={1}
                      placeholder="Máx. de opções"
                      value={campo.maximoSelecoes ?? ''}
                      onChange={(e) => atualizarCampo(i, { maximoSelecoes: Number(e.target.value) || undefined })}
                    />
                  )}
                  <button type="button" className="btn btn-ghost btn-pequeno" onClick={() => removerCampo(i)}>
                    Remover
                  </button>
                </div>
                {campo.tipo !== 'texto' && (
                  <textarea
                    rows={2}
                    placeholder="Uma opção por linha"
                    value={campo.opcoesTexto}
                    onChange={(e) => atualizarCampo(i, { opcoesTexto: e.target.value })}
                  />
                )}
              </div>
            ))}

            <button type="button" className="btn btn-secundario btn-pequeno" onClick={adicionarCampo}>
              + Adicionar pergunta
            </button>
          </div>
        )}

        <div className="editor-acoes">
          {temEdicaoSalva && (
            <button type="button" className="btn btn-ghost btn-pequeno" onClick={onRestaurarPadrao}>
              Restaurar padrão
            </button>
          )}
          {onExcluir && !modoNovo && (
            <button
              type="button"
              className="btn btn-ghost btn-pequeno btn-perigo"
              onClick={() => {
                if (confirm('Excluir este módulo? Essa ação não pode ser desfeita.')) onExcluir();
              }}
            >
              Excluir módulo
            </button>
          )}
          <button type="button" className="btn btn-primario btn-pequeno" disabled={!podeSalvar} onClick={handleSalvar}>
            {modoNovo ? 'Criar módulo' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}
