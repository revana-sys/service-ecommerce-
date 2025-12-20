// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  const showNotification = ({ message, type = "info", onConfirm, duration = 3000 }) => {
    if (type === "confirm") {
      setConfirmData({ message, onConfirm });
    } else {
      setMessage(message);
      setTimeout(() => setMessage(null), duration);
    }
  };

  const handleConfirm = () => {
    confirmData?.onConfirm?.();
    setConfirmData(null);
  };

  const handleCancel = () => setConfirmData(null);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      
         {message && (
        <div style={{
          position: 'fixed',
           top: 20,
          left: '85%',
          background: '#4caf50',
          color: 'white',
          padding: '10px 20px',
          borderRadius: 8,
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          zIndex: 9999
        }}>
          {message}
        </div>

      )}

      {confirmData && (
        <div style={{
          position: 'fixed',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#f44336',
          color: '#000',
          padding: '16px 24px',
          borderRadius: 10,
          boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
          zIndex: 9999,
          textAlign: 'center',
          minWidth: '280px'
        }}>
          <p>{confirmData.message}</p>
          <div style={{ marginTop: 12 }}>
            <button
              onClick={handleConfirm}
              style={{
                marginRight: 10,
                background: '#fff',
                border: '1px solid #ccc',
                padding: '6px 12px',
                borderRadius: 5,
                cursor: 'pointer'
              }}
            >
              Yes
            </button>
            <button
              onClick={handleCancel}
              style={{
                background: '#fff',
                border: '1px solid #ccc',
                padding: '6px 12px',
                borderRadius: 5,
                cursor: 'pointer'
              }}
            >
              No
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);