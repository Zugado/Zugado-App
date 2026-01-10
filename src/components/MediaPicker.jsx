// components/MediaPicker.js
import React from 'react';
import { TouchableOpacity, Text, ActionSheetIOS, Platform, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export default function MediaPicker({ 
  onSelect,        // callback returns selected media array
  children,        // custom UI (button) if needed
  multiple = true, // allow multiple selection
  mediaType = 'mixed' // image | video | mixed
}) {

  const pickFromGallery = () => {
    const options = {
      mediaType,
      selectionLimit: multiple ? 0 : 1, // 0 = unlimited
    };

    launchImageLibrary(options, res => {
      if (!res.didCancel && !res.errorCode) {
        const formatted = res.assets.map((item, index) => ({
          id: Date.now() + index,
          uri: item.uri,
          type: item.type.includes('video') ? 'video' : 'image',
        }));
        onSelect(formatted);
      }
    });
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      saveToPhotos: true,
    };

    launchCamera(options, res => {
      if (!res.didCancel && !res.errorCode) {
        const file = res.assets[0];
        onSelect([
          {
            id: Date.now(),
            uri: file.uri,
            type: 'image',
          }
        ]);
      }
    });
  };

  const showOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Choose from Gallery', 'Open Camera'],
          cancelButtonIndex: 0,
        },
        index => {
          if (index === 1) pickFromGallery();
          if (index === 2) openCamera();
        }
      );
    } else {
      Alert.alert(
        'Select Option',
        '',
        [
          { text: 'Choose from Gallery', onPress: pickFromGallery },
          { text: 'Open Camera', onPress: openCamera },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  return (
    <TouchableOpacity onPress={showOptions}>
      {children ? children : <Text>Select Media</Text>}
    </TouchableOpacity>
  );
}
