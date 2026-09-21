import { useState } from 'react';
import type { Modulo, Resposta } from '../types';

interface ModuloItemProps {
  modulo: Modulo;
  numero: number;
  respostaExistente: Resposta | undefined;
  onSalvar: (moduloId: string, texto: string) => void;
}

export default function ModuloItem({ modulo, numero, respostaExistente, onSalvar }: ModuloItemProps) {
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [rascunho, setRascunho] = useState('');

  const concluido = !!respostaExistente;

  function iniciarEdicao() {
    setRascunho(respostaExistente?.resposta ?? '');
    setEditando(true);
  }

  function salvar() {
    const texto = rascunho.trim();
    if (!texto) return;
    onSalvar(modulo.id, texto);
    setEditando(false);
  }

  return (
    <div className={`modulo-item${aberto ? ' aberto' : ''}`}>
      <div className="modulo-cabecalho" onClick={() => setAberto((v) => !v)}>
        <div>
          <div className="modulo-titulo-linha">
            <span className={`badge-numero${concluido ? ' concluido' : ''}`}>{concluido ? '✓' : numero}</span>
            <span className="modulo-titulo">{modulo.titulo}</span>
          </div>
          <div className="modulo-desc">{modulo.descricao}</div>
        </div>
        <span className={`status-pill ${concluido ? 'status-concluido' : 'status-pendente'}`}>
          {concluido ? 'Concluído' : 'Pendente'}
        </span>
      </div>

      <div className="modulo-corpo">
        <p className="modulo-pergunta">{modulo.pergunta}</p>

        {concluido && !editando ? (
          <>
            <div className="resposta-salva">{respostaExistente.resposta}</div>
            <button
              className="btn btn-secundario btn-pequeno"
              style={{ marginTop: 10 }}
              onClick={(e) => {
                e.stopPropagation();
                iniciarEdicao();
              }}
            >
              Editar resposta
            </button>
          </>
        ) : (
          <>
            <textarea
              placeholder="Escreva sua resposta..."
              value={rascunho}
              onChange={(e) => setRascunho(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="btn btn-primario btn-pequeno"
              style={{ marginTop: 10 }}
              onClick={(e) => {
                e.stopPropagation();
                salvar();
              }}
            >
              Salvar resposta
            </button>
          </>
        )}
      </div>
    </div>
  );
}
