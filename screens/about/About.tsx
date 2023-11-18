import {View, Text, StyleSheet} from "react-native";
import {colors} from "../../styles/global";
import Modal from "../../components/modal";

function About({navigation}: any){
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.text}>
                    Ta aplikacja jest projektem zaliczeniowym na przedmiot "Internet rzeczy i systemy wbudowane".
                    Autorami systemu są:
                </Text>
                <Text style={styles.text}>
                    - Tomasz Kawiak
                </Text>
                <Text style={styles.text}>
                    - Piotr Karaś
                </Text>
                <Text style={styles.text}>
                    - Patryk Knapek
                </Text>
                <Text style={styles.text}>
                    - Mateusz Mazur
                </Text>
            </View>
            <Modal navigation={navigation} />
        </>

    )
}

export default About;

let styles = StyleSheet.create({
    container: {
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.white
    },
    text: {
        fontSize: 20,
        paddingVertical: 10,
        textAlign: "center"
    }
});