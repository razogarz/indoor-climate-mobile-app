import {View, Text, StyleSheet, TouchableOpacity, Alert} from "react-native";
import {Dispatch, SetStateAction, useState} from "react";
import Modal from "../../components/modal";
// import {Dispatch, SetStateAction, useState} from "react";

type DeviceProp = {
    id: string,
    name: string
}
function MyDevices({navigation}: any) {
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
    return (
        <>
            <View style={styles.cardsContainer}>
                {devicesArray.map((device, index) => {
                    return (
                        <View style={styles.deviceCard} key={index}>
                            <View>
                                <Text>Device id: {device.id}</Text>
                                <Text>Device name: {device.name}</Text>
                            </View>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => {
                                deleteDevice(device.id, setDevicesArray);
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

function deleteDevice(
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
                    setDevicesArray((prevState) => {
                        return prevState.filter(device => device.id !== id);
                    })
                }
            }
        ]
    )
}