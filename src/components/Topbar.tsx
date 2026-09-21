import { iniciaisNome } from '../lib/format';

interface TopbarProps {
  nome: string;
  onSair: () => void;
}

export default function Topbar({ nome, onSair }: TopbarProps) {
  return (
    <div className="topbar">
      <div className="topbar-brand">
        <span className="logo-dot" />
        Plano de vida
      </div>
      <div className="topbar-nav">
        <a href="#" className="active" onClick={(e) => e.preventDefault()}>
          Meus Módulos
        </a>
      </div>
      <div className="topbar-user">
        <span>{nome}</span>
        <span className="avatar">{iniciaisNome(nome)}</span>
        <button className="btn btn-ghost btn-pequeno" onClick={onSair}>
          Sair
        </button>
      </div>
    </div>
  );
}
