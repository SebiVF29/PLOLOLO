
// Test without imports first
console.log('Script starting...');

// Test basic DOM manipulation first
console.log('Looking for root element...');

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (!rootElement) {
  console.error('Root element not found!');
  document.body.innerHTML = '<h1 style="color: red; padding: 20px;">Error: Root element not found!</h1>';
} else {
  console.log('Root element found! Testing basic DOM manipulation...');

  // Test basic DOM manipulation without React
  rootElement.innerHTML = `
    <div style="
      padding: 40px;
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      color: white;
      text-align: center;
    ">
      <h1>🔧 Basic DOM Test</h1>
      <p>If you can see this, basic JavaScript and DOM manipulation is working!</p>
      <p>Time: ${new Date().toLocaleTimeString()}</p>
      <div style="
        background: rgba(255,255,255,0.1);
        padding: 20px;
        border-radius: 10px;
        margin: 20px auto;
        max-width: 400px;
      ">
        <p>✅ JavaScript execution working</p>
        <p>✅ DOM manipulation working</p>
        <p>✅ CSS styling working</p>
        <p id="react-test">⏳ Testing React import...</p>
      </div>
      <button onclick="testReact()" style="
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        margin: 10px;
      ">Test React Import</button>
    </div>
  `;

  console.log('Basic DOM test completed successfully!');

  // Test React import
  window.testReact = async () => {
    console.log('Testing React import...');
    try {
      const React = await import('react');
      const ReactDOM = await import('react-dom/client');
      console.log('React imported successfully:', React, ReactDOM);

      document.getElementById('react-test').innerHTML = '✅ React import successful!';

      // Now try to render a simple React component
      setTimeout(() => {
        try {
          const { createRoot } = ReactDOM;
          const root = createRoot(rootElement);

          const TestComponent = React.createElement('div', {
            style: {
              padding: '40px',
              fontFamily: 'Arial, sans-serif',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              minHeight: '100vh',
              color: 'white',
              textAlign: 'center'
            }
          },
            React.createElement('h1', null, '🎉 React is Working!'),
            React.createElement('p', null, 'React has been successfully imported and rendered!'),
            React.createElement('p', null, 'Time: ' + new Date().toLocaleTimeString())
          );

          root.render(TestComponent);
          console.log('React component rendered successfully!');
        } catch (error) {
          console.error('Error rendering React component:', error);
          document.getElementById('react-test').innerHTML = '❌ React render failed: ' + error.message;
        }
      }, 1000);

    } catch (error) {
      console.error('Error importing React:', error);
      document.getElementById('react-test').innerHTML = '❌ React import failed: ' + error.message;
    }
  };
}
