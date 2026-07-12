import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function Snackbar({
  visible,
  message,
  type = 'success',
  onHide,
  duration = 2500,
}) {
  const slideAnim = useRef(new Animated.Value(120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const getTheme = () => {
    switch (type) {
      case 'success':
        return {
          color: '#22C55E',
          icon: 'checkmark-circle',
        };

      case 'error':
        return {
          color: '#EF4444',
          icon: 'close-circle',
        };

      case 'warning':
        return {
          color: '#F59E0B',
          icon: 'warning',
        };

      default:
        return {
          color: '#3B82F6',
          icon: 'information-circle',
        };
    }
  };

  useEffect(() => {
    if (!visible) return;

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 120,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => onHide?.());
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration, onHide, opacity, slideAnim]);

  if (!visible) return null;

  const { color, icon } = getTheme();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderLeftColor: color,
          transform: [{ translateY: slideAnim }],
          opacity,
        },
      ]}
    >
      <Icon
        name={icon}
        size={22}
        color={color}
        style={styles.icon}
      />

      <Text style={styles.text}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,

    alignSelf: 'center',

    width: width * 0.9,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#222831',

    borderLeftWidth: 6,

    borderRadius: 10,

    paddingVertical: 15,
    paddingHorizontal: 16,

    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 8,

    zIndex: 9999,
  },

  icon: {
    marginRight: 12,
  },

  text: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 21,
  },
});