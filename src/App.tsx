import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { GlobalStateProvider } from './GlobalStateContext';
import MainRouter from './MainRouter';

import './styles/global.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <MainRouter />
      </BrowserRouter>
    </GlobalStateProvider>
  </React.StrictMode>,
);
