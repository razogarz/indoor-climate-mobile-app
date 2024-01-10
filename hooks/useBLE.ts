/* eslint-disable no-bitwise */
import {useMemo, useState} from "react";
import {Alert, PermissionsAndroid, Platform} from "react-native";
import WifiManager from "react-native-wifi-reborn";

import {BleManager, Device} from "react-native-ble-plx";
import {createDevice, deleteDevice} from "./Endpoints";
import Aes from 'react-native-aes-crypto'
import {BluetoothLowEnergyApi} from "../types/types";



function useBLE(): BluetoothLowEnergyApi {
    const bleManager = useMemo(() => {return new BleManager();}, []);
    const [bleDevicesList, setBleDevicesList] = useState<Device[]>([]);

    const requestPermissions = async () => {
        if (Platform.OS === 'ios') {
            //nie korzystamy z ios
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

    const scanForPeripherals = async () => {
        await _enableBluetooth(bleManager);
        const devices = await _singleScan(bleManager);
        setBleDevicesList((prev) => {
            const savedDevicesMAC = prev.map((device) => device.id);
            const newDevices = devices.filter((device) => !savedDevicesMAC.includes(device.id));
            return [...prev, ...newDevices];
        });
    }

    const connectToDevice = async (bearer_token: string, deviceId: string, wifiPass: string) => {

        let wifiName = "";
        if(wifiPass === ""){
            AlertNoWifiCredentials();
            return;
        }
        await WifiManager.getCurrentWifiSSID()
            .then(ssid => {
                wifiName = ssid;
            })
            .catch((error) => {
                console.log(error);
            });
        //rozpoczynamy proces łączenia z urządzeniem
        bleManager.connectToDevice(deviceId)
            .then(async (device) => {
                device.discoverAllServicesAndCharacteristics()
                    .then((device) => {
                            createDevice(bearer_token, device.id)
                                .then(async (rpiToken: string) => {
                                    const response = await sendWiFiCredentials(
                                        bearer_token,
                                        device,
                                        rpiToken,
                                        wifiName,
                                        wifiPass
                                    );
                                })
                                .then(() => console.log("Device created successfully"))
                                .catch((error) => {
                                    deleteDevice(bearer_token, device.id)
                                    console.log("An error occurred while creating device", error);
                                });
                        }
                    )
                    .catch((error) => console.log("An error occurred while discovering all services and characteristics", error));
            })
            .catch((error) => console.log("An error occurred while connecting to device", error));
    }
    return {
        scanForPeripherals,
        requestPermissions,
        bleDevicesList,
        connectToDevice
    };
}
const _isDuplicteDevice = (devices: Device[], nextDevice: Device) => {
    return devices.some((device) => device.id === nextDevice.id);
};

async function _enableBluetooth(bleManager: BleManager) {
    const isOn = await bleManager.state();
    if( isOn !== "PoweredOn")
        bleManager.enable()
            .then(() => console.log("Bluetooth is now on"))
            .catch((error) => console.log("An error occurred while enabling Bluetooth", error));
    return isOn === "PoweredOn";
}

async function _singleScan(bleManager:BleManager): Promise<Device[]> {
    const devices: Device[] = [];
    bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            bleManager.stopDeviceScan();
            return;
        }
        if (
            device
            && !_isDuplicteDevice(devices, device)
            && device.name !== null
        ) {
            bleManager.stopDeviceScan();
            devices.push(device);
        }
    });
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            bleManager.stopDeviceScan();
            resolve(devices);
        }, 100);
    });
}
async function sendWiFiCredentials(bearer_token: string, device: Device, rpiToken: string, wifiName: string, wifiPass: string): Promise<string> {
    const service = "00000001-710e-4a5b-8d75-3e5b444bc3cf";
    const characteristic = "00000004-710e-4a5b-8d75-3e5b444bc3cf";
    const message = JSON.stringify({
        wifi_ssid: wifiName,
        wifi_password: wifiPass,
        host: "https://krecikiot.cytr.us/",
        auth_token: rpiToken
    });
    const fullEncryptedMessage = await encryptData(message)
    device.writeCharacteristicWithoutResponseForService(
        service,
        characteristic,
        Buffer.from(fullEncryptedMessage, "utf8").toString("base64")
    )
        .then((characteristic) => console.log("Data written to characteristic", JSON.stringify(characteristic, null, 2)))
        .catch((error) => console.log("An error occurred while writing data to characteristic", JSON.stringify(error, null, 2)))
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
const encryptData = async (text: string) => {
    const iv = "41d2067961d7438aab6f2ac736b2d136";
    const key = "306f56538ca5ecbc416a58480102f5f0735bf4fe29d409b81a18f621756e126c";
    return await Aes.encrypt(text, key, iv, 'aes-256-cbc');
}
export default useBLE;