import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Jovem, Modulo } from '../../types';
import { obterTipoParticipante } from '../../lib/desejos';

interface DashboardGraficosProps {
  jovens: Jovem[];
  modulos: Modulo[];
}

const CORES_TIPO = ['#4d2f8f', '#ff5c5c', '#c9c4dd'];

function abreviarTitulo(titulo: string): string {
  const semSufixo = titulo.split(' - ')[0];
  return semSufixo.length > 18 ? `${semSufixo.slice(0, 16)}…` : semSufixo;
}

export default function DashboardGraficos({ jovens, modulos }: DashboardGraficosProps) {
  const funil = modulos.map((m) => ({
    titulo: abreviarTitulo(m.titulo),
    concluidos: jovens.filter((j) => j.respostas.some((r) => r.moduloId === m.id)).length,
  }));

  const contagemPorTipo = new Map<string, number>();
  jovens.forEach((jovem) => {
    const tipo = obterTipoParticipante(jovem.respostas) ?? 'Não informado';
    contagemPorTipo.set(tipo, (contagemPorTipo.get(tipo) ?? 0) + 1);
  });
  const distribuicaoTipo = Array.from(contagemPorTipo.entries()).map(([tipo, total]) => ({ tipo, total }));

  return (
    <div className="dashboard-graficos">
      <div className="card grafico-card">
        <div className="grafico-titulo">Conclusão por módulo</div>
        {jovens.length === 0 ? (
          <p className="grafico-vazio">Sem respostas ainda para mostrar no gráfico.</p>
        ) : (
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={funil} margin={{ top: 8, right: 12, left: -18, bottom: 8 }}>
              <CartesianGrid stroke="var(--cinza-200)" vertical={false} />
              <XAxis dataKey="titulo" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={58} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="concluidos" name="Jovens" fill="var(--roxo-600)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="card grafico-card">
        <div className="grafico-titulo">Jovens por tipo de participante</div>
        {jovens.length === 0 ? (
          <p className="grafico-vazio">Sem jovens cadastrados ainda.</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie data={distribuicaoTipo} dataKey="total" nameKey="tipo" innerRadius={48} outerRadius={78} paddingAngle={3}>
                  {distribuicaoTipo.map((entrada, i) => (
                    <Cell key={entrada.tipo} fill={CORES_TIPO[i % CORES_TIPO.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grafico-legenda">
              {distribuicaoTipo.map((entrada, i) => (
                <div className="legenda-item" key={entrada.tipo}>
                  <span className="legenda-cor" style={{ background: CORES_TIPO[i % CORES_TIPO.length] }} />
                  {entrada.tipo} ({entrada.total})
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
