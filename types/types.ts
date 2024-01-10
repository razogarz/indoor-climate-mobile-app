import {Device} from "react-native-ble-plx";

export type BluetoothLowEnergyApi = {
    requestPermissions(): Promise<boolean>;
    scanForPeripherals(): void;
    bleDevicesList: Device[];
    connectToDevice(bearer_token: string, deviceId: string, wifiPass: string): void;
}

export type decryptedData = {
    iv: string,
    cipher: string
}

// {
//     "when": "2024-01-10T16:00:00.054000Z",
//     "temperature": 25.02,
//     "pressure": 1002.2,
//     "device_id": 76
// },
export type WeatherRecord = {
    device_id: string,
    temperature: number,
    pressure: number,
    when: string
}

export type DeviceProperties = {
    device_id: string,
    name: string
}