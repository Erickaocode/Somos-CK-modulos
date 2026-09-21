import type { Jovem } from '../../types';
import { mascararCPF } from '../../lib/cpf';
import { formatarData } from '../../lib/format';

interface JovensTableProps {
  jovens: Jovem[];
  totalModulos: number;
  onVerRespostas: (cpf: string) => void;
}

export default function JovensTable({ jovens, totalModulos, onVerRespostas }: JovensTableProps) {
  if (jovens.length === 0) {
    return (
      <table className="tabela-jovens">
        <thead>
          <tr>
            <th>Jovem</th>
            <th>CPF</th>
            <th>Progresso</th>
            <th>Última resposta</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={5} style={{ textAlign: 'center', color: 'var(--cinza-400)', padding: 24 }}>
              Nenhum jovem encontrado ainda.
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <table className="tabela-jovens">
      <thead>
        <tr>
          <th>Jovem</th>
          <th>CPF</th>
          <th>Progresso</th>
          <th>Última resposta</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {jovens.map((jovem) => {
          const feitos = jovem.respostas.length;
          const completo = feitos >= totalModulos;
          const ultima = jovem.respostas.slice().sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];

          return (
            <tr key={jovem.cpf}>
              <td style={{ fontWeight: 600 }}>{jovem.nome}</td>
              <td>{mascararCPF(jovem.cpf)}</td>
              <td>
                <span className={`badge-progresso${completo ? ' completo' : ''}`}>
                  {feitos}/{totalModulos} módulos
                </span>
              </td>
              <td>{ultima ? formatarData(ultima.data) : '—'}</td>
              <td>
                <button className="btn btn-secundario btn-pequeno" onClick={() => onVerRespostas(jovem.cpf)}>
                  Ver respostas
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
