interface StatCardProps {
  valor: number;
  rotulo: string;
}

export default function StatCard({ valor, rotulo }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="valor">{valor}</div>
      <div className="rotulo">{rotulo}</div>
    </div>
  );
}
