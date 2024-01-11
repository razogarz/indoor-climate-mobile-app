import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput} from "react-native";
import {colors} from "../../styles/global";
import {useEffect, useRef, useState} from "react";
import useBLE from "../../hooks/useBLE";
import Modal from "../../components/modal";
import {useUserCredentials} from "../../hooks/useUserCredentials/useUserCredentials";

export default function AddDevices(
    {navigation}: any
){
    let { token } = useUserCredentials();
    let scanInterval = useRef<any>(null);
    let isScanning = useRef<boolean>(false);
    const [permissions, setPermissions] = useState(false);
    const [wifiPass, setWifiPass] = useState('');
    const {
        requestPermissions,
        scanForPeripherals,
        bleDevicesList,
        connectToDevice
    } = useBLE();

    useEffect(() => {
        requestPermissions().then((result) => {
            setPermissions(result);
        });
    }, [scanInterval.current]);

    return (
        <>
            <View>
                <TextInput  style={styles.textInput} placeholder={"Enter wifi password"}
                            onChangeText={text => {
                                setWifiPass(text)}
                            }
                            value={wifiPass} secureTextEntry={true} />
            </View>
        <View style={styles.container}>
            <Text style={styles.text}>Click "Scan" to start scanning area for devices.</Text>
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.button, styles.bgRed]}
                    onPress={() => {
                        clearInterval(scanInterval.current);
                        isScanning.current = false;
                    }}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.bgPrimary
                    ]}
                    onPress={() => {
                        if(permissions){
                            clearInterval(scanInterval.current);
                            isScanning.current = true;
                            scanInterval.current = setInterval(() => {
                                scanForPeripherals();
                            }, 1500);
                        }
                    }}
                >
                    <Text style={styles.buttonText}>Scan</Text>
                </TouchableOpacity>
            </View>
        </View>
        <ScrollView>
            <Text style={[
                styles.text,
                styles.textCenter
            ]}>
                {isScanning.current ? "Scanning..." : "Not scanning"}
            </Text>
            <ScrollView>
                {bleDevicesList.length > 0 && (
                    <ScrollView contentContainerStyle={styles.bluetoothDevices}>
                        <Text style={styles.text}>Devices found:</Text>
                        {bleDevicesList.map((device, index) => (
                            <TouchableOpacity
                                style={styles.bluetoothDeviceButton}
                                onPress={() => {
                                    clearInterval(scanInterval.current);
                                    isScanning.current = false;
                                    connectToDevice(token ,device.id, wifiPass);
                                }}
                                key={device.id}
                            >
                                <Text>{device.name || `Unknown device ${index} (${device.id})`}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </ScrollView>
        </ScrollView>
            <Modal navigation={navigation} />
    </>
    )
}

let styles = StyleSheet.create({
    container: {
        display:"flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        marginBottom: 10,
        width: "100%",
    },
    actionButtons: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    text: {
        fontSize: 16,
        paddingVertical: 10,
    },
    textCenter: {
        textAlign: "center"
    },
    bluetoothDevices: {
        padding: 15,
        display: "flex",
        alignItems: "center",
        marginBottom: 100,
        height: "100%"
    },
    bluetoothDeviceButton: {
        backgroundColor: colors.gray,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 10,
        width: "80%",
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 10,
        width: "45%",
    },
    bgRed: {
        backgroundColor: colors.red
    },
    bgPrimary: {
        backgroundColor: colors.primary
    },
    buttonText: {
        color: colors.white,
        fontSize: 14,
        fontFamily: "montserrat-bold",
        textAlign: "center"
    },
    textInput: {
        height: 50,
        backgroundColor: colors.gray,
        borderRadius: 10,
        margin: 10,
        paddingHorizontal: 10,
    }
});