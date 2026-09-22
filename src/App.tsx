import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import IdentificacaoPage from './pages/IdentificacaoPage';
import ModulosPage from './pages/ModulosPage';
import PreviewModulosPage from './pages/PreviewModulosPage';

const AdminPage = lazy(() => import('./pages/AdminPage'));
const AdminEditorPage = lazy(() => import('./pages/AdminEditorPage'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IdentificacaoPage />} />
        <Route path="/modulos" element={<ModulosPage />} />
        <Route path="/admin/preview" element={<PreviewModulosPage />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={null}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route
          path="/admin/modulos"
          element={
            <Suspense fallback={null}>
              <AdminEditorPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
