import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  // React Beautiful DnD (and forks) sometimes have issues with StrictMode in React 18 
  // regarding immediate mounting. We will keep StrictMode but handle mounting in App.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);