import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SiteSettingsProvider } from './settings/SiteSettingsContext';
import LandingPage from './pages/LandingPage';

function renderHome() {
  render(
    <SiteSettingsProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </MemoryRouter>
    </SiteSettingsProvider>,
  );
}

test('renders main headline', () => {
  renderHome();
  expect(screen.getByRole('heading', { name: /fresh clothes, zero hassle/i })).toBeInTheDocument();
});
