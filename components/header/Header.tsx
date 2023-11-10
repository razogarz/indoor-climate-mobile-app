import {View, Text, StyleSheet} from "react-native";
import {colors} from "../../styles/global";


function Header() {
    return (
        <View style={styles.container}>
            <Text style={styles.text} >Header</Text>
        </View>
    )
}

export default Header;

let styles = StyleSheet.create({
    container: {
        height: 75,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: colors.primary,
    },
    text: {
        color: colors.white,
        fontSize: 20,
        paddingVertical: 10
    }
});