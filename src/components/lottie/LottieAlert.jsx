import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { hideLottieAlert } from '../../store/slices/lottieAlertSlice';

const ICONS = {
  success: { emoji: '✅', color: '#16A34A' },
  failure: { emoji: '❌', color: '#EF4444' },
  warning: { emoji: '⚠️', color: '#F59E0B' },
};

export const LottieAlert = ({ type, message, onClose, autoClose = true, loop, visible }) => {
  const dispatch = useDispatch();
  const lottieAlert = useSelector(state => state.lottieAlert);

  const alertType = type || lottieAlert.type;
  const alertMessage = message || lottieAlert.message;
  const alertVisible = visible !== undefined ? visible : lottieAlert.visible;
  const alertAutoClose = autoClose !== undefined ? autoClose : lottieAlert.autoClose;

  const handleClose = () => {
    if (onClose) onClose();
    else dispatch(hideLottieAlert());
  };

  useEffect(() => {
    if (alertAutoClose && alertVisible) {
      const timer = setTimeout(() => handleClose(), 2000);
      return () => clearTimeout(timer);
    }
  }, [alertVisible, alertAutoClose]);

  if (!alertVisible) return null;

  const icon = ICONS[alertType] || ICONS.warning;

  return (
    <Modal transparent animationType="fade" visible={alertVisible}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" }}>
        <View style={{ backgroundColor: "white", padding: 24, borderRadius: 12, alignItems: "center", width: "80%", elevation: 5 }}>
          <TouchableOpacity onPress={handleClose} style={{ position: "absolute", top: 8, right: 12 }}>
            <Text style={{ fontSize: 24, color: '#888' }}>×</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 60, marginBottom: 8 }}>{icon.emoji}</Text>
          <Text style={{ marginTop: 4, fontSize: 16, fontWeight: "600", textAlign: "center", color: '#111' }}>
            {alertMessage}
          </Text>
        </View>
      </View>
    </Modal>
  );
};
