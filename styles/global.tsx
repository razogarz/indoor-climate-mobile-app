import {StyleSheet} from "react-native";

export const colors = {
    primary: "#1985A1",
    secondary: "#4C5C68",
    tertiary: "#46494C",
    gray: "#C5C3C6",
    white: "#ededf3"
}

export const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: "contain",
    },
    textInput: {
        backgroundColor: colors.white,
        padding: 10,
        marginBottom: 15,
        borderRadius: 10,
        width: "100%",
        fontFamily: "montserrat",
        borderWidth: 1,
        borderColor: "#252525"
    },
    button: {
        backgroundColor: colors.primary,
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontFamily: "montserrat-bold"
    }
});