import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="toast show" style={{ bottom: '32px', right: '32px' }}>
          {toast.type === 'success' && <div className="toast-icon" style={{ background: 'rgba(0,201,141,.15)', color: 'var(--g)' }}>✓</div>}
          {toast.type === 'error' && <div className="toast-icon" style={{ background: 'rgba(255,77,109,.15)', color: 'var(--r)' }}>✗</div>}
          {toast.type === 'warning' && <div className="toast-icon" style={{ background: 'rgba(245,166,35,.15)', color: 'var(--a)' }}>!</div>}
          <span id="toastMsg">{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
