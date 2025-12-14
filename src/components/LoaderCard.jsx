import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Colors } from "../styles/commonStyles";

const LoaderCard = ({ count = 1, cardHeight = 12 }) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerStyle = {
    opacity: shimmer.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
  };

  const Block = ({ width, height = 12, radius = 6, marginBottom = 6 }) => (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: Colors.extraLightGrayColor,
          marginBottom,
        },
        shimmerStyle,
      ]}
    />
  );

  const Card = ({ item, index }) => (
    <View key={index} style={styles.card}>
      <Animated.View style={[styles.image, shimmerStyle]} />

      <View style={styles.saveTag} />
      <View style={styles.urgentTag} />

      <View style={styles.content}>
        <View style={styles.row}>
          <Block width="55%" />
          <Block width="20%" />
        </View>

        <Block width="90%" />
        <Block width="75%" />

        <View style={styles.row}>
          <Block width="35%" />
        </View>

        <View style={styles.row}>
          <Block width="40%" />
          <Block width="30%" />
        </View>

        <View style={styles.buttonRow}>
          <Block width="45%" height={34} radius={20} />
          <Block width="45%" height={34} radius={20} />
        </View>
      </View>
    </View>
  );

  return <>{Array.from({ length: count }).map(Card)}</>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 24,
    marginHorizontal: 15,
    marginVertical: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  image: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Colors.extraLightGrayColor,
  },
  saveTag: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 20,
    height: 23,
    borderRadius: 6,
    backgroundColor: Colors.extraLightGrayColor,
  },
  urgentTag: {
    position: "absolute",
    top: 12,
    right: 0,
    width: 75,
    height: 16,
    borderRadius: 4,
    backgroundColor: Colors.extraLightGrayColor,
  },
  content: {
    padding: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
});

export default LoaderCard;
