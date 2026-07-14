import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';

const socketUrl = import.meta.env.VITE_WS_URL;

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    // ONLY attempt to connect if the accessToken exists
    if (!accessToken) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Pass token in auth object during handshake
    const socket = io(socketUrl, {
      auth: {
        token: accessToken,
      },
      transports: ['websocket'],
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to NestJS WebSocket Gateway');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from NestJS WebSocket Gateway');
    });

    socket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err);
      setIsConnected(false);
    });

    // Cleanup: disconnect the socket when user logs out or unmounts
    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [accessToken]);

  // Method to register event listeners
  const on = (event: string, callback: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  // Method to unregister event listeners
  const off = (event: string, callback?: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  // Method to emit events
  const emit = (event: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    on,
    off,
    emit,
  };
}
