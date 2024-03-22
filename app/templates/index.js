import { Link } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = "ca-app-pub-3107344619830055/3297621995";

export default function TemplatePage() {
  const { _, width } = useWindowDimensions();
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Link href="/">
          <Ionicons name="arrow-back-outline" size={28} color="white" />
        </Link>
        <Text style={styles.title}>Templates</Text>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={[{ key: "Basic" }]}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemHeader}>{item.key}</Text>
              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
              >
                <Text style={{ fontSize: 18, color: "white", lineHeight: 22 }}>
                  One Apple Park Way, Cupertino, CA {"\n"}
                  95014, United States{"\n"}
                  Lat: 40.066572° Long: -76.339166°{"\n"}
                  25/12/2021 07:24 PM GMT -07:00
                </Text>
              </View>
            </View>
          )}
        />
      </View>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#464C55" },
  topContainer: {
    flexDirection: "row",
    backgroundColor: "#25292e",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 108,
    paddingHorizontal: 15,
  },
  title: { fontSize: 24, color: "white" },
  listContainer: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    marginTop: 10,
  },
  itemHeader: {
    paddingLeft: 15,
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 2,
  },
});
