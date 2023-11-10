import {View, Text, StyleSheet} from "react-native";

function Data(){
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.text}>Dane konta użytkownika</Text>
            </View>
            {/*<Modal />*/}
        </>
    )
}

export default Data;

let styles = StyleSheet.create({
    container: {
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: global.primary,
    },
    text: {
        fontSize: 20,
        paddingVertical: 10,
        textAlign: "center"
    }
});