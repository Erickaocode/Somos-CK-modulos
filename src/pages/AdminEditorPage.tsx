import { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import EditorModuloModal from '../components/admin/EditorModuloModal';
import { ATOS } from '../data/modulos';
import {
  adicionarAto,
  ehModuloPadrao,
  gerarIdAto,
  gerarIdModulo,
  obterAtosCompletos,
  obterModulosCompletos,
  removerAtoCustomizado,
  removerEdicaoModulo,
  removerModuloCustomizado,
  salvarEdicaoModulo,
  salvarModuloCustomizado,
  temEdicao,
} from '../lib/edicoesModulos';
import type { Ato, CampoFormulario, Modulo } from '../types';

const IDS_ATOS_PADRAO = new Set(ATOS.map((a) => a.id));

export default function AdminEditorPage() {
  const [atos, setAtos] = useState<Ato[]>(() => obterAtosCompletos());
  const [modulos, setModulos] = useState<Modulo[]>(() => obterModulosCompletos());
  const [moduloEditando, setModuloEditando] = useState<Modulo | null>(null);
  const [moduloNovo, setModuloNovo] = useState(false);

  const [tituloNovoAto, setTituloNovoAto] = useState('');
  const [criandoModuloPara, setCriandoModuloPara] = useState<string | null>(null);
  const [tituloNovoModulo, setTituloNovoModulo] = useState('');
  const [tipoNovoModulo, setTipoNovoModulo] = useState<'texto' | 'formulario'>('texto');

  function recarregar() {
    setAtos(obterAtosCompletos());
    setModulos(obterModulosCompletos());
  }

  function handleSalvar(moduloEditado: Modulo) {
    if (ehModuloPadrao(moduloEditado.id)) {
      salvarEdicaoModulo(moduloEditado);
    } else {
      salvarModuloCustomizado(moduloEditado);
    }
    recarregar();
    setModuloEditando(null);
    setModuloNovo(false);
  }

  function handleRestaurarPadrao(id: string) {
    removerEdicaoModulo(id);
    recarregar();
    setModuloEditando(null);
  }

  function handleExcluirModulo(id: string) {
    removerModuloCustomizado(id);
    recarregar();
    setModuloEditando(null);
    setModuloNovo(false);
  }

  function handleAdicionarAto() {
    const titulo = tituloNovoAto.trim();
    if (!titulo) return;
    adicionarAto({ id: gerarIdAto(titulo), titulo });
    setTituloNovoAto('');
    recarregar();
  }

  function handleExcluirAto(id: string) {
    if (!confirm('Excluir este Ato e todos os módulos criados nele? Essa ação não pode ser desfeita.')) return;
    removerAtoCustomizado(id);
    recarregar();
  }

  function handleCriarModulo(atoId: string) {
    const titulo = tituloNovoModulo.trim();
    if (!titulo) return;

    const base = { id: gerarIdModulo(titulo), atoId, titulo, descricao: '', pergunta: '' };
    const draft: Modulo =
      tipoNovoModulo === 'formulario'
        ? { ...base, tipo: 'formulario', campos: [] as CampoFormulario[] }
        : { ...base, tipo: 'texto' };

    setModuloEditando(draft);
    setModuloNovo(true);
    setCriandoModuloPara(null);
    setTituloNovoModulo('');
    setTipoNovoModulo('texto');
  }

  return (
    <div className="admin-shell">
      <AdminSidebar />

      <div className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Editar módulos</h1>
            <p>Ajuste os textos e as perguntas que os jovens veem em cada módulo, ou crie novos Atos e módulos.</p>
          </div>
        </div>

        <div className="card novo-ato-linha">
          <input
            type="text"
            placeholder="Título do novo Ato (ex.: Ato 4 — Sua Jornada)"
            value={tituloNovoAto}
            onChange={(e) => setTituloNovoAto(e.target.value)}
          />
          <button type="button" className="btn btn-secundario btn-pequeno" disabled={!tituloNovoAto.trim()} onClick={handleAdicionarAto}>
            + Novo Ato
          </button>
        </div>

        {atos.map((ato) => {
          const modulosDoAto = modulos.filter((m) => m.atoId === ato.id);
          const atoCustomizado = !IDS_ATOS_PADRAO.has(ato.id);

          return (
            <div className="card editor-ato-bloco" key={ato.id}>
              <div className="editor-ato-cabecalho">
                <div className="editor-ato-titulo">{ato.titulo}</div>
                {atoCustomizado && (
                  <button type="button" className="btn btn-ghost btn-pequeno btn-perigo" onClick={() => handleExcluirAto(ato.id)}>
                    Excluir Ato
                  </button>
                )}
              </div>

              {modulosDoAto.map((modulo) => (
                <div className="editor-modulo-linha" key={modulo.id}>
                  <div>
                    <div className="editor-modulo-titulo">
                      {modulo.titulo}
                      {temEdicao(modulo.id) && <span className="badge-editado">Editado</span>}
                      {!ehModuloPadrao(modulo.id) && <span className="badge-editado">Novo</span>}
                    </div>
                    <div className="editor-modulo-descricao">{modulo.descricao}</div>
                  </div>
                  <button
                    className="btn btn-secundario btn-pequeno"
                    onClick={() => {
                      setModuloNovo(false);
                      setModuloEditando(modulo);
                    }}
                  >
                    Editar
                  </button>
                </div>
              ))}

              {modulosDoAto.length === 0 && <p className="editor-ato-vazio">Nenhum módulo neste Ato ainda.</p>}

              {criandoModuloPara === ato.id ? (
                <div className="novo-modulo-linha">
                  <input
                    type="text"
                    placeholder="Título do novo módulo"
                    value={tituloNovoModulo}
                    onChange={(e) => setTituloNovoModulo(e.target.value)}
                  />
                  <select value={tipoNovoModulo} onChange={(e) => setTipoNovoModulo(e.target.value as 'texto' | 'formulario')}>
                    <option value="texto">Resposta em texto</option>
                    <option value="formulario">Formulário (com perguntas)</option>
                  </select>
                  <button
                    type="button"
                    className="btn btn-primario btn-pequeno"
                    disabled={!tituloNovoModulo.trim()}
                    onClick={() => handleCriarModulo(ato.id)}
                  >
                    Continuar
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-pequeno"
                    onClick={() => {
                      setCriandoModuloPara(null);
                      setTituloNovoModulo('');
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-ghost btn-pequeno"
                  style={{ marginTop: 10 }}
                  onClick={() => setCriandoModuloPara(ato.id)}
                >
                  + Novo módulo
                </button>
              )}
            </div>
          );
        })}

        <p className="aviso-demo">
          As edições ficam salvas apenas neste navegador (localStorage) e substituem o conteúdo padrão do módulo.
        </p>
      </div>

      {moduloEditando && (
        <EditorModuloModal
          key={moduloEditando.id}
          modulo={moduloEditando}
          temEdicaoSalva={temEdicao(moduloEditando.id)}
          modoNovo={moduloNovo}
          onFechar={() => {
            setModuloEditando(null);
            setModuloNovo(false);
          }}
          onSalvar={handleSalvar}
          onRestaurarPadrao={() => handleRestaurarPadrao(moduloEditando.id)}
          onExcluir={!ehModuloPadrao(moduloEditando.id) ? () => handleExcluirModulo(moduloEditando.id) : undefined}
        />
      )}
    </div>
  );
}
