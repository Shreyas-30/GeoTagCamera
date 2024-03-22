import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Camera, CameraType } from "expo-camera";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { Link } from "expo-router";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { captureRef } from "react-native-view-shot";
import {
  Alert,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import CircleButton from "../components/CameraButton";
import MenuList from "../components/MenuList";
import SideModal from "../components/SideModal";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = "ca-app-pub-3107344619830055/8574995254";

export default function Home() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [location, setLocation] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();

  const [revGeoAddress, setRevGeoAddress] = useState(null);
  const cameraRef = useRef();
  const imageRef = useRef();
  const [photo, setPhoto] = useState(null);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [album, setAlbum] = useState();

  const getLoc = () => {
    Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      maximumAge: 10000,
    })
      .then((loc) => {
        console.log("Location:");
        console.log(loc);
        setLocation(loc);
        return Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      })
      .then((reverseGeocodeAddress) => {
        console.log(reverseGeocodeAddress);
        setRevGeoAddress(reverseGeocodeAddress[0]);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log(status);

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      getLoc();
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    async function perms() {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      console.log(cameraPermission);
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
      MediaLibrary.getAlbumAsync("GPSMapCamAlbum").then((album) => {
        setAlbum(album);
      });
    }
    perms();
    return (
      <View
        style={{
          backgroundColor: "#464C55",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size={"large"} />
      </View>
    );
  } else if (!hasCameraPermission) {
    return (
      <Text style={{ position: "absolute", top: 200, left: 0 }}>
        Permission for camera not granted. Please change this in settings.
      </Text>
    );
  }

  const toggleFlash = () => {
    flash === Camera.Constants.FlashMode.off
      ? setFlash(Camera.Constants.FlashMode.on)
      : flash === Camera.Constants.FlashMode.on
      ? setFlash(Camera.Constants.FlashMode.auto)
      : setFlash(Camera.Constants.FlashMode.off);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const captureImage = () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    cameraRef.current.takePictureAsync(options).then((newPic) => {
      setPhoto(newPic);
    });

    setTimeout(() => {
      captureRef(imageRef, {
        quality: 1,
      })
        .then((localUri) => {
          return MediaLibrary.createAssetAsync(localUri);
        })
        .catch((r) => console.log("Capture ref error:", r))
        .then((pic) => {
          if (album) {
            return MediaLibrary.addAssetsToAlbumAsync(pic, album.id);
          } else {
            console.log("Creating album");
            MediaLibrary.createAlbumAsync("GPSMapCamAlbum", pic).then(
              (album) => {
                setAlbum(album);
                return true;
                // return MediaLibrary.addAssetsToAlbumAsync(photo, album.id);
              }
            );
          }
        })
        .then((res) => console.log("Asset added to album: ", res))
        .finally(() => setPhoto(null))
        .catch((err) => console.log(err));
    }, 4000);
  };

  return (
    <>
      <StatusBar />

      <SafeAreaView style={styles.container}>
        <SideModal onClose={onModalClose} isVisible={isModalVisible}>
          <MenuList />
        </SideModal>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
        <View style={styles.controls}>
          <Pressable
            onPress={() => {
              isModalVisible === true
                ? setIsModalVisible(false)
                : setIsModalVisible(true);
            }}
          >
            {isModalVisible === true ? (
              <Ionicons name="ios-close" size={28} color="white" />
            ) : (
              <Feather name="sidebar" size={28} color="white" />
            )}
          </Pressable>
          <Pressable onPress={toggleFlash}>
            <MaterialCommunityIcons
              name={
                flash === Camera.Constants.FlashMode.off
                  ? "flash-off"
                  : flash === Camera.Constants.FlashMode.on
                  ? "flash"
                  : "flash-auto"
              }
              size={28}
              color="white"
            />
          </Pressable>
          <Pressable
            onPress={() => {
              setType(
                type === CameraType.back ? CameraType.front : CameraType.back
              );
            }}
          >
            <Ionicons name="camera-reverse-sharp" size={28} color="white" />
          </Pressable>
          {/* <MaterialCommunityIcons name="tune-variant" size={28} color="white" /> */}
        </View>

        {photo !== null ? (
          <View ref={imageRef} style={styles.camera} collapsable={false}>
            <Image
              source={{ uri: "data:image/jpg;base64," + photo.base64 }}
              style={{ height: "100%", width: "100%" }}
            />
            <View style={styles.overlayContainer}>
              {revGeoAddress !== null ? (
                <View style={styles.infoContainer}>
                  <Text style={styles.info}>
                    {revGeoAddress.name}, {revGeoAddress.district},{" "}
                    {revGeoAddress.subregion},{"\n"}
                    {revGeoAddress.postalCode}, {revGeoAddress.region},{" "}
                    {revGeoAddress.country}
                    {"\n"}
                    Lat {location.coords.latitude.toFixed(6)}&deg; Long{" "}
                    {location.coords.longitude.toFixed(6)}&deg;
                    {"\n"}
                    {moment(location.timestamp).format(
                      "DD/MM/YY hh:mm A [GMT] Z"
                    )}
                  </Text>
                </View>
              ) : (
                <Text>--</Text>
              )}
            </View>
          </View>
        ) : (
          <>
            <Camera
              style={styles.camera}
              type={type}
              flashMode={flash}
              ref={cameraRef}
              ratio="4:3"
            >
              {revGeoAddress !== null && (
                <View style={styles.overlayContainer}>
                  <View style={styles.infoContainer}>
                    <Text style={styles.info}>
                      {revGeoAddress.name}, {revGeoAddress.district},{" "}
                      {revGeoAddress.subregion},{"\n"}
                      {revGeoAddress.postalCode}, {revGeoAddress.region},{" "}
                      {revGeoAddress.country}
                      {"\n"}
                      Lat {location.coords.latitude.toFixed(6)}&deg; Long{" "}
                      {location.coords.longitude.toFixed(6)}&deg;
                      {"\n"}
                      {moment(location.timestamp).format(
                        "DD/MM/YY hh:mm A [GMT] Z"
                      )}
                    </Text>
                  </View>
                </View>
              )}
            </Camera>
          </>
        )}
        <View style={styles.bottomContainer}>
          <Link href="/templates">
            <Feather name="grid" size={30} color="white" />
          </Link>
          <CircleButton onPress={captureImage} />
          <Link href="/gallery">
            <Ionicons name="images" size={30} color="white" />
          </Link>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  adContainer: {
    minHeight: 50,
    borderBottomWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlayContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, .50)",
  },
  info: {
    color: "white",
    fontSize: 16,
    padding: 2,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#000",
    minHeight: 80,
  },
});
