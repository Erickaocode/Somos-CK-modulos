interface BarraProgressoProps {
  concluidos: number;
  total: number;
}

export default function BarraProgresso({ concluidos, total }: BarraProgressoProps) {
  const pct = total ? Math.round((concluidos / total) * 100) : 0;

  return (
    <div className="progresso-wrap">
      <div className="progresso-texto">
        {concluidos} de {total} módulos concluídos
      </div>
      <div className="progresso-barra" style={{ marginTop: 8 }}>
        <div className="progresso-preenchimento" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
