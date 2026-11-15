import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TriageProvider } from './context/TriageContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { TicketsPage } from './pages/TicketsPage';
import { TicketDetailsPage } from './pages/TicketDetailsPage';
import { TriageResultsPage } from './pages/TriageResultsPage';

export const App: React.FC = () => {
  return (
    <TriageProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/tickets/:id" element={<TicketDetailsPage />} />
            <Route path="/triage-results" element={<TriageResultsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TriageProvider>
  );
};

export default App;
