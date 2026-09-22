import type { ReactNode } from 'react';
import Topbar from './Topbar';
import ModuloItem from './ModuloItem';
import ModuloBloqueado from './ModuloBloqueado';
import AtoHeader from './AtoHeader';
import MapaMental from './MapaMental';
import HistoricoLista from './HistoricoLista';
import BarraProgresso from './BarraProgresso';
import { atoBloqueado, moduloBloqueado, progressoDoAto } from '../lib/atos';
import type { Ato, Modulo, Resposta } from '../types';

interface ModulosViewProps {
  atos: Ato[];
  modulos: Modulo[];
  historico: Resposta[];
  nome: string;
  onSalvar: (moduloId: string, texto: string) => void;
  onSair: () => void;
  faixaAviso?: ReactNode;
}

export default function ModulosView({ atos, modulos, historico, nome, onSalvar, onSair, faixaAviso }: ModulosViewProps) {
  return (
    <div>
      {faixaAviso}
      <Topbar nome={nome} onSair={onSair} />

      <div className="page">
        <MapaMental atos={atos} modulos={modulos} historico={historico} />

        <div className="layout-duas-colunas">
          <div className="card" id="lista-modulos">
            {atos.map((ato, indice) => {
              const bloqueado = atoBloqueado(indice, atos, modulos, historico);
              const progresso = progressoDoAto(ato, modulos, historico);

              return (
                <div key={ato.id}>
                  <AtoHeader titulo={ato.titulo} bloqueado={bloqueado} progresso={progresso} />
                  {modulos
                    .filter((modulo) => modulo.atoId === ato.id)
                    .map((modulo) =>
                      moduloBloqueado(modulo, modulos, historico, bloqueado) ? (
                        <ModuloBloqueado
                          key={modulo.id}
                          titulo={modulo.titulo}
                          descricao={modulo.descricao}
                          numero={modulos.indexOf(modulo) + 1}
                          motivo={bloqueado ? 'ato' : 'sequencia'}
                        />
                      ) : (
                        <ModuloItem
                          key={modulo.id}
                          modulo={modulo}
                          numero={modulos.indexOf(modulo) + 1}
                          respostaExistente={historico.find((r) => r.moduloId === modulo.id)}
                          onSalvar={onSalvar}
                        />
                      ),
                    )}
                </div>
              );
            })}
          </div>

          <div>
            <div className="card" style={{ marginBottom: 18 }}>
              <BarraProgresso concluidos={historico.length} total={modulos.length} />
            </div>

            <div className="card">
              <div className="sidebar-titulo">Histórico de respostas</div>
              <HistoricoLista historico={historico} modulos={modulos} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
