/* eslint-disable no-bitwise */
import {useMemo, useState} from "react";
import {Alert, PermissionsAndroid, Platform} from "react-native";
import WifiManager from "react-native-wifi-reborn";

import {BleManager, Device} from "react-native-ble-plx";
import {createDevice, deleteDevice} from "./Endpoints";
import Aes from 'react-native-aes-crypto'

interface BluetoothLowEnergyApi {
    requestPermissions(): Promise<boolean>;
    scanForPeripherals(): void;
    allDevices: Device[];
    connectToDevice(bearer_token: string, deviceId: string, wifiName:string, wifiPass: string): void;
}

type decryptedData = {
    iv: string,
    cipher: string
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
        await WifiManager.getCurrentWifiSSID()
            .then(ssid => {
                console.log("Your current connected wifi SSID is " + ssid);
                wifiName = ssid;
            })
            .catch((error) => {
                console.log(error);
            });
        bleManager.connectToDevice(deviceId)
            .then(async (device) => {
                console.log("Connected to device: ", device.id);
                device.discoverAllServicesAndCharacteristics()
                    .then((device) => {
                            // console.log("All services and characteristics discovered");
                            // console.log("Device: ", JSON.stringify(device, null, 2));
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
        allDevices,
        connectToDevice
    };
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
    console.log("Message: ", message);
    const fullEncryptedMessage = await encryptData(message)
    //utf8
    device.writeCharacteristicWithoutResponseForService(
        service,
        characteristic,
        Buffer.from(fullEncryptedMessage, "utf8").toString("base64")
    )
        .then((characteristic) => console.log("Data written to characteristic", JSON.stringify(characteristic, null, 2)))
        .catch((error) => console.log("An error occurred while writing data to characteristic", JSON.stringify(error, null, 2)))
        // .finally(() => {
        //     const response = device.readCharacteristicForService(service, characteristic)
        //         .then(async r => {
        //             /*
        //             * R - Ready for config
        //             * S - success
        //             * T - failed, invalid token
        //             * D - failed, invalid data
        //             * timeout na czekanie na odpowiedź drugi raz, jak zwróci S to koniec, jak R to wysyłamy jeszcze raz
        //             * */
        //             const rpiResponse = Buffer.from(r.value?.toString() || "", "base64").toString("utf8");
        //             if(!r.value) return;
        //             const response = await decryptData(r.value.toString());
        //             console.log("Response: ", response);
        //             switch (response) {
        //                 case "R":
        //                     break;
        //                 case "S":
        //                     console.log("Success");
        //                     break;
        //                 case "T":
        //                     console.log("Failed, invalid token");
        //                     deleteDevice(bearer_token, device.id)
        //                         .then(() => console.log("Device deleted successfully"))
        //                         .catch((error) => console.log("An error occurred while deleting device", error));
        //                     break;
        //                 case "D":
        //                     console.log("Failed, invalid data");
        //                     deleteDevice(bearer_token, device.id)
        //                         .then(() => console.log("Device deleted successfully"))
        //                         .catch((error) => console.log("An error occurred while deleting device", error));
        //                     break;
        //                 default:
        //                     console.log("Unknown response");
        //             }
        //             return response;
        //         })
        //         .catch(e => {
        //             deleteDevice(bearer_token, device.id)
        //                 .then(() => console.log("Device deleted successfully"))
        //                 .catch((error) => console.log("An error occurred while deleting device", error));
        //             console.log("Error while reading characteristic", e)
        //         });
        // });
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

const generateKey = (password:string, salt:string, cost:number, length:number) => Aes.pbkdf2(password, salt, cost, length, "sha256");

const encryptData = async (text: string) => {
    const iv = "41d2067961d7438aab6f2ac736b2d136";
    const key = "306f56538ca5ecbc416a58480102f5f0735bf4fe29d409b81a18f621756e126c";
    return await Aes.encrypt(text, key, iv, 'aes-256-cbc');
}

function decryptData (encryptedData:string) {
    const iv = "41d2067961d7438aab6f2ac736b2d136";
    const key = "306f56538ca5ecbc416a58480102f5f0735bf4fe29d409b81a18f621756e126c";
    return Aes.decrypt(encryptedData, key, iv, 'aes-256-cbc')
        .then((decryptedData) => {
        console.log("Decrypted: ", decryptedData);
        return decryptedData;
    })
        .catch((error) => console.log("An error occurred while decrypting data", error));
}

// const generateRandomIV = () => {
//     return CryptoJS.lib.WordArray.random(16).toString();
// }
//
// const encryptData = (plainText: string, key: string, iv: any) => {
//     const keyWordArray = CryptoJS.enc.Utf8.parse(key);
//
//     const encrypted = CryptoJS.AES.encrypt(plainText, keyWordArray, {
//         iv: iv,
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7
//     });
//     return iv.concat(encrypted.ciphertext.toString(CryptoJS.enc.Base64));
// }
//
// const decryptData = (encryptedData:any, key: string, iv: CryptoJS.lib.WordArray) => {
//     const keyWordArray = CryptoJS.enc.Utf8.parse(key);
//     const decrypted = CryptoJS.AES.decrypt(encryptedData, keyWordArray, {
//         iv: iv,
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7
//     });
//     return decrypted.toString(CryptoJS.enc.Utf8);
// }
export default useBLE;