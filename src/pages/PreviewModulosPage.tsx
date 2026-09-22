import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModulosView from '../components/ModulosView';
import { ATOS, MODULOS } from '../data/modulos';
import { aplicarEdicoes } from '../lib/edicoesModulos';
import type { Resposta } from '../types';

const CPF_PREVIEW = '000.000.000-00';

/** Prévia somente-leitura de como a área do jovem fica — nada aqui é salvo de verdade. */
export default function PreviewModulosPage() {
  const navigate = useNavigate();
  const [historico, setHistorico] = useState<Resposta[]>([]);
  const modulos = aplicarEdicoes(MODULOS);

  function handleSalvar(moduloId: string, texto: string) {
    setHistorico((atual) => [
      ...atual.filter((r) => r.moduloId !== moduloId),
      { nome: 'Pré-visualização', cpf: CPF_PREVIEW, moduloId, resposta: texto, data: new Date().toISOString() },
    ]);
  }

  return (
    <ModulosView
      atos={ATOS}
      modulos={modulos}
      historico={historico}
      nome="Pré-visualização"
      onSalvar={handleSalvar}
      onSair={() => navigate('/admin')}
      faixaAviso={
        <div className="preview-faixa">
          <span>👁️ Modo de pré-visualização — é assim que os jovens veem os módulos. Nada aqui é salvo de verdade.</span>
          <button className="btn btn-ghost btn-pequeno" onClick={() => navigate('/admin')}>
            ← Voltar ao admin
          </button>
        </div>
      }
    />
  );
}
