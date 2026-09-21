import { useState } from 'react';
import type { Modulo, Resposta, RespostaDesejos, RespostaFormulario, RespostaRodaVida } from '../types';
import { serializarDesejos, tentarParsearDesejos } from '../lib/desejos';
import { serializarRodaVida, tentarParsearRodaVida } from '../lib/rodaVida';
import { serializarFormulario, tentarParsearFormulario } from '../lib/formularioGenerico';
import ListaDesejosForm from './ListaDesejosForm';
import ListaDesejosResumo from './ListaDesejosResumo';
import RodaVidaForm from './RodaVidaForm';
import RodaVidaResumo from './RodaVidaResumo';
import FormularioGenericoForm from './FormularioGenericoForm';
import FormularioGenericoResumo from './FormularioGenericoResumo';

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

  function salvarTexto() {
    const texto = rascunho.trim();
    if (!texto) return;
    onSalvar(modulo.id, texto);
    setEditando(false);
  }

  function salvarDesejos(dados: RespostaDesejos) {
    onSalvar(modulo.id, serializarDesejos(dados));
    setEditando(false);
  }

  function salvarRodaVida(dados: RespostaRodaVida) {
    onSalvar(modulo.id, serializarRodaVida(dados));
    setEditando(false);
  }

  function salvarFormulario(dados: RespostaFormulario) {
    onSalvar(modulo.id, serializarFormulario(dados));
    setEditando(false);
  }

  function renderCorpo() {
    if (modulo.tipo === 'lista-desejos') {
      if (concluido && !editando) {
        const dados = respostaExistente && tentarParsearDesejos(respostaExistente.resposta);
        return dados ? (
          <ListaDesejosResumo dados={dados} categorias={modulo.categoriasDesejos} />
        ) : (
          <div className="resposta-salva">{respostaExistente!.resposta}</div>
        );
      }
      return (
        <ListaDesejosForm
          categorias={modulo.categoriasDesejos}
          valorInicial={respostaExistente ? (tentarParsearDesejos(respostaExistente.resposta) ?? undefined) : undefined}
          onSalvar={salvarDesejos}
        />
      );
    }

    if (modulo.tipo === 'roda-vida') {
      if (concluido && !editando) {
        const dados = respostaExistente && tentarParsearRodaVida(respostaExistente.resposta);
        return dados ? (
          <RodaVidaResumo dados={dados} dimensoes={modulo.dimensoesRodaVida} areas={modulo.areasRodaVida} />
        ) : (
          <div className="resposta-salva">{respostaExistente!.resposta}</div>
        );
      }
      return (
        <RodaVidaForm
          dimensoes={modulo.dimensoesRodaVida}
          areas={modulo.areasRodaVida}
          valorInicial={respostaExistente ? (tentarParsearRodaVida(respostaExistente.resposta) ?? undefined) : undefined}
          onSalvar={salvarRodaVida}
        />
      );
    }

    if (modulo.tipo === 'formulario') {
      if (concluido && !editando) {
        const dados = respostaExistente && tentarParsearFormulario(respostaExistente.resposta);
        return dados ? (
          <FormularioGenericoResumo dados={dados} campos={modulo.campos} incluirModalidade={modulo.incluirModalidade} />
        ) : (
          <div className="resposta-salva">{respostaExistente!.resposta}</div>
        );
      }
      return (
        <FormularioGenericoForm
          campos={modulo.campos}
          incluirModalidade={modulo.incluirModalidade}
          valorInicial={respostaExistente ? (tentarParsearFormulario(respostaExistente.resposta) ?? undefined) : undefined}
          onSalvar={salvarFormulario}
        />
      );
    }

    if (concluido && !editando) {
      return <div className="resposta-salva">{respostaExistente!.resposta}</div>;
    }
    return (
      <textarea
        placeholder="Escreva sua resposta..."
        value={rascunho}
        onChange={(e) => setRascunho(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  const mostraBotaoEditar = concluido && !editando;
  const mostraBotaoSalvarTexto = modulo.tipo === 'texto' && !mostraBotaoEditar;

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

        {renderCorpo()}

        {mostraBotaoEditar && (
          <button
            className="btn btn-secundario btn-pequeno"
            style={{ marginTop: 10 }}
            onClick={(e) => {
              e.stopPropagation();
              if (modulo.tipo === 'texto') {
                iniciarEdicao();
              } else {
                setEditando(true);
              }
            }}
          >
            Editar resposta
          </button>
        )}

        {mostraBotaoSalvarTexto && (
          <button
            className="btn btn-primario btn-pequeno"
            style={{ marginTop: 10 }}
            onClick={(e) => {
              e.stopPropagation();
              salvarTexto();
            }}
          >
            Salvar resposta
          </button>
        )}
      </div>
    </div>
  );
}
