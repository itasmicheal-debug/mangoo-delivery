import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminPage from './admin/AdminPage';
import LandingPage from './pages/LandingPage';
import { SiteSettingsProvider } from './settings/SiteSettingsContext';

export default function App() {
  return (
    <SiteSettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </SiteSettingsProvider>
  );
}
