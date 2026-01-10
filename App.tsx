import { enableScreens } from 'react-native-screens';
enableScreens();

import "./src/i18n/i18n";

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import RootNavigator from './src/navigation/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';
import NetworkProvider from './src/components/NetworkProvider';
import NetworkGuard from './src/components/NetworkGuard';
import { SnackbarProvider } from './src/contexts/SnackbarContext';
import GlobalSnackbar from './src/components/GlobalSnackbar';
import { Colors } from './src/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function App() {
  return (
    <Provider store={store}>
      <SnackbarProvider>
        <SafeAreaView style={{flex:1,backgroundColor:Colors.primary}} >
          <NetworkProvider>
            <NetworkGuard>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </NetworkGuard>
          </NetworkProvider>
          <GlobalSnackbar />
        </SafeAreaView>
      </SnackbarProvider>
    </Provider>
  );
}
