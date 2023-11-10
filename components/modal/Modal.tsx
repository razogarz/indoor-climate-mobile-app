import {View, StyleSheet, Button, Pressable, Text} from "react-native";
import {colors} from "../../styles/global";
import { FontAwesome5 } from '@expo/vector-icons';
function Modal({navigation}: any){
    //load Feather font async
    return (
        <View style={styles.modal}>
            <Pressable style={[styles.button]} onPress={() => navigation.navigate("Home")}>
                <FontAwesome5 name="home" size={20} color={colors.white} />
                <Text style={[styles.text, styles.active]}>Home</Text>
            </Pressable>
            <Pressable style={[styles.button]} onPress={() => navigation.navigate("Data")}>
                <FontAwesome5 name="temperature-high" size={20} color={colors.gray} />
                <Text style={styles.text}>Data</Text>
            </Pressable>
            <Pressable style={[styles.button]} onPress={() => navigation.navigate("About")}>
                <FontAwesome5 name="question" size={20} color={colors.gray} />
                <Text style={styles.text}>About</Text>
            </Pressable>
        </View>
    )
}

export default Modal;

let styles = StyleSheet.create({
    modal: {
        height: 75,
        width: "100%",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        backgroundColor: colors.primary,
    },
    text: {
        color: colors.gray,
        fontSize: 11,
        paddingVertical: 5,
        marginBottom: -5,
        fontFamily: "montserrat-bold"
    },
    button: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
        width: "33.33%"
    },
    active: {
        color: colors.white,
        borderBottomWidth: 2,
        borderBottomColor: colors.white,
    }
});