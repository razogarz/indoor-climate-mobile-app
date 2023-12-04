/* eslint-disable no-bitwise */
import {useMemo, useState} from "react";
import {PermissionsAndroid, Platform} from "react-native";

import {BleManager, Device} from "react-native-ble-plx";

interface BluetoothLowEnergyApi {
    requestPermissions(): Promise<boolean>;
    scanForPeripherals(): void;
    allDevices: Device[];
    connectToDevice(deviceId: string): void;
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
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,

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

    const connectToDevice = async (deviceId: string) => {
        console.log("Connecting to device: ", deviceId)
        bleManager.connectToDevice(deviceId)
            .then((device) => {
                console.log("Connected to device: ", device.id);
                device.discoverAllServicesAndCharacteristics()
                    .then((device) => {
                        console.log("All services and characteristics discovered");
                        console.log("Device: ", JSON.stringify(device, null, 2));
                    })
                    .catch((error) => console.log("An error occurred while discovering services and characteristics", error));
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