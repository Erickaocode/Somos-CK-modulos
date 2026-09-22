import { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import EditorModuloModal from '../components/admin/EditorModuloModal';
import { ATOS, MODULOS } from '../data/modulos';
import { aplicarEdicoes, removerEdicaoModulo, salvarEdicaoModulo, temEdicao } from '../lib/edicoesModulos';
import type { Modulo } from '../types';

export default function AdminEditorPage() {
  const [modulos, setModulos] = useState<Modulo[]>(() => aplicarEdicoes(MODULOS));
  const [moduloEditando, setModuloEditando] = useState<Modulo | null>(null);

  function recarregar() {
    setModulos(aplicarEdicoes(MODULOS));
  }

  function handleSalvar(moduloEditado: Modulo) {
    salvarEdicaoModulo(moduloEditado);
    recarregar();
    setModuloEditando(null);
  }

  function handleRestaurarPadrao(id: string) {
    removerEdicaoModulo(id);
    recarregar();
    setModuloEditando(null);
  }

  return (
    <div className="admin-shell">
      <AdminSidebar />

      <div className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Editar módulos</h1>
            <p>Ajuste os textos e as perguntas que os jovens veem em cada módulo.</p>
          </div>
        </div>

        {ATOS.map((ato) => {
          const modulosDoAto = modulos.filter((m) => m.atoId === ato.id);
          if (modulosDoAto.length === 0) return null;

          return (
            <div className="card editor-ato-bloco" key={ato.id}>
              <div className="editor-ato-titulo">{ato.titulo}</div>
              {modulosDoAto.map((modulo) => (
                <div className="editor-modulo-linha" key={modulo.id}>
                  <div>
                    <div className="editor-modulo-titulo">
                      {modulo.titulo}
                      {temEdicao(modulo.id) && <span className="badge-editado">Editado</span>}
                    </div>
                    <div className="editor-modulo-descricao">{modulo.descricao}</div>
                  </div>
                  <button className="btn btn-secundario btn-pequeno" onClick={() => setModuloEditando(modulo)}>
                    Editar
                  </button>
                </div>
              ))}
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
          onFechar={() => setModuloEditando(null)}
          onSalvar={handleSalvar}
          onRestaurarPadrao={() => handleRestaurarPadrao(moduloEditando.id)}
        />
      )}
    </div>
  );
}
