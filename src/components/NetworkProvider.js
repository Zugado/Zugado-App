import React, { createContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const NetworkContext = createContext();

export default function NetworkProvider({ children }) {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsub = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsub();
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
}
