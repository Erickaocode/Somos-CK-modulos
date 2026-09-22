import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import IdentificacaoPage from './pages/IdentificacaoPage';
import ModulosPage from './pages/ModulosPage';

const AdminPage = lazy(() => import('./pages/AdminPage'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IdentificacaoPage />} />
        <Route path="/modulos" element={<ModulosPage />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={null}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
