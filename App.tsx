import { enableScreens } from 'react-native-screens';
enableScreens();

import "./src/i18n/i18n";

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import RootNavigator from './src/navigation/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';
import NetworkProvider from './src/components/NetworkProvider';
import NetworkGuard from './src/components/NetworkGuard';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
         <NetworkProvider>
          <NetworkGuard>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        </NetworkGuard>
        </NetworkProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
