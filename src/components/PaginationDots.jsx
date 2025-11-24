// components/PaginationDots.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function PaginationDots({ total = 3, currentIndex = 0 }) {
  return (
    <View style={styles.container}>
      {[...Array(total)].map((_, i) => (
        <View
          key={i}
          style={[styles.dot, currentIndex === i && styles.activeDot]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D0D5DD',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#4C7AFE',
    width: 20,
  },
});
