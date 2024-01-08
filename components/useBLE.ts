/* eslint-disable no-bitwise */
import {useMemo, useState} from "react";
import {Alert, PermissionsAndroid, Platform} from "react-native";

import {BleManager, Device} from "react-native-ble-plx";
import {createDevice, deleteDevice} from "./Endpoints";

interface BluetoothLowEnergyApi {
    requestPermissions(): Promise<boolean>;
    scanForPeripherals(): void;
    allDevices: Device[];
    connectToDevice(bearer_token: string, deviceId: string, wifiName:string, wifiPass: string): void;
}

function useBLE(): BluetoothLowEnergyApi {

    const bleManager = useMemo(() => {return new BleManager();}, []);
    const [allDevices, setAllDevices] = useState<Device[]>([]);

    const requestPermissions = async () => {
        if (Platform.OS === 'ios') {
            return true
        }
        if (Platform.OS === 'android' && PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) {
            const apiLevel = parseInt(Platform.Version.toString(), 10)

            if (apiLevel < 31) {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                return granted === PermissionsAndroid.RESULTS.GRANTED
            }
            if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN && PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
                const result = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                ])

                return (
                    result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
                    result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
                    result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
                )
            }
        }

        return false
    }

    const _isDuplicteDevice = (devices: Device[], nextDevice: Device) => {
        return devices.some((device) => device.id === nextDevice.id);
    };

    async function _enableBluetooth() {
        const isOn = await bleManager.state();
        if( isOn !== "PoweredOn")
            bleManager.enable()
                .then(() => console.log("Bluetooth is now on"))
                .catch((error) => console.log("An error occurred while enabling Bluetooth", error));
        return isOn === "PoweredOn";
    }

    async function _singleScan(): Promise<Device[]> {
        const devices: Device[] = [];
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                bleManager.stopDeviceScan();
                return;
            }
            if (
                device
                && !_isDuplicteDevice(devices, device)
            ) {
                bleManager.stopDeviceScan();
                devices.push(device);
            }
        });
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                bleManager.stopDeviceScan();
                resolve(devices);
            }, 1000);
        });
    }

    const scanForPeripherals = async () => {
        await _enableBluetooth();
        const devices = await _singleScan();
        console.log("Devices: ", devices.map((device) => device.id));
        setAllDevices((prev) => {
            const savedDevicesMAC = prev.map((device) => device.id);
            const newDevices = devices.filter((device) => !savedDevicesMAC.includes(device.id));
            return [...prev, ...newDevices];
        });
    }

    const connectToDevice = async (bearer_token: string, deviceId: string, wifiName:string, wifiPass: string) => {
        if(wifiPass === ""){
            AlertNoWifiCredentials();
            return;
        }
        //get currently connected wifissid
        // const currentWifiSSID = await WifiManager.getCurrentWifiSSID();

        bleManager.connectToDevice(deviceId)
            .then(async (device) => {
                console.log("Connected to device: ", device.id);
                // device.discoverAllServicesAndCharacteristics()
                //     .then((device) => {
                //             // console.log("All services and characteristics discovered");
                //             // console.log("Device: ", JSON.stringify(device, null, 2));
                //             createDevice(bearer_token, device.id)
                //                 .then((rpiToken: string) => {
                //                     sendWiFiCredentials(
                //                         bearer_token,
                //                         device,
                //                         rpiToken,
                //                         wifiName,
                //                         wifiPass
                //                     );
                //                 })
                //                 .then(() => console.log("Device created successfully"))
                //                 .catch((error) => {
                //                     deleteDevice(bearer_token, device.id)
                //                     console.log("An error occurred while creating device", error);
                //                 });
                //         }
                //     )
                //     .catch((error) => console.log("An error occurred while discovering all services and characteristics", error));
            })
            .catch((error) => console.log("An error occurred while connecting to device", error));
    }
    return {
        scanForPeripherals,
        requestPermissions,
        allDevices,
        connectToDevice
    };
}

export default useBLE;

function sendWiFiCredentials(bearer_token: string, device: Device, rpiToken:string, wifiName: string, wifiPass: string): string {
    //ask user if he is sure of connecting to the device
    console.log({
        rpiToken,
    })
    const service = "00000001-710e-4a5b-8d75-3e5b444bc3cf";
    const characteristic = "00000004-710e-4a5b-8d75-3e5b444bc3cf";
    // const buffer = new Buffer(wifiName + ":" + wifiPass);
    const fullMessage = JSON.stringify({
        wifi_ssid: wifiName,
        wifi_password: wifiPass,
        host: "https://krecikiot.cytr.us/",
        auth_token: rpiToken
    })
    const dataBuffer = Buffer.from(fullMessage, "utf8")
    //utf8
    device.writeCharacteristicWithoutResponseForService(
        service,
        characteristic,
        dataBuffer.toString("base64")
    )
        .then((characteristic) => console.log("Data written to characteristic", JSON.stringify(characteristic, null, 2)))
        .catch((error) => console.log("An error occurred while writing data to characteristic", JSON.stringify(error, null, 2)))
        .finally(() => {
            const response = device.readCharacteristicForService(service, characteristic)
                .then(r => {
                    /*
                    * R - Ready for config
                    * S - success
                    * T - failed, invalid token
                    * D - failed, invalid data
                    * timeout na czekanie na odpowiedź drugi raz, jak zwróci S to koniec, jak R to wysyłamy jeszcze raz
                    * */
                    const response = Buffer.from(r.value || "", "base64").toString("utf8");
                    console.log("Response: ", response);
                    switch (response) {
                        case "R":
                            break;
                        case "S":
                            console.log("Success");
                            break;
                        case "T":
                            console.log("Failed, invalid token");
                            deleteDevice(bearer_token, device.id)
                                .then(() => console.log("Device deleted successfully"))
                                .catch((error) => console.log("An error occurred while deleting device", error));
                            break;
                        case "D":
                            console.log("Failed, invalid data");
                            deleteDevice(bearer_token, device.id)
                                .then(() => console.log("Device deleted successfully"))
                                .catch((error) => console.log("An error occurred while deleting device", error));
                            break;
                        default:
                            console.log("Unknown response");
                    }
                    return response;
                })
                .catch(e => {
                    deleteDevice(bearer_token, device.id)
                        .then(() => console.log("Device deleted successfully"))
                        .catch((error) => console.log("An error occurred while deleting device", error));
                    console.log("Error while reading characteristic", e)
                });
        });
    return "";
}
function AlertNoWifiCredentials() {
    Alert.alert(
        "No Wifi credentials",
        "Please enter wifi credentials",
        [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            }
        ]
    );
}
