import {
    View,
    Text,
    StyleSheet
} from "react-native";
import { colors } from "../../styles/global";
import Modal from "../../components/modal";
import {useUserCredentials} from "../../components/userCredentialsContext/useUserCredentials";
import {useState} from "react";


function Dashboard({navigation}: any){
    const {verifiedLogin} = useUserCredentials();
    const [devicesArray, setDevicesArray] = useState([
        {
            id: "1",
            name: "device-1",
        },{
            id: "2",
            name: "device-2",
        },{
            id: "3",
            name: "device-3",
        }
    ]);
    const roomInfo = {
        date: new Date(),
        temperature: 20,
        humidity: 50
    }


    return (
        <>
            <View style={styles.container}>
                <Text style={styles.text}>Welcome, {verifiedLogin}!</Text>
                <Text>Today is {roomInfo.date.toLocaleDateString()}</Text>
                <Text>Time: {roomInfo.date.toLocaleTimeString()}</Text>
            </View>
            <View>
                <View>
                    <Text>Wybierz z którego urządzenia chcesz przejrzeć dane:</Text>
                </View>
                <Text>Wybierz przedział czasowy w którym chcesz rysować wykres</Text>

            </View>
            <Modal navigation={navigation} />
        </>
    )
}

export default Dashboard;

let styles = StyleSheet.create({
    container: {
        marginTop: 10,
        height: "20%",
        alignItems: "center",
    },
    text: {
        fontSize: 20,
        textAlign: "center"
    },
    connectionText: {
        fontSize: 14,
        paddingVertical: 10,
        fontFamily: "montserrat-bold",
        borderBottomColor: colors.gray,
        borderBottomWidth: 1
    },
    info: {
        marginVertical: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    button: {
        backgroundColor: colors.gray,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 10
    },

});
