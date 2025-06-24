import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import AutoLogoutProvider from './contexts/AutoLogoutProvider';
import AppContent from './components/AppContent';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AutoLogoutProvider>
            <AppContent/>
          </AutoLogoutProvider>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;