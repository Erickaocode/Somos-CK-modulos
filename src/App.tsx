import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import IdentificacaoPage from './pages/IdentificacaoPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IdentificacaoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
