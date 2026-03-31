import {StatusBar} from 'react-native';
import React from 'react';
import { Colors } from '../styles/commonStyles';

const MyStatusBar = ({ backgroundColor = Colors.primary, barStyle = 'light-content' }) => {
  return (
    <StatusBar
      translucent={false}
      backgroundColor={backgroundColor}
      barStyle={barStyle}
    />
  );
};

export default MyStatusBar;