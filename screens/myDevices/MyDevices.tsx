import {View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView} from "react-native";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import Modal from "../../components/modal";
import {useUserCredentials} from "../../components/userCredentialsContext/useUserCredentials";
import {deleteDevice, getDevices} from "../../components/Endpoints";
// import {Dispatch, SetStateAction, useState} from "react";

type DeviceProp = {
    device_id: string,
    name: string
}
function MyDevices({navigation}: any) {
    const {token} = useUserCredentials();
    const [devicesArray, setDevicesArray] = useState({} as DeviceProp[]);

    useEffect(() => {
        getDevices(token)
            .then((devices) => {
                console.log(devices);
                setDevicesArray(devices);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [token]);

    return (
        <>
            <ScrollView contentContainerStyle={styles.cardsContainer}>
                {devicesArray.length > 0 && devicesArray.map((device, index) => {
                    return (
                        <View style={styles.deviceCard} key={index}>
                            <View>
                                <Text>Device id: {device.device_id}</Text>
                                <Text>Device name: {device.name}</Text>
                            </View>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => {
                                deleteDeviceFromList(token, device.device_id, setDevicesArray);
                            }}>
                                <Text style={styles.buttonText}>X</Text>
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </ScrollView>
            <Modal navigation={navigation} />
        </>

    )
}

export default MyDevices;

let styles = StyleSheet.create({
    cardsContainer: {
        display:"flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 100
    },
    deviceCard: {
        backgroundColor: "#fff",
        margin: 10,
        padding: 20,
        width: "80%",
        borderRadius: 10,
        display:"flex",
        flexDirection:"row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    buttonText: {
        fontSize: 14,
        color: "white"
    },
    deleteButton: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 4
    }
})

function deleteDeviceFromList(
    token:string,
    id:string,
    setDevicesArray: Dispatch<SetStateAction<DeviceProp[]>>
) {
    Alert.alert(
        "Usuwanie urządzenia",
        "Czy na pewno chcesz usunąć to urządzenie?",
        [
            {
                text: "Nie",
                style: "cancel"
            },
            {
                text: "Tak",
                onPress: () => {
                    console.log({
                        token,
                        id
                    })
                   deleteDevice(token, id)
                       .then((response) => {
                           console.log(JSON.stringify(response));
                          setDevicesArray((prevState) => {
                            return prevState.filter((device) => {
                                 return device.device_id !== id;
                            })
                          })
                    })
                          .catch((error) => {
                            console.log(error);
                          })
                }
            }
        ]
    )
}