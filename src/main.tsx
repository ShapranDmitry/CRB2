import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TournamentProvider } from './logic';
import { HashRouter } from 'react-router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
    <TournamentProvider>
      <App />
    </TournamentProvider>
    </HashRouter>
  </React.StrictMode>
);