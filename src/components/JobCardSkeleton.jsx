import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const JobCardSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = () => {
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => shimmer());
    };
    shimmer();
  }, []);

  const shimmerStyle = {
    opacity: shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    }),
  };

  return (
    <View style={styles.cardContainer}>
      <Animated.View style={[styles.imageSkeleton, shimmerStyle]} />
      <View style={styles.urgentTagSkeleton} />
      
      <View style={styles.contentContainer}>
        <View style={styles.row}>
          <Animated.View style={[styles.titleSkeleton, shimmerStyle]} />
          <Animated.View style={[styles.priceSkeleton, shimmerStyle]} />
        </View>
        
        <Animated.View style={[styles.descriptionSkeleton, shimmerStyle]} />
        <Animated.View style={[styles.descriptionSkeleton2, shimmerStyle]} />
        
        <View style={styles.locationRow}>
          <Animated.View style={[styles.iconSkeleton, shimmerStyle]} />
          <Animated.View style={[styles.locationTextSkeleton, shimmerStyle]} />
        </View>
        
        <View style={styles.row}>
          <Animated.View style={[styles.vendorSkeleton, shimmerStyle]} />
          <View style={styles.ratingContainer}>
            <Animated.View style={[styles.starSkeleton, shimmerStyle]} />
            <Animated.View style={[styles.ratingSkeleton, shimmerStyle]} />
          </View>
        </View>
        
        <View style={styles.buttonRow}>
          <Animated.View style={[styles.buttonSkeleton, shimmerStyle]} />
          <Animated.View style={[styles.buttonSkeleton, shimmerStyle]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 15,
    marginVertical: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  imageSkeleton: {
    width: '100%',
    height: 120,
    backgroundColor: '#e0e0e0',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  urgentTagSkeleton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#e0e0e0',
    width: 60,
    height: 25,
    borderRadius: 7,
  },
  contentContainer: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleSkeleton: {
    backgroundColor: '#e0e0e0',
    height: 20,
    width: '60%',
    borderRadius: 4,
  },
  priceSkeleton: {
    backgroundColor: '#e0e0e0',
    height: 20,
    width: '25%',
    borderRadius: 4,
  },
  descriptionSkeleton: {
    backgroundColor: '#e0e0e0',
    height: 14,
    width: '100%',
    borderRadius: 4,
    marginBottom: 5,
  },
  descriptionSkeleton2: {
    backgroundColor: '#e0e0e0',
    height: 14,
    width: '70%',
    borderRadius: 4,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconSkeleton: {
    backgroundColor: '#e0e0e0',
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 5,
  },
  locationTextSkeleton: {
    backgroundColor: '#e0e0e0',
    height: 14,
    width: 80,
    borderRadius: 4,
  },
  vendorSkeleton: {
    backgroundColor: '#e0e0e0',
    height: 16,
    width: '40%',
    borderRadius: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starSkeleton: {
    backgroundColor: '#e0e0e0',
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 5,
  },
  ratingSkeleton: {
    backgroundColor: '#e0e0e0',
    height: 14,
    width: 60,
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  buttonSkeleton: {
    backgroundColor: '#e0e0e0',
    height: 35,
    width: '48%',
    borderRadius: 18,
  },
});

export default JobCardSkeleton;