import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/layout/Layout';
import Login from './pages/auth/Login';
import { Jobs } from './pages/jobs/Jobs';
import { Applications } from './pages/applications/Applications';
import { Candidates } from './pages/candidates/Candidates';
import { Accounts } from './pages/accounts/Accounts';
import { Opportunities } from './pages/opportunities/Opportunities';
import { Activities } from './pages/activities/Activities';
import { Reports } from './pages/reports/Reports';
import { CommandPalette } from './components/ui/CommandPalette';
import { ToastContainer } from './components/ui/Toast';
import { useToast } from './hooks/useToast';
import { useKeyboard } from './hooks/useKeyboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { toasts, removeToast } = useToast();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global keyboard shortcuts
  useKeyboard({
    onCommandPalette: () => setIsCommandPaletteOpen(true),
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/jobs" replace />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/jobs" replace />} />
      </Routes>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;