import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { Colors } from "../styles/commonStyles";

export const CustomAlert = ({ 
  message, 
  onYes, 
  onClose, 
  yesText = "Yes", 
  noText = "No",
  yesButtonColor = "#000",
  noButtonColor = "#e0e0e0",
  yesTextColor = "#fff",
  noTextColor = "#333",
  iconName = "alert-circle",
  iconColor = "#ff6b35"
}) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.alertContainer}>
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButton}
        >
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>

        <Feather
          name={iconName}
          size={60}
          color={iconColor}
          style={styles.icon}
        />

        <Text style={styles.message}>
          {message}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onYes}
            style={[styles.button, { backgroundColor: yesButtonColor }]}
          >
            <Text style={[styles.buttonText, { color: yesTextColor }]}>{yesText}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={[styles.button, { backgroundColor: noButtonColor }]}
          >
            <Text style={[styles.buttonText, { color: noTextColor }]}>{noText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 1000,
  },
  alertContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  closeText: {
    fontSize: 30,
    fontWeight: "500",
    marginRight: 6,
    color: "#666",
  },
  icon: {
    marginBottom: 15,
  },
  message: {
    marginBottom: 20,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 14,
  },
});