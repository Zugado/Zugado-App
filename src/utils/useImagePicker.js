import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import { PermissionsAndroid, Platform } from 'react-native';

export const useImagePicker = () => {
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS auto-handles
  };

  const pickAndEdit = async (source = 'gallery', ratio = null, quality = 0.3) => {
    try {
      let result;

      if (source === 'camera') {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) throw new Error('Camera permission denied');

        result = await launchCamera({ 
          mediaType: 'photo', 
          quality,
          includeBase64: false,
          maxWidth: 2000,
          maxHeight: 2000,
        });
      } else {
        result = await launchImageLibrary({ 
          mediaType: 'photo', 
          quality,
          includeBase64: false,
          maxWidth: 2000,
          maxHeight: 2000,
          selectionLimit: 1,
          presentationStyle: 'pageSheet', // Uses Android Photo Picker on Android 13+
        });
      }

      if (result.didCancel || result.cancelled) return null;
      if (result.errorCode || result.error) throw new Error(result.errorMessage || result.error);

      const asset = result.assets?.[0];
      if (!asset || !asset.uri) return null;

      // For iOS, skip cropping if there are issues and return the original image
      if (Platform.OS === 'ios' && !ratio) {
        return {
          uri: asset.uri,
          fileName: asset.fileName || 'image.jpg',
          type: asset.type || 'image/jpeg',
        };
      }

      try {
        const cropOptions = {
          path: asset.uri,
          cropping: true,
          includeBase64: false,
          compressImageQuality: quality,
        };

        if (ratio) {
          const [w, h] = ratio.split(':').map(Number);
          cropOptions.width = w * 500;
          cropOptions.height = h * 500;
          cropOptions.freeStyleCropEnabled = false;
        } else {
          cropOptions.freeStyleCropEnabled = true;
        }

        const cropped = await ImageCropPicker.openCropper(cropOptions);

        return {
          uri: cropped.path,
          fileName: cropped.filename || asset.fileName || 'image.jpg',
          type: asset.type || 'image/jpeg',
        };
      } catch (cropError) {
        console.log('Crop error, returning original:', cropError);
        // If cropping fails, return original image
        return {
          uri: asset.uri,
          fileName: asset.fileName || 'image.jpg',
          type: asset.type || 'image/jpeg',
        };
      }
    } catch (err) {
      console.log('Image picker error:', err);
      throw err;
    }
  };

  return {
    openCamera: (ratio, quality) => pickAndEdit('camera', ratio, quality),
    openGallery: (ratio, quality) => pickAndEdit('gallery', ratio, quality),
    // Simple methods without cropping for iOS compatibility
    openCameraSimple: () => pickAndEdit('camera', null, 0.3),
    openGallerySimple: () => pickAndEdit('gallery', null, 0.3),
  };
};
