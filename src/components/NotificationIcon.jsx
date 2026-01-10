import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const NotificationIcon = ({color="#000000ff"}) => {
  const handlePress = () => {
    // Navigate to notifications screen
    console.log('Navigate to notifications');
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
    >
      <Feather name="bell" size={24} color={color} />
      <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>12</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
    // borderRadius: 12,
    // padding: 4,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 3,
    // elevation: 3,
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default NotificationIcon;