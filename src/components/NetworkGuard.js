import React, { useContext } from 'react';
import { NetworkContext } from './NetworkProvider';
import NoInternetScreen from '../screens/NoInternetScreen';

export default function NetworkGuard({ children }) {
  const { isConnected } = useContext(NetworkContext);

  if (!isConnected) {
    return <NoInternetScreen />;
  }

  return children;
}
