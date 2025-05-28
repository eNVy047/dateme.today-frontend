import { useEffect, useState } from 'react';
import { SocketClient } from '../lib/socketClient';
import type { SocketEventCallbacks } from '../types/socketTypes';

export const useSocket = (callbacks: SocketEventCallbacks) => {
  const [socketClient] = useState(() => new SocketClient());

  useEffect(() => {
    socketClient.registerCallbacks(callbacks);
    return () => {
      socketClient.disconnect();
    };
  }, [socketClient, callbacks]);

  return socketClient;
};