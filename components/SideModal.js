import { StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";

export default function SideModal({ isVisible, children, onClose }) {
  return (
    <Modal
      hardwareAccelerated={true}
      animationIn="slideInLeft"
      animationInTiming={400}
      animationOut="slideOutLeft"
      animationOutTiming={300}
      isVisible={isVisible}
      style={{ margin: 0 }}
      backdropOpacity={0.7}
      onBackdropPress={onClose}
      // onSwipeComplete={onClose}
      // swipeThreshold={100}
      // swipeDirection="left"
    >
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>GPS Map Camera</Text>
        </View>
        {children}
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalContent: {
    height: "100%",
    width: "60%",
    backgroundColor: "#25292e",
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  titleContainer: {
    backgroundColor: "#464C55",
    borderTopRightRadius: 10,
    paddingHorizontal: 10,
    paddingTop: 60,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "500",
  },
});
