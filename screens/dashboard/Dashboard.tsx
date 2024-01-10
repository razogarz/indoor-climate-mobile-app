import {
    View,
    Text,
    StyleSheet, TouchableOpacity, ScrollView, TextInput,
} from "react-native";
import {Picker} from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker"
import { colors } from "../../styles/global";
import Modal from "../../components/modal";
import {useUserCredentials} from "../../hooks/useUserCredentials/useUserCredentials";
import {SetStateAction, useEffect, useState} from "react";
import {getDevices, getRecords} from "../../hooks/Endpoints";
import Record from "../../components/weatherRecordCard";
import {WeatherRecord} from "../../types/types";



function Dashboard({navigation}: any) {
    let { verifiedLogin, token} = useUserCredentials();
    if(verifiedLogin === ""){ verifiedLogin = "User" }
    const [dateFrom, setDateFrom] = useState(new Date());
    const [dateTo, setDateTo] = useState(new Date());
    const [pickStartDate, setPickStartDate] = useState(false);
    const [pickEndDate, setPickEndDate] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<string>();
    const [devicesArray, setDevicesArray] = useState([
        {
            device_id: "1",
            name: "device-1",
        }
    ]);
    const [records, setRecords] = useState([] as WeatherRecord[]);

    useEffect(() => {
        getDevices(token)
            .then((devices) => {
                console.log(devices)
                setDevicesArray(devices);
                setSelectedDevice(prev => {
                    prev = devices[0].device_id;
                    return prev;
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }, [token]);

    return (
        <>
            <ScrollView>
                <View>
                    <Text style={styles.welcomeText}>Welcome, {verifiedLogin}!</Text>
                    <Text> Choose device to display data from: </Text>
                    <Picker style={styles.picker} selectedValue={selectedDevice} onValueChange={
                        (itemValue, itemIndex) => {
                            setSelectedDevice(itemValue);
                        }
                    }>
                        {devicesArray.map((device, index) => {
                            return (
                                <Picker.Item key={index} label={device.name} value={device.device_id} />
                            )
                        })}
                    </Picker>
                </View>
                <View>
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
                                    .then((data:WeatherRecord[]) => {
                                        console.log(data);
                                        setRecords(data);
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
                <View>
                    {records.length > 0 && records.map((record: WeatherRecord, index) => {
                        return (
                            <Record key={index} record={record} />
                        )
                    })}
                </View>
            </ScrollView>
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
