import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView} from "react-native";
import {colors} from "../../styles/global";
import {useEffect, useRef, useState} from "react";
import useBLE from "../../components/useBLE";
import Modal from "../../components/modal";

function AddDevices(
    {navigation}: any
){
    let scanInterval = useRef<any>(null);
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
    }, []);

    return (
        <>
        <View style={styles.container}>
            <Text style={styles.text}>Click "Scan" to start scanning area for devices.</Text>
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.button, styles.bgRed]}
                    onPress={() => {
                        clearInterval(scanInterval.current);
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
        <View>
            {allDevices.length > 0 && (
                <SafeAreaView style={styles.bluetoothDevices}>
                    <Text style={styles.text}>Znalezione urządzenia:</Text>
                    {allDevices.map((device) => (
                        <TouchableOpacity
                            style={styles.bluetoothDeviceButton}
                            onPress={() => {
                                // connectToDevice(device.id);
                            }}
                            key={device.id}
                        >
                            <Text>{device.name}</Text>
                        </TouchableOpacity>
                    ))}
                </SafeAreaView>
            )}
        </View>
            <Modal navigation={navigation} />
    </>
    )
}

export default AddDevices;

let styles = StyleSheet.create({
    container: {
        display:"flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
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
    bluetoothDevices: {
        padding: 15,
        display: "flex",
        alignItems: "center"
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
    }
});