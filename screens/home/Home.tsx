import {
    View,
    Text,
    StyleSheet,
    NativeModules,
    TouchableOpacity,
    NativeEventEmitter, Platform, PermissionsAndroid
} from "react-native";
import { colors } from "../../styles/global";
import Modal from "../../components/modal";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {useUserCredentials} from "../../components/userCredentials/UserCredentials";
import {useEffect, useState} from "react";
import useBLE from "../../components/useBLE";
import {platformApiLevel} from "expo-device";


function Home({navigation}: any){
    const {verifiedLogin} = useUserCredentials();
    const devices = [{
        name: "Raspberry Pi",
        status: "Połączono",
    }];
    const roomInfo = {
        date: new Date(),
        temperature: 20,
        humidity: 50
    }
    const [permissions, setPermissions] = useState(false);
    const {
        requestPermissions,
        scanForPeripherals,
        allDevices
    } = useBLE();

    useEffect(() => {
        requestPermissions().then((result) => {
            setPermissions(result);
        });
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => { console.log(result) });
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => { console.log(result) });
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT).then((result) => { console.log(result) });
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN).then((result) => { console.log(result) });
        }, []);

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.text}>Witaj, {verifiedLogin}!</Text>
                <Text>Dzisia jest {roomInfo.date.toLocaleDateString()}</Text>
                <Text>Godzina: {roomInfo.date.toLocaleTimeString()}</Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.text}>Status połączenia z urządzeniem: </Text>
                <Text style={styles.connectionText}>{devices[0].name}: {devices[0].status}</Text>
                <View style={styles.info}>
                    <Text style={styles.text}>Temperatura: {roomInfo.temperature}
                        <MaterialCommunityIcons name="temperature-celsius" size={20} color="black" />
                    </Text>
                    <Text style={styles.text}>Wilgotność: {roomInfo.humidity}%
                    </Text>

                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        if(permissions){
                            scanForPeripherals();
                        }
                    }}
                >
                    <Text>Przeskanuj urządzenia</Text>
                </TouchableOpacity>
            </View>
            {allDevices.map((device) => {
                return (
                    <View key={device.id}>
                        <Text>{device.name}</Text>
                    </View>
                )
            })}
            <Modal navigation={navigation} />
        </>
    )
}

export default Home;

let styles = StyleSheet.create({
    container: {
        marginTop: 20,
        height: "20%",
        alignItems: "center",
        backgroundColor: colors.primary,
    },
    text: {
        fontSize: 20,
        paddingVertical: 10,
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
    }
});