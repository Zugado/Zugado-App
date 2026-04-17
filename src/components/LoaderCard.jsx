import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Colors } from "../styles/commonStyles";

export const LoaderCard = ({ count = 1, cardHeight = 12 }) => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerStyle = {
    opacity: shimmerValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
  };

  const renderPlaceholder = (width, height = cardHeight, marginVertical = 4) => (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: Colors.extraLightGrayColor,
          borderRadius: 4,
          marginVertical,
        },
        shimmerStyle,
      ]}
    />
  );

  const renderCard = (_, index) => (
    <View key={index} style={styles.card}>
      {renderPlaceholder("70%", 12)}
      {renderPlaceholder("90%")}
      {renderPlaceholder("80%")}
      <View style={styles.divider} />
      {renderPlaceholder("60%")}
      {renderPlaceholder("65%")}
      <View style={styles.divider} />
      {renderPlaceholder("50%")}
      <View style={styles.bottomContainer}>
        <View
          style={[
            styles.button,
            { backgroundColor: Colors.extraLightGrayColor },
          ]}
        >
          {renderPlaceholder("60%", 12, 0)}
        </View>
        {renderPlaceholder("25%", 12, 0)}
      </View>
    </View>
  );

  return <>{Array.from({ length: count }).map(renderCard)}</>;
};

export default LoaderCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    padding: 16,
    margin: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.extraLightGrayColor,
    marginVertical: 4,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
