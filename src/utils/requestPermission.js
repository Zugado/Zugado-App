import { PermissionsAndroid, Platform } from "react-native";

export async function requestGalleryPermission() {
  if (Platform.OS !== "android") return true;

  try {
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  } catch (err) {
    return false;
  }
}

export async function requestCameraPermission() {
  if (Platform.OS !== "android") return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
}
