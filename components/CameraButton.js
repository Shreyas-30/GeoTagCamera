import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

export default function CameraButton({ onPress }) {
  return (
    <View style={styles.circleButtonContainer}>
      <Pressable style={styles.circleButton} onPress={onPress}>
        {/* <MaterialIcons name="camera" size={50} color="#25292e" /> */}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  circleButtonContainer: {
    // marginHorizontal: 60,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 50,
    padding: 3,
  },
  circleButton: {
    flex: 1,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    backgroundColor: "#fff",
  },
});
