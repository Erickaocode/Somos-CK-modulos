interface ModuloBloqueadoProps {
  titulo: string;
  descricao: string;
  numero: number;
}

export default function ModuloBloqueado({ titulo, descricao, numero }: ModuloBloqueadoProps) {
  return (
    <div className="modulo-item bloqueado">
      <div className="modulo-cabecalho">
        <div>
          <div className="modulo-titulo-linha">
            <span className="badge-numero">{numero}</span>
            <span className="modulo-titulo">{titulo}</span>
          </div>
          <div className="modulo-desc">{descricao}</div>
        </div>
        <span className="status-pill status-bloqueado">🔒 Bloqueado</span>
      </div>
    </div>
  );
}
