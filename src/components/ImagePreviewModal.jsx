import React from "react";
import {
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { Colors } from "../styles/commonStyles";

export default function ImagePreviewModal({
  image,
  visibility,
  setVisibility,
}) {
  return (
    <Modal
      visible={visibility}
      animationType="slide"
      onRequestClose={() => setVisibility(false)}
    >
      <View style={styles.container}>
         <ImageViewer
          imageUrls={[{ url: image }]}
          enableSwipeDown
          onSwipeDown={() => setVisibility(false)}
          renderIndicator={() => null}
          backgroundColor="#f2f2f2"
        />

        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => setVisibility(false)}
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Colors.whiteColor,
  },
  closeBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    color: Colors.whiteColor,
    fontSize: 20,
    fontWeight: "bold",
  },
});
