import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cpfValido, formatarCPF } from '../lib/cpf';
import { obterSessao, salvarSessao, semearDadosDemo } from '../lib/storage';

export default function IdentificacaoPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [nomeInvalido, setNomeInvalido] = useState(false);
  const [cpfInvalido, setCpfInvalido] = useState(false);

  useEffect(() => {
    if (obterSessao()) {
      navigate('/modulos', { replace: true });
    }
  }, [navigate]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const nomeValido = nome.trim().length >= 3;
    const cpfOk = cpfValido(cpf);

    setNomeInvalido(!nomeValido);
    setCpfInvalido(!cpfOk);

    if (!nomeValido || !cpfOk) return;

    salvarSessao(nome.trim(), cpf);
    semearDadosDemo();
    navigate('/modulos');
  }

  return (
    <div className="tela-central">
      <div className="painel-identificacao">
        <span className="logo-dot" />
        <h1>Fichário Inteligente</h1>
        <p className="sub">Informe seu nome e CPF para começar (ou continuar) os módulos do curso.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={`campo${nomeInvalido ? ' invalido' : ''}`}>
            <label htmlFor="nome">Nome completo</label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Ex: Marcos Dourado"
              autoComplete="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <div className="erro">Digite seu nome completo.</div>
          </div>

          <div className={`campo${cpfInvalido ? ' invalido' : ''}`}>
            <label htmlFor="cpf">CPF</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              placeholder="000.000.000-00"
              inputMode="numeric"
              maxLength={14}
              value={cpf}
              onChange={(e) => setCpf(formatarCPF(e.target.value))}
            />
            <div className="erro">Digite um CPF válido.</div>
          </div>

          <button type="submit" className="btn btn-primario">
            Começar módulos
          </button>
        </form>

        <Link to="/admin" className="link-admin">
          Sou administrador(a) →
        </Link>
      </div>
    </div>
  );
}
