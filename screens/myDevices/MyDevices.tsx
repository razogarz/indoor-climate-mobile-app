import {View, Text, StyleSheet, TouchableOpacity, Alert} from "react-native";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import Modal from "../../components/modal";
import {useUserCredentials} from "../../components/userCredentialsContext/useUserCredentials";
import {deleteDevice, getDevices} from "../../components/Endpoints";
// import {Dispatch, SetStateAction, useState} from "react";

type DeviceProp = {
    id: string,
    name: string
}
function MyDevices({navigation}: any) {
    const {token} = useUserCredentials();
    const [devicesArray, setDevicesArray] = useState({} as DeviceProp[]);

    useEffect(() => {
        getDevices(token)
            .then((devices) => {
                setDevicesArray(devices);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [token, devicesArray]);

    return (
        <>
            <View style={styles.cardsContainer}>
                {devicesArray.length > 0 && devicesArray.map((device, index) => {
                    return (
                        <View style={styles.deviceCard} key={index}>
                            <View>
                                <Text>Device id: {device.id}</Text>
                                <Text>Device name: {device.name}</Text>
                            </View>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => {
                                deleteDeviceFromList(token, device.id, setDevicesArray);
                            }}>
                                <Text style={styles.buttonText}>X</Text>
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </View>
            <Modal navigation={navigation} />
        </>

    )
}

export default MyDevices;

let styles = StyleSheet.create({
    cardsContainer: {
        display:"flex",
        justifyContent: "center",
        alignItems: "center"
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
                   deleteDevice(token, id)
                       .then(() => {
                          setDevicesArray((prevState) => {
                            return prevState.filter((device) => {
                                 return device.id !== id;
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