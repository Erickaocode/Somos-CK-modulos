import { Link } from 'react-router-dom';

export default function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <span className="logo-dot" />
      <h2>
        Fichário Inteligente
        <br />
        <small style={{ opacity: 0.6 }}>Área administrativa</small>
      </h2>
      <nav className="admin-nav">
        <a href="#" className="active" onClick={(e) => e.preventDefault()}>
          Jovens &amp; Respostas
        </a>
        <Link to="/">← Voltar à área do jovem</Link>
      </nav>
    </div>
  );
}
