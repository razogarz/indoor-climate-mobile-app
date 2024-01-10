import {View, Text, StyleSheet} from "react-native";
import {WeatherRecord} from "../../types/types";


export default function WeatherRecordCard(props: { record: WeatherRecord }) {
    const { device_id, pressure, temperature, when } = props.record;
    return (
        <View style={styles.record}>
            <Text>Device ID: {device_id}</Text>
            <Text>Temperature: {temperature}</Text>
            <Text>Pressure: {pressure}</Text>
            <Text>Created at: {when.slice(0,10)}</Text>
            <Text>Time: {when.slice(11,19)}</Text>
        </View>
    )
}

let styles = StyleSheet.create({
    record: {
        backgroundColor: "#fff",
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }
})