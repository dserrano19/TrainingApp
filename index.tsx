
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';

console.log('index.tsx executing');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Could not find root element to mount to");
  throw new Error("Could not find root element to mount to");
}

console.log('Found root element', rootElement);

const root = ReactDOM.createRoot(rootElement);
console.log('Rendering App...');

root.render(
  <React.StrictMode>
    {/* Wrap App with HashRouter to enable use of useNavigate and other routing hooks inside App component */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
console.log('Root render called');
