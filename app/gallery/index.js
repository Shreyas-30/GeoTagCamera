import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import * as MediaLibrary from "expo-media-library";
import Modal from "react-native-modal";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";

const AlbumGallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageDataUrl, setSelectedImageDataUrl] = useState(null);

  useEffect(() => {
    fetchImagesFromAlbum();
  }, []);

  const fetchImagesFromAlbum = async () => {
    const albums = await MediaLibrary.getAlbumsAsync();
    const album = albums.find((album) => album.title === "GPSMapCamAlbum");

    if (album) {
      const media = await MediaLibrary.getAssetsAsync({
        album: album,
        mediaType: MediaLibrary.MediaType.photo,
      });
      setImages(media.assets);
    }
  };

  const openImageFullScreen = async (index) => {
    const selectedAsset = images[index];
    if (selectedAsset) {
      const imageData = await MediaLibrary.getAssetInfoAsync(selectedAsset);
      const localUri = imageData.localUri || selectedAsset.uri;
      const base64Data = await FileSystem.readAsStringAsync(localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const imageDataUrl = `data:image/jpeg;base64,${base64Data}`;

      setSelectedImageIndex(index);
      setSelectedImageDataUrl(imageDataUrl);
      setModalVisible(true);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => openImageFullScreen(index)}>
        <Image source={{ uri: item.uri }} style={styles.thumbnail} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Link href="/">
          <Ionicons name="arrow-back-outline" size={28} color="white" />
        </Link>
        <Text style={styles.title}>Gallery</Text>
      </View>
      <FlatList
        data={images}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <Modal
        isVisible={modalVisible}
        transparent={true}
        // onRequestClose={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          margin: 0,
        }}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.touchableContainer}
          >
            <Image
              source={{ uri: selectedImageDataUrl }}
              style={styles.fullScreenImage}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  topContainer: {
    flexDirection: "row",
    backgroundColor: "#464C55",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 120,
    paddingHorizontal: 15,
    width: "100%",
  },
  title: { fontSize: 26, color: "white" },
  thumbnail: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 5,
    // resizeMode: "contain",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0, 0.7)",
  },
  touchableContainer: {
    flex: 1,
    padding: 120,
  },
  fullScreenImage: {
    height: "100%",
    aspectRatio: 1,
    resizeMode: "contain",
  },
});

export default AlbumGallery;
