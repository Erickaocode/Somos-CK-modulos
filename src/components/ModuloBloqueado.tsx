import { useState } from 'react';

interface ModuloBloqueadoProps {
  titulo: string;
  descricao: string;
  numero: number;
  motivo: 'ato' | 'sequencia';
}

const MENSAGENS: Record<ModuloBloqueadoProps['motivo'], string> = {
  ato: 'Conclua todos os módulos do Ato anterior para desbloquear este Ato.',
  sequencia: 'Conclua o módulo anterior para desbloquear este.',
};

export default function ModuloBloqueado({ titulo, descricao, numero, motivo }: ModuloBloqueadoProps) {
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const mensagem = MENSAGENS[motivo];

  return (
    <div className={`modulo-item bloqueado${mostrarAviso ? ' aberto' : ''}`}>
      <div className="modulo-cabecalho" title={mensagem} onClick={() => setMostrarAviso((v) => !v)}>
        <div>
          <div className="modulo-titulo-linha">
            <span className="badge-numero">{numero}</span>
            <span className="modulo-titulo">{titulo}</span>
          </div>
          <div className="modulo-desc">{descricao}</div>
        </div>
        <span className="status-pill status-bloqueado">🔒 Bloqueado</span>
      </div>

      {mostrarAviso && (
        <div className="modulo-corpo">
          <div className="aviso-bloqueio">🔒 {mensagem}</div>
        </div>
      )}
    </div>
  );
}
