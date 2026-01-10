import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";

const { width } = Dimensions.get("window");
// Reduced the margin for SLIDER_WIDTH slightly to give more room for external labels
const SLIDER_WIDTH = width - 40; 
const THUMB_SIZE = 30; // Define a constant for thumb size for cleaner styles and positioning

// Utility function to format the amount with commas and a currency symbol
const formatAmount = (amount, currency = "$") => {
  return `${currency}${amount.toLocaleString()}`;
};

export default function RangeSlider({ min = 0, max = 100000, onValueChange, currencySymbol = "$" }) {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);

  // Initial position of the thumbs: min at the start, max at the end
  const minThumbX = useRef(new Animated.Value(0)).current;
  const maxThumbX = useRef(new Animated.Value(SLIDER_WIDTH)).current;

  // Calculate the value based on the thumb's physical position (0 to SLIDER_WIDTH)
  const positionToValue = (pos) => Math.round((pos / SLIDER_WIDTH) * (max - min) + min);
  // Calculate the physical position based on a given value
  const valueToPosition = (val) => ((val - min) / (max - min)) * SLIDER_WIDTH;

  useEffect(() => {
    // Notify the parent component of the new values
    onValueChange && onValueChange(minValue, maxValue);
  }, [minValue, maxValue]);

  // --- PanResponder for Min Thumb ---
  const minPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        let newX = gestureState.dx + minThumbX._value;
        // The min thumb's position must be between 0 (start) and the max thumb's current position
        newX = Math.max(0, Math.min(newX, maxThumbX._value - 5)); // Added a small gap of 5 pixels
        minThumbX.setValue(newX);
        setMinValue(positionToValue(newX));
      },
      // When the move ends, snap the animated value to the last set position
      onPanResponderRelease: () => {
        minThumbX.extractOffset(); 
      }
    })
  ).current;

  // --- PanResponder for Max Thumb ---
  const maxPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        let newX = gestureState.dx + maxThumbX._value;
        // The max thumb's position must be between the min thumb's current position and SLIDER_WIDTH (end)
        newX = Math.max(minThumbX._value + 5, Math.min(newX, SLIDER_WIDTH)); // Added a small gap
        maxThumbX.setValue(newX);
        setMaxValue(positionToValue(newX));
      },
      onPanResponderRelease: () => {
        maxThumbX.extractOffset();
      }
    })
  ).current;

  // Handle tap on track: moves the nearest thumb to the tap location
  const handleTrackPress = (evt) => {
    const x = evt.nativeEvent.locationX;
    // Get the current physical values of the animated positions
    const currentMinX = minThumbX._value;
    const currentMaxX = maxThumbX._value;

    const minDistance = Math.abs(currentMinX - x);
    const maxDistance = Math.abs(currentMaxX - x);

    if (minDistance < maxDistance) {
      // Tap is closer to the min thumb
      const newMinX = Math.max(0, Math.min(x, currentMaxX - THUMB_SIZE / 2)); 
      Animated.timing(minThumbX, {
        toValue: newMinX,
        duration: 150,
        useNativeDriver: false,
      }).start(() => setMinValue(positionToValue(newMinX)));
    } else {
      // Tap is closer to the max thumb
      const newMaxX = Math.min(SLIDER_WIDTH, Math.max(x, currentMinX + THUMB_SIZE / 2));
       Animated.timing(maxThumbX, {
        toValue: newMaxX,
        duration: 150,
        useNativeDriver: false,
      }).start(() => setMaxValue(positionToValue(newMaxX)));
    }
  };

  return (
    <View style={styles.outerContainer}>
        {/* Min/Max Value Labels */}
        <View style={styles.valueLabelsContainer}>
            <Text style={styles.valueLabel}>
                **Min:** {formatAmount(minValue, currencySymbol)}
            </Text>
            <Text style={styles.valueLabel}>
                **Max:** {formatAmount(maxValue, currencySymbol)}
            </Text>
        </View>
        
        {/* Slider Track Area */}
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={handleTrackPress}>
                <View style={styles.track} />
            </TouchableWithoutFeedback>

            {/* Selected Range Track */}
            <Animated.View
                style={[
                    styles.selectedTrack,
                    {
                        left: minThumbX,
                        // Width is the difference between the positions of the two thumbs
                        width: Animated.subtract(maxThumbX, minThumbX), 
                    },
                ]}
            />

            {/* Min Thumb */}
            <Animated.View 
                {...minPan.panHandlers} 
                style={[
                    styles.thumb, 
                    { 
                        // Offset by half the thumb size to center it on the track
                        transform: [{ translateX: Animated.add(minThumbX, -THUMB_SIZE / 2) }],
                    }
                ]}
            >
                 <Text style={styles.thumbLabel}>{formatAmount(minValue, currencySymbol)}</Text>
            </Animated.View>

            {/* Max Thumb */}
            <Animated.View 
                {...maxPan.panHandlers} 
                style={[
                    styles.thumb, 
                    { 
                        // Offset by half the thumb size to center it on the track
                        transform: [{ translateX: Animated.add(maxThumbX, -THUMB_SIZE / 2) }],
                    }
                ]}
            >
                <Text style={styles.thumbLabel}>{formatAmount(maxValue, currencySymbol)}</Text>
            </Animated.View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { 
    paddingHorizontal: 20, 
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  valueLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  valueLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  container: { 
    height: THUMB_SIZE, 
    justifyContent: "center", 
    position: 'relative',
  },
  track: {
    position: "absolute",
    height: 6, // Slightly thicker track
    backgroundColor: "#e0e0e0",
    width: SLIDER_WIDTH,
    left: 0,
    borderRadius: 3,
  },
  selectedTrack: {
    position: "absolute",
    height: 6,
    backgroundColor: "#1e90ff", // Professional blue color
    borderRadius: 3,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "#1e90ff", 
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  thumbLabel: { 
    color: "#fff", 
    fontSize: 8, // Smaller font for the label inside the thumb
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 1, // Add padding to ensure text fits
  },
});