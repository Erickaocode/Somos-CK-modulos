import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModulosView from '../components/ModulosView';
import { obterAtosCompletos, obterModulosCompletos } from '../lib/edicoesModulos';
import { encerrarSessao, obterRespostasDoJovem, obterSessao, salvarResposta } from '../lib/storage';
import type { Sessao } from '../types';

export default function ModulosPage() {
  const navigate = useNavigate();
  const [sessao] = useState<Sessao | null>(() => obterSessao());
  const [, forcarAtualizacao] = useState(0);

  useEffect(() => {
    if (!sessao) {
      navigate('/', { replace: true });
    }
  }, [sessao, navigate]);

  if (!sessao) return null;

  const atos = obterAtosCompletos();
  const modulos = obterModulosCompletos();
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
    <ModulosView
      atos={atos}
      modulos={modulos}
      historico={historico}
      nome={sessao.nome}
      onSalvar={handleSalvar}
      onSair={handleSair}
    />
  );
}
