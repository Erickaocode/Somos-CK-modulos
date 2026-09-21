import type { ProgressoAto } from '../lib/atos';

interface AtoHeaderProps {
  titulo: string;
  bloqueado: boolean;
  progresso: ProgressoAto;
}

export default function AtoHeader({ titulo, bloqueado, progresso }: AtoHeaderProps) {
  return (
    <div className="ato-titulo">
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
    </div>
  );
}
