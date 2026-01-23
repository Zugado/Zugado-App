import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const DotLoader = ({ color = '#fff', size = 4 }) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, { backgroundColor: color, width: size, height: size, opacity: dot1 }]} />
      <Animated.View style={[styles.dot, { backgroundColor: color, width: size, height: size, opacity: dot2 }]} />
      <Animated.View style={[styles.dot, { backgroundColor: color, width: size, height: size, opacity: dot3 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dot: {
    borderRadius: 10,
  },
});

export default DotLoader;
