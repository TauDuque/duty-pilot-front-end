import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App as AntApp } from 'antd';
import { ActiveListProvider } from './contexts/ActiveListContext';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AntApp>
      <ActiveListProvider>
        <App />
      </ActiveListProvider>
    </AntApp>
  </StrictMode>
);
