// src/main.jsx
// Vite + React entry point.
// Phase 0 stub — just mounts a placeholder so the dev server starts.
// DailyStreakPage and full component tree wired in Phase 3.
import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', color: '#fff', background: '#1a1a2e', minHeight: '100vh' }}>
      <h1>VELoop Daily Streak</h1>
      <p>Phase 0 scaffold — frontend not yet wired (Phase 3).</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
