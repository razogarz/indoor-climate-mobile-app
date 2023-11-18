/* eslint-disable no-bitwise */
import { useMemo, useState} from "react";
import { PermissionsAndroid, Platform } from "react-native";

import {BleManager, Device} from "react-native-ble-plx";

interface BluetoothLowEnergyApi {
    requestPermissions(): Promise<boolean>;
    scanForPeripherals(): void;
    allDevices: Device[];
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

    const isDuplicteDevice = (devices: Device[], nextDevice: Device) => {
        return devices.some((device) => device.id === nextDevice.id);
    };

    async function enableBluetooth() {
        const isOn = await bleManager.state();
        if( isOn !== "PoweredOn")
            bleManager.enable()
                .then(() => console.log("Bluetooth is now on"))
                .catch((error) => console.log("An error occurred while enabling Bluetooth", error));
        return isOn === "PoweredOn";
    }

    async function singleScan(): Promise<Device[]> {
        const devices: Device[] = [];
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                bleManager.stopDeviceScan();
                return;
            }
            if (
                device
                // && !isDuplicteDevice(devices, device)
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
        await enableBluetooth();
        const devices = await singleScan();
        console.log("Found addDevices: ", devices.map((device) => device.name));
        setAllDevices((prev) => {
            const savedDevicesMAC = prev.map((device) => device.id);
            const newDevices = devices.filter((device) => !savedDevicesMAC.includes(device.id) && device.name);
            return [...prev, ...newDevices];
        });
    }


    return {
        scanForPeripherals,
        requestPermissions,
        allDevices,
    };
}

export default useBLE;