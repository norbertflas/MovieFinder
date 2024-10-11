// client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Upewnij się, że ta linia jest obecna i poprawna
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Jeśli nie używasz reportWebVitals, możesz usunąć poniższą linię
reportWebVitals();
