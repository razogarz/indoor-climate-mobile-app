/* eslint-disable no-bitwise */
import {useMemo, useRef, useState} from "react";
import { PermissionsAndroid, Platform } from "react-native";

import {BleManager, Device} from "react-native-ble-plx";

interface BluetoothLowEnergyApi {
    requestPermissions(): Promise<boolean>;
    scanForPeripherals(): void;
    // connectToDevice: (deviceId: Device) => Promise<void>;
    // disconnectFromDevice: () => void;
    // connectedDevice: Device | null;
    allDevices: Device[];
    // heartRate: number;
}

function useBLE(): BluetoothLowEnergyApi {

    const bleManager = useMemo(() => {
        return new BleManager();
    }
    , []);
    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    const [heartRate, setHeartRate] = useState<number>(0);

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

    const isDuplicteDevice = (devices: Device[], nextDevice: Device) => {
        return devices.some((device) => device.id === nextDevice.id);
    };

    async function isBluetoothOn() {
        const isOn = await bleManager.state();
        return isOn === "PoweredOn";
    }

    const scanForPeripherals = async () => {
        let devices: Device[] = [];
        if (!await isBluetoothOn()){
            bleManager.enable().then(() => console.log("Bluetooth is now on"));
        }
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
                return;
            }
            if (device && !isDuplicteDevice(devices, device)) {
                devices.push(device);
            }
        });
        setTimeout(() => {
            bleManager.stopDeviceScan();
            setAllDevices(devices);
        }, 5000);
    }


    return {
        scanForPeripherals,
        requestPermissions,
        // connectToDevice,
        allDevices,
        // connectedDevice,
        // disconnectFromDevice,
        // heartRate,
    };
}

export default useBLE;