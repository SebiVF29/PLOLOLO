import React from 'react';
import { createRoot } from 'react-dom/client';

// Absolutely minimal React component
const MinimalApp = () => {
  return (
    <div style={{
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white',
      textAlign: 'center'
    }}>
      <h1>🎉 Minimal React Test</h1>
      <p>If you can see this, React is working!</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '20px',
        borderRadius: '10px',
        margin: '20px auto',
        maxWidth: '400px'
      }}>
        <p>✅ React is rendering</p>
        <p>✅ JSX is working</p>
        <p>✅ Vite is transforming correctly</p>
      </div>
    </div>
  );
};

console.log('Minimal test: Starting React app...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
  document.body.innerHTML = '<h1 style="color: red;">Error: Root element not found!</h1>';
} else {
  console.log('Root element found, creating React app...');
  try {
    const root = createRoot(rootElement);
    root.render(<MinimalApp />);
    console.log('Minimal React app rendered successfully!');
  } catch (error) {
    console.error('Error rendering minimal React app:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; font-family: Arial;">
        <h1>React Rendering Error</h1>
        <p>Error: ${error.message}</p>
        <pre>${error.stack}</pre>
      </div>
    `;
  }
}
