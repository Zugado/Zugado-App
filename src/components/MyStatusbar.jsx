import {StatusBar} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../styles/commonStyles';
const MyStatusBar = () => {
  return (
    <SafeAreaView style={{backgroundColor: Colors.primary}}>
      <StatusBar
        translucent={false}
        backgroundColor={Colors.primary}
        barStyle={'light-content'}
      />
    </SafeAreaView>
  );
};

export default MyStatusBar;