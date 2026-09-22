import type { Jovem, Modulo } from '../../types';
import { mascararCPF } from '../../lib/cpf';
import { formatarData } from '../../lib/format';

export interface JovemComProgresso extends Jovem {
  tipoParticipante: string | null;
  proximoModulo: Modulo | null;
  ultimoAcesso: string | null;
}

interface JovensTableProps {
  jovens: JovemComProgresso[];
  totalModulos: number;
  onVerRespostas: (cpf: string) => void;
}

export default function JovensTable({ jovens, totalModulos, onVerRespostas }: JovensTableProps) {
  return (
    <div className="tabela-scroll">
      <table className="tabela-jovens">
        <thead>
          <tr>
            <th>Jovem</th>
            <th>CPF</th>
            <th>Tipo</th>
            <th>Progresso</th>
            <th>Onde parou</th>
            <th>Último acesso</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {jovens.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', color: 'var(--cinza-400)', padding: 24 }}>
                Nenhum jovem encontrado ainda.
              </td>
            </tr>
          ) : (
            jovens.map((jovem) => {
              const feitos = jovem.respostas.length;
              const completo = feitos >= totalModulos;

              return (
                <tr key={jovem.cpf}>
                  <td style={{ fontWeight: 600 }}>{jovem.nome}</td>
                  <td>{mascararCPF(jovem.cpf)}</td>
                  <td>{jovem.tipoParticipante ?? '—'}</td>
                  <td>
                    <span className={`badge-progresso${completo ? ' completo' : ''}`}>
                      {feitos}/{totalModulos} módulos
                    </span>
                  </td>
                  <td>{jovem.proximoModulo ? jovem.proximoModulo.titulo : 'Concluiu tudo 🎉'}</td>
                  <td>{jovem.ultimoAcesso ? formatarData(jovem.ultimoAcesso) : '—'}</td>
                  <td>
                    <button className="btn btn-secundario btn-pequeno" onClick={() => onVerRespostas(jovem.cpf)}>
                      Ver respostas
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
