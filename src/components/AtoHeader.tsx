import { useState } from 'react';
import type { ProgressoAto } from '../lib/atos';

interface AtoHeaderProps {
  titulo: string;
  bloqueado: boolean;
  progresso: ProgressoAto;
}

const MENSAGEM_BLOQUEIO = 'Conclua todos os módulos do Ato anterior para desbloquear este Ato.';

export default function AtoHeader({ titulo, bloqueado, progresso }: AtoHeaderProps) {
  const [mostrarAviso, setMostrarAviso] = useState(false);

  return (
    <div
      className="ato-titulo"
      title={bloqueado ? MENSAGEM_BLOQUEIO : undefined}
      onClick={bloqueado ? () => setMostrarAviso((v) => !v) : undefined}
      style={bloqueado ? { cursor: 'pointer' } : undefined}
    >
      <div className="ato-titulo-linha">
        <span>{titulo}</span>
        {bloqueado ? (
          <span className="ato-bloqueado">🔒 Bloqueado</span>
        ) : (
          progresso.total > 0 && (
            <span className="ato-progresso-texto">
              {progresso.concluidos}/{progresso.total} concluídos
            </span>
          )
        )}
      </div>

      {!bloqueado && progresso.total > 0 && (
        <div className="ato-progresso-barra">
          <div className="ato-progresso-preenchimento" style={{ width: `${progresso.pct}%` }} />
        </div>
      )}

      {bloqueado && mostrarAviso && (
        <div className="aviso-bloqueio" style={{ marginTop: 10 }}>
          🔒 {MENSAGEM_BLOQUEIO}
        </div>
      )}
    </div>
  );
}
