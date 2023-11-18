import {View, StyleSheet, Pressable, Text} from "react-native";
import {colors} from "../../styles/global";
import { FontAwesome5 } from '@expo/vector-icons';
import {useRoute} from "@react-navigation/native";

function Modal({navigation}: any){
    let route = useRoute();
    return (
        <View style={styles.modal}>
            <Pressable style={[styles.button]} onPress={() => navigation.navigate("Dashboard")}>
                <FontAwesome5 name="home" size={20} color={colors.white} />
                <Text style={[styles.text, isActive("Dashboard", route.name)]}>Dashboard</Text>
            </Pressable>
            <Pressable style={[styles.button]} onPress={() => navigation.navigate("MyDevices")}>
                <FontAwesome5 name="calculator" size={20} color={colors.gray} />
                <Text style={[styles.text, isActive("MyDevices", route.name)]}>My devices</Text>
            </Pressable>
            <Pressable style={[styles.button]} onPress={() => navigation.navigate("AddDevices")}>
                <FontAwesome5 name="plus" size={20} color={colors.gray} />
                <Text style={[
                    styles.text,
                    isActive("AddDevices", route.name)
                ]}>Add devices</Text>
            </Pressable>
            <Pressable style={[styles.button]} onPress={() => navigation.navigate("About")}>
                <FontAwesome5 name="question" size={20} color={colors.gray} />
                <Text style={[
                    styles.text,
                    isActive("About", route.name)
                ]}>About</Text>
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

function isActive(screenName: string, route: string){
    return route === screenName ? styles.active : null;
}