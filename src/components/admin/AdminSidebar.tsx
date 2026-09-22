import { Link, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
  const { pathname } = useLocation();

  return (
    <div className="admin-sidebar">
      <span className="logo-dot" />
      <h2>
        Plano de vida
        <br />
        <small style={{ opacity: 0.6 }}>Área administrativa</small>
      </h2>
      <nav className="admin-nav">
        <Link to="/admin" className={pathname === '/admin' ? 'active' : ''}>
          Jovens &amp; Respostas
        </Link>
        <Link to="/admin/modulos" className={pathname === '/admin/modulos' ? 'active' : ''}>
          Editar Módulos
        </Link>
        <Link to="/admin/preview">👁️ Pré-visualizar área do jovem</Link>
      </nav>
    </div>
  );
}
