import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CHAT_BACKEND_URL } from '../config';

// Define the shape of the context
interface WebSocketContextType {
  ws: WebSocket | null;
  sendMessage: (message: any) => void;
}

// Create context
const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// Hook to use it easily in components
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error('useWebSocket must be used within WebSocketProvider');
  return context;
};

// Provider component
export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const wsUrl = CHAT_BACKEND_URL.replace(/^http/, 'ws');
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('✅ WebSocket connected');
      socket.send(JSON.stringify({ type: 'register', token }));
    };

    socket.onmessage = (event) => {
      console.log('📨 Message received:', event.data);
    };

    socket.onclose = () => {
      console.log('❌ WebSocket closed');
    };

    socket.onerror = (error) => {
      console.error('⚠️ WebSocket error:', error);
    };

    setWs(socket);

    // Cleanup when component unmounts
    return () => {
      socket.close();
    };
  }, []);

  // Send message helper
  const sendMessage = (message: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
      console.log('📤 Message sent:', message);
    } else {
      console.log('❌ WebSocket not ready');
    }
  };

  return (
    <WebSocketContext.Provider value={{ ws, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
