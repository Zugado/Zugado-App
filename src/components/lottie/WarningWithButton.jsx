import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Colors } from '../../styles/commonStyles';

export const WarningWithButton = ({
  message,
  onYes,
  onClose,
  yesText = 'Yes',
  noText = 'No',
}) => {
  return (
    <Modal transparent animationType="fade" visible={true}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            padding: 24,
            borderRadius: 12,
            alignItems: 'center',
            width: '80%',
            elevation: 5,
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            style={{ position: 'absolute', top: 8, right: 12 }}
          >
            <Text style={{ fontSize: 24, color: '#888' }}>×</Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 60, marginBottom: 8 }}>⚠️</Text>

          <Text
            style={{
              marginTop: 4,
              fontSize: 16,
              fontWeight: '600',
              textAlign: 'center',
              color: '#111',
            }}
          >
            {message}
          </Text>

          <View style={{ flexDirection: 'row', marginTop: 20, gap: 10 }}>
            <TouchableOpacity
              onPress={onYes}
              activeOpacity={0.8}
              style={{
                flex: 1,
                backgroundColor: Colors.primary,
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>
                {yesText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.8}
              style={{
                flex: 1,
                backgroundColor: '#e0e0e0',
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#333', fontWeight: '600' }}>{noText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
