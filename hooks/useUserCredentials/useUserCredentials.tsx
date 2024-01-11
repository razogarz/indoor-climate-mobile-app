import {createContext, useContext, useState, Dispatch, SetStateAction, useEffect} from "react";
import {DeviceProperties} from "../../types/types";
import {getDevices} from "../Endpoints";

const UserCredentialsContext = createContext({
    verifiedLogin: '',
    setVerifiedLogin: (login: string) => {},
    verifiedPassword: '',
    setVerifiedPassword: (password: string) => {},
    token: '',
    setToken: (token: string) => {},
    devices: [] as DeviceProperties[],
    setAddDeviceSignal: (state: (prev) => boolean) => {},
});

export function useUserCredentials () {
    return useContext(UserCredentialsContext);
}

export default function UserCredentialsProvider({children}: any) {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [devicesArray, setDevicesArray] = useState([] as DeviceProperties[]);
    const [addDeviceSignal, setAddDeviceSignal] = useState(false);

    useEffect(() => {
        getDevices(token)
            .then((devices) => {
                setDevicesArray(devices);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [token, addDeviceSignal]);

    return (
        <UserCredentialsContext.Provider value={{
            verifiedLogin: login,
            setVerifiedLogin: setLogin,
            verifiedPassword: password,
            setVerifiedPassword: setPassword,
            token: token,
            setToken: setToken,
            devices: devicesArray,
            setAddDeviceSignal: setAddDeviceSignal,
        }}>
            {children}
        </UserCredentialsContext.Provider>
    )
}