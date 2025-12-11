import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Feather from "react-native-vector-icons/Feather";

export default function DateTimePickerField({
  label,
  value,
  mode = "date",
  onChange,
}) {
  const [open, setOpen] = useState(false);

  const handleChange = (event, selected) => {
    setOpen(false);

    if (!selected) return;

    let v =
      mode === "date"
        ? selected.toISOString().split("T")[0] // YYYY-MM-DD
        : selected.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    onChange(v);
  };

  return (
    <View style={{ marginBottom: 20 }}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.input}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={{ color: value ? "#000" : "#888", fontSize: 12, flex: 1 }}>
          {value || `Select ${label}`}
        </Text>
        <Feather 
          name={mode === "date" ? "calendar" : mode === "time" ? "clock" : "calendar"} 
          size={20} 
          color="#000000" 
        />
      </TouchableOpacity>

      {open && (
        <DateTimePicker
          value={new Date()}
          mode={mode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          is24Hour={true}
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#000",
    fontWeight: "600",
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
});
