import {ActivityIndicator, View, StyleSheet, Text} from "react-native";
import {colors} from "../../styles/global";

function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
        <Text>Loading...</Text>
    </View>
  );
}

export default Loading;

let styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});