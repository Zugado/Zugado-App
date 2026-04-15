import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Colors } from "../../styles/commonStyles";

export const DottedWhiteLoader = () => (
  <View style={{ justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="small" color="#fff" />
  </View>
);

export const DottedBlackLoader = () => (
  <View
    style={{
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.29)",
      zIndex: 999,
    }}
  >
    <ActivityIndicator size="large" color={Colors.primary} />
  </View>
);
