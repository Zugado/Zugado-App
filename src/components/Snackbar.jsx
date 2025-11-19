import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, Dimensions, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function Snackbar({
  visible,
  message,
  type = 'success', // success | error | warning
  onHide,
  duration = 2000,
}) {
  const slideAnim = useRef(new Animated.Value(100)).current;

  const getStyle = () => {
    switch (type) {
      case 'success':
        return { bg: '#18A558', icon: 'checkmark-circle-outline' };
      case 'error':
        return { bg: '#E03131', icon: 'close-circle-outline' };
      case 'warning':
        return { bg: '#F59F00', icon: 'warning-outline' };
      default:
        return { bg: '#333', icon: 'information-circle-outline' };
    }
  };

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide?.();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const { bg, icon } = getStyle();

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: bg, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.row}>
        <Icon name={icon} size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    left: width * 0.1,
    width: width * 0.8,
    padding: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    zIndex: 1000,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});
