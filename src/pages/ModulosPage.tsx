import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import ModuloItem from '../components/ModuloItem';
import HistoricoLista from '../components/HistoricoLista';
import BarraProgresso from '../components/BarraProgresso';
import { MODULOS } from '../data/modulos';
import { encerrarSessao, obterRespostasDoJovem, obterSessao, salvarResposta } from '../lib/storage';
import type { Sessao } from '../types';

export default function ModulosPage() {
  const navigate = useNavigate();
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [, forcarAtualizacao] = useState(0);

  useEffect(() => {
    const atual = obterSessao();
    if (!atual) {
      navigate('/', { replace: true });
      return;
    }
    setSessao(atual);
  }, [navigate]);

  if (!sessao) return null;

  const historico = obterRespostasDoJovem(sessao.cpf);

  function handleSalvar(moduloId: string, texto: string) {
    salvarResposta({ nome: sessao!.nome, cpf: sessao!.cpf, moduloId, resposta: texto });
    forcarAtualizacao((v) => v + 1);
  }

  function handleSair() {
    encerrarSessao();
    navigate('/');
  }

  return (
    <div>
      <Topbar nome={sessao.nome} onSair={handleSair} />

      <div className="page">
        <div className="hero">
          <span className="tag">Programa de Aprendizagem</span>
          <h1>Eu do Futuro</h1>
          <p>
            Responda os módulos abaixo no seu ritmo. Suas respostas ficam salvas e você pode revisar o histórico a
            qualquer momento no painel ao lado.
          </p>
        </div>

        <div className="layout-duas-colunas">
          <div className="card" id="lista-modulos">
            {MODULOS.map((modulo, index) => (
              <ModuloItem
                key={modulo.id}
                modulo={modulo}
                numero={index + 1}
                respostaExistente={historico.find((r) => r.moduloId === modulo.id)}
                onSalvar={handleSalvar}
              />
            ))}
          </div>

          <div>
            <div className="card" style={{ marginBottom: 18 }}>
              <BarraProgresso concluidos={historico.length} total={MODULOS.length} />
            </div>

            <div className="card">
              <div className="sidebar-titulo">Histórico de respostas</div>
              <HistoricoLista historico={historico} modulos={MODULOS} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
