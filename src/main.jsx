import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ProSidebarProvider } from 'react-pro-sidebar';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <ProSidebarProvider>
        <App />
      </ProSidebarProvider>
  </React.StrictMode>
);
