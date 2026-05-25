import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ProtectedAdminPage from './pages/admin/ProtectedAdminPage';
import { SiteSettingsProvider } from './settings/SiteSettingsContext';

export default function App() {
  return (
    <SiteSettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<ProtectedAdminPage />} />
        </Routes>
      </BrowserRouter>
    </SiteSettingsProvider>
  );
}
