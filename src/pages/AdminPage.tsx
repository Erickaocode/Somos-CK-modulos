import { useMemo, useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import StatCard from '../components/admin/StatCard';
import JovensTable, { type JovemComProgresso } from '../components/admin/JovensTable';
import DetalheModal from '../components/admin/DetalheModal';
import DashboardGraficos from '../components/admin/DashboardGraficos';
import { ATOS, MODULOS } from '../data/modulos';
import { obterJovensUnicos, obterUltimoAcesso } from '../lib/storage';
import { proximoModuloPendente } from '../lib/atos';
import { obterTipoParticipante } from '../lib/desejos';
import { TIPOS_PARTICIPANTE } from '../data/categoriasDesejos';
import { baixarArquivo, gerarCsvRespostas } from '../lib/exportar';

export default function AdminPage() {
  const jovens = useMemo(() => obterJovensUnicos(), []);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [cpfSelecionado, setCpfSelecionado] = useState<string | null>(null);

  const totalModulos = MODULOS.length;
  const totalRespostas = jovens.reduce((soma, j) => soma + j.respostas.length, 0);
  const completos = jovens.filter((j) => j.respostas.length >= totalModulos).length;

  const jovensComProgresso: JovemComProgresso[] = useMemo(
    () =>
      jovens.map((jovem) => ({
        ...jovem,
        tipoParticipante: obterTipoParticipante(jovem.respostas),
        proximoModulo: proximoModuloPendente(MODULOS, jovem.respostas),
        ultimoAcesso: obterUltimoAcesso(jovem.cpf)?.data ?? null,
      })),
    [jovens],
  );

  const filtrados = jovensComProgresso.filter((j) => {
    const combinaBusca = j.nome.toLowerCase().includes(busca.toLowerCase());
    const combinaTipo = !filtroTipo || j.tipoParticipante === filtroTipo;
    return combinaBusca && combinaTipo;
  });

  const jovemSelecionado = jovens.find((j) => j.cpf === cpfSelecionado) ?? null;

  function handleExportar() {
    const csv = gerarCsvRespostas(filtrados, MODULOS, ATOS);
    const data = new Date().toISOString().slice(0, 10);
    baixarArquivo(csv, `respostas-plano-de-vida-${data}.csv`, 'text/csv;charset=utf-8;');
  }

  return (
    <div className="admin-shell">
      <AdminSidebar />

      <div className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Jovens e respostas dos módulos</h1>
            <p>Acompanhe o progresso de cada jovem e revise as respostas enviadas.</p>
          </div>
          <button className="btn btn-primario btn-pequeno" onClick={handleExportar}>
            Exportar respostas (Excel)
          </button>
        </div>

        <div className="stat-grid">
          <StatCard valor={jovens.length} rotulo="Jovens participantes" />
          <StatCard valor={totalRespostas} rotulo="Respostas enviadas" />
          <StatCard valor={completos} rotulo="Concluíram todos os módulos" />
        </div>

        <DashboardGraficos jovens={jovens} modulos={MODULOS} />

        <div className="filtros-linha">
          <input
            type="text"
            className="busca"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <select className="filtro-select" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
            <option value="">Todos os tipos</option>
            {TIPOS_PARTICIPANTE.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        <JovensTable jovens={filtrados} totalModulos={totalModulos} onVerRespostas={setCpfSelecionado} />

        <p className="aviso-demo">
          Protótipo de layout — os dados acima ficam salvos apenas no navegador (localStorage), sem autenticação
          real. Veja o README para os próximos passos de integração com um back-end.
        </p>
      </div>

      <DetalheModal jovem={jovemSelecionado} modulos={MODULOS} onFechar={() => setCpfSelecionado(null)} />
    </div>
  );
}
