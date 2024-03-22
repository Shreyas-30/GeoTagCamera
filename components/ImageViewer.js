import { StyleSheet, Image, useWindowDimensions } from "react-native";

export default function ImageViewer({ placeholderImageSource, selectedImage }) {
  const { height, width } = useWindowDimensions();
  const imageSource =
    selectedImage !== null ? { uri: selectedImage } : placeholderImageSource;

  return (
    <Image source={imageSource} style={{ maxHeight: height, width: width }} />
  );
}
