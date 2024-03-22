import { Feather, Ionicons } from "@expo/vector-icons";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";

export default function MenuList({}) {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "GPSMapCamera App | Take pictures with live GPS data of your location | ",
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  return (
    <View style={styles.listContainer}>
      <Pressable
        onPress={onShare}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
        }}
      >
        <Text style={styles.sideBarText}>Share app </Text>
        <Feather name="share" size={20} color="white" />
      </Pressable>
      <View style={{ borderBottomWidth: 0.25, borderColor: "white" }} />
      <Pressable
        onPress={onShare}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Text style={styles.sideBarText}>Rate app </Text>
        <Ionicons
          name="ios-star"
          size={20}
          color="white"
          style={{ marginLeft: 18 }}
        />
      </Pressable>
      <View style={{ borderBottomWidth: 0.25, borderColor: "white" }} />
      <Text style={styles.sideBarText}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
    flexDirection: "column",
    marginBottom: 50,
  },
  sideBarText: {
    fontSize: 24,
    color: "white",
    lineHeight: 30,
    marginVertical: 12,
    marginLeft: 15,
    marginRight: 50,
  },
});
