import {View, Text, StyleSheet} from "react-native";
import {WeatherRecord} from "../../screens/dashboard/Dashboard";


function Record(props: { record: WeatherRecord }) {
    const { id, device_id, temperature, humidity, created_at } = props.record;
    return (
        <View style={styles.record}>
            <Text>ID: {id}</Text>
            <Text>Device ID: {device_id}</Text>
            <Text>Temperature: {temperature}</Text>
            <Text>Humidity: {humidity}</Text>
            <Text>Created at: {created_at}</Text>
        </View>
    )
}

export default Record;

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