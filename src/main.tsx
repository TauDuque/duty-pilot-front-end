import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ActiveListProvider } from './contexts/ActiveListContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ActiveListProvider>
        <App />
      </ActiveListProvider>
    </ThemeProvider>
  </StrictMode>
);
