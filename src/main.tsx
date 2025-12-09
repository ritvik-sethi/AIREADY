import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('❌ Failed to render app:', error);
  // Show error in the DOM
  document.body.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-center; background: linear-gradient(to bottom right, #f8fafc, #e2e8f0); padding: 1rem;">
      <div style="background: white; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); max-width: 32rem; width: 100%; padding: 2rem;">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: #fee2e2; border-radius: 9999px; padding: 0.75rem;">
            <svg style="width: 2rem; height: 2rem; color: #dc2626;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div>
            <h1 style="font-size: 1.5rem; font-weight: bold; color: #0f172a;">Application Error</h1>
            <p style="color: #64748b;">Failed to start the application</p>
          </div>
        </div>
        <div style="background: #fee2e2; border: 1px solid #fecaca; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1.5rem;">
          <p style="font-size: 0.875rem; font-family: monospace; color: #991b1b; word-break: break-all;">${error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
        <div style="margin-bottom: 1rem;">
          <p style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">This usually happens when:</p>
          <ul style="font-size: 0.875rem; color: #64748b; margin-left: 1.5rem; list-style: disc;">
            <li>Environment variables are not set correctly</li>
            <li>Database connection URL is missing</li>
            <li>Build configuration is incorrect</li>
          </ul>
        </div>
        <button onclick="window.location.reload()" style="width: 100%; background: linear-gradient(to right, #dc2626, #9333ea); color: white; padding: 0.75rem 1.5rem; border-radius: 0.75rem; border: none; font-weight: 600; cursor: pointer;">
          Reload Page
        </button>
        <p style="font-size: 0.75rem; color: #94a3b8; margin-top: 1rem; text-align: center;">Check browser console (F12) for more details</p>
      </div>
    </div>
  `;
}
