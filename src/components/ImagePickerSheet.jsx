import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Colors } from '../styles/commonStyles';

export default function ImagePickerSheet({
  visible,
  onClose,
  onCamera,
  onGallery,
  onRemove,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose} 
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={styles.sheet}>
          <TouchableOpacity style={styles.option} onPress={onCamera}>
            <Text style={styles.optionText}>📷 Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={onGallery}>
            <Text style={styles.optionText}>🖼️ Gallery</Text>
          </TouchableOpacity>
          {onRemove && (
            <TouchableOpacity style={styles.option} onPress={onRemove}>
              <Text style={[styles.optionText, { color: Colors.redColor }]}>
                ❌ Remove
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 10,
  },
  option: { padding: 16 },
  optionText: { fontSize: 16, fontWeight: '500', color: Colors.blackColor },
  cancel: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    alignItems: 'center',
  },
  cancelText: { fontSize: 16, fontWeight: '600', color: Colors.secondary },
});
