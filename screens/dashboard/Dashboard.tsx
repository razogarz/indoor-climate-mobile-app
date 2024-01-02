import {
    View,
    Text,
    StyleSheet, TouchableOpacity, ScrollView, TextInput,
} from "react-native";
import {Picker} from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker"
import { colors } from "../../styles/global";
import Modal from "../../components/modal";
import {useUserCredentials} from "../../components/userCredentialsContext/useUserCredentials";
import {SetStateAction, useEffect, useState} from "react";
import {getRecords} from "../../components/Endpoints";
import Record from "../../components/record";

export type WeatherRecord = {
    id: string,
    device_id: string,
    temperature: number,
    humidity: number,
    created_at: string
}

function Dashboard({navigation}: any) {
    let { verifiedLogin, token} = useUserCredentials();
    if(verifiedLogin === ""){ verifiedLogin = "User" }
    const [interval, setInterval] = useState(0);
    const [dateFrom, setDateFrom] = useState(new Date());
    const [dateTo, setDateTo] = useState(new Date());
    const [pickStartDate, setPickStartDate] = useState(false);
    const [pickEndDate, setPickEndDate] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState("No device selected");
    const [devicesArray, setDevicesArray] = useState([
        {
            id: "1",
            name: "device-1",
        }
    ]);
    const [records, setRecords] = useState([
        {
            id: "1",
            device_id: "1",
            temperature: 0,
            humidity: 0,
            created_at: "2021-09-16T14:08:38.000000Z"
        },
        {
            id: "2",
            device_id: "1",
            temperature: 0,
            humidity: 0,
            created_at: "2021-09-16T14:08:38.000000Z"
        },
        {
            id: "3",
            device_id: "1",
            temperature: 0,
            humidity: 0,
            created_at: "2021-09-16T14:08:38.000000Z"
        },
        {
            id: "4",
            device_id: "1",
            temperature: 0,
            humidity: 0,
            created_at: "2021-09-16T14:08:38.000000Z"
        },
        {
            id: "5",
            device_id: "1",
            temperature: 0,
            humidity: 0,
            created_at: "2021-09-16T14:08:38.000000Z"
        },
        {
            id: "6",
            device_id: "1",
            temperature: 0,
            humidity: 0,
            created_at: "2021-09-16T14:08:38.000000Z"
        },
        {
            id: "7",
            device_id: "1",
            temperature: 0,
            humidity: 0,
            created_at: "2021-09-16T14:08:38.000000Z"
        },
        {
            id: "8",
            device_id: "1",
            temperature: 0,
            humidity: 0,
            created_at: "2021-09-16T14:08:38.000000Z"
        },
        {
            id: "9",
            device_id: "1",
            temperature: 0,
            humidity: 0,
            created_at: "2021-09-16T14:08:38.000000Z"
        }
    ]);

    return (
        <>
            <View>
                <View>
                    <Text style={styles.welcomeText}>Welcome, {verifiedLogin}!</Text>
                    <Text> Choose device to display data from: </Text>
                    <Picker style={styles.picker} selectedValue={selectedDevice} onValueChange={
                        (itemValue: SetStateAction<string>) => setSelectedDevice(itemValue)
                    }>
                        {devicesArray.map((device, index) => {
                            return (
                                <Picker.Item key={index} label={device.name} value={device.id} />
                            )
                        })}
                    </Picker>
                </View>
                <View>
                    <Text>Choose time interval: </Text>
                    <TextInput keyboardType={"numeric"} placeholder={"Enter interval in minutes"} style={styles.numberInput}
                               onChange={(event) => {
                        setInterval(parseInt(event.nativeEvent.text));
                    }} />
                    <View style={styles.intervalsContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            setPickStartDate(true);
                        } }>
                            <Text style={styles.text}>From: {dateFrom.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {pickStartDate && (
                            <DateTimePicker value={dateFrom} mode="date" display="default" onChange={
                                (event, selectedDate) => {
                                    const currentDate = selectedDate || dateFrom;
                                    setDateFrom(currentDate);
                                    setPickStartDate(false);
                                }
                            } />
                        )}
                        <TouchableOpacity style={styles.button} onPress={() => {
                            setPickEndDate(true);
                        } }>
                            <Text style={styles.text}>To: {dateTo.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {pickEndDate && (
                            <DateTimePicker value={dateTo} mode="date" display="default" onChange={
                                (event, selectedDate) => {
                                    const currentDate = selectedDate || dateTo;
                                    setDateTo(currentDate);
                                    setPickEndDate(false);
                                }
                            } />
                        )}
                        <View style={styles.submitButtonContainer}>
                            <TouchableOpacity style={styles.submitButton} onPress={() => {
                                getRecords(token, selectedDevice, dateFrom.toLocaleDateString(), dateTo.toLocaleDateString())
                                    .then((data) => {
                                        console.log(data)
                                    })
                                    .catch((error) => {
                                        console.log(error)
                                    }
                                )
                            }
                            }>
                                <Text style={styles.submitText}>Show data</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Text>Records: </Text>
                <ScrollView>
                    {records.map((record: WeatherRecord, index) => {
                        return (
                            <Record key={index} record={record} />
                        )
                    })}
                </ScrollView>
            </View>
            <Modal navigation={navigation} />
        </>
    )
}

export default Dashboard;

let styles = StyleSheet.create({
    welcomeText: {
        fontSize: 24,
        textAlign: "center",
        marginTop: 10,
        marginBottom: 20,
        fontFamily: "montserrat-bold"
    },
    container: {
        marginTop: 10,
        height: "20%",
        alignItems: "center",
    },
    text: {
        fontSize: 16,
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
        margin: 10,
        maxWidth: "50%",
    },
    picker: {
        width: "100%",
        height: 50,
        backgroundColor: colors.gray,
        borderRadius: 10,
        marginBottom: 10
    },
    infoText: {
        fontSize: 16,
        paddingVertical: 10,
    },
    intervalsContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        flexWrap: "wrap"
    },
    submitButtonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
    },
    submitButton: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        margin: 10,
        maxWidth: "50%",
    },
    submitText:{
        color: colors.white,
        fontSize: 14,
        fontFamily: "montserrat-bold",
        textAlign: "center"
    },
    numberInput: {
        height: 50,
        backgroundColor: colors.gray,
        borderRadius: 10,
        margin: 10,
        paddingHorizontal: 10,
    }
});
