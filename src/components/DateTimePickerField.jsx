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
  const [showTime, setShowTime] = useState(false);
  const [tempDate, setTempDate] = useState(null);

  const handleChange = (event, selected) => {
    if (event.type === 'dismissed') {
      setOpen(false);
      setShowTime(false);
      setTempDate(null);
      return;
    }

    if (!selected) return;

    if (mode === "datetime") {
      if (!showTime) {
        // First pick date
        setTempDate(selected);
        setShowTime(true);
        return;
      } else {
        // Then pick time and combine
        const combinedDateTime = new Date(tempDate);
        combinedDateTime.setHours(selected.getHours());
        combinedDateTime.setMinutes(selected.getMinutes());
        
        // Convert to IST
        const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
        const istDateTime = new Date(combinedDateTime.getTime() + istOffset);
        onChange(istDateTime.toISOString());
        setOpen(false);
        setShowTime(false);
        setTempDate(null);
        return;
      }
    }

    setOpen(false);
    
    let v;
    if (mode === "date") {
      v = selected.toISOString().split("T")[0];
    } else if (mode === "time") {
      v = selected.toLocaleTimeString('en-IN', { 
        hour: "2-digit", 
        minute: "2-digit",
        timeZone: 'Asia/Kolkata'
      });
    }

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
          {value
            ? mode === 'datetime' && value.includes('T')
              // Bug 4: Format ISO datetime to readable string for non-tech users
              ? new Date(value).toLocaleString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit', hour12: true,
                  timeZone: 'Asia/Kolkata',
                })
              : value
            : `Select ${label}`}
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
          mode={mode === "datetime" ? (showTime ? "time" : "date") : mode}
          display={Platform.OS === "ios" ? "spinner" : "spinner"}
          is24Hour={true}
          minimumDate={mode === "date" || mode === "datetime" ? new Date() : undefined}
          onChange={handleChange}
          timeZoneName={'Asia/Kolkata'}
          neutralButtonLabel="clear"
          themeVariant="dark"
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
