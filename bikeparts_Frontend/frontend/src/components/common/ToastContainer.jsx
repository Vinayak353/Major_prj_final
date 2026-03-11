import React from 'react';

const icons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

const ToastContainer = ({ toasts }) => {
  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem' }}>
            {icons[t.type]}
          </span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
