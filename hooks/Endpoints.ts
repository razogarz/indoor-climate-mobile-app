import {Alert} from "react-native";
import {Dispatch, SetStateAction} from "react";

const url = "https://krecikiot.cytr.us"

const endpoints = {
    register: url + "/users/register",
    login: url + "/users/login",
    devices: url + "/devices",
    records: url + "/records"
}

export async function handleRegister(
    navigation: any,
    login: string,
    password: string,
    confirmPass: string,
    setConfirmPass: Dispatch<SetStateAction<string>>,
    setPass: Dispatch<SetStateAction<string>>
) {
    if(password !== confirmPass){
        alert("Passwords do not match");
        setPass('');
        setConfirmPass('');
        return;
    }
    const body = JSON.stringify({
        login: login,
        password: password
    });
    fetch(endpoints.register, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: body
    })
        .then(res => {
            return res.json();
        })
        .then(data => {
                //if addDevices has message its error, if its null its success
                if(data.message){
                    alert(data.message);
                    setPass('');
                    setConfirmPass('');
                    return;
                }
            }
        )
        .catch(_err => {
            alert("Success! You can now log in.");
            navigation.navigate('Login');
        });
}

export async function handleLogin(
    login: string,
    password: string,
    setPassword: Dispatch<SetStateAction<string>>,
    setLoginError: Dispatch<SetStateAction<boolean>>,
    navigation: any,
    setVerifiedLogin: (login: string) => void,
    setVerifiedPassword: (password: string) => void,
    setToken: (token: string) => void
){
    console.log({
        login,
        password
    })
    return fetch(endpoints.login, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            login,
            password
        })
    })
        .then(response => response.json())
        .then(data => {
            if(data.user_bearer_token){
                setLoginError(false);
                setVerifiedLogin(login);
                setVerifiedPassword(password);
                setToken(data.user_bearer_token);
                navigation.navigate("Dashboard");
            }
            else if(data.message === "Could not find user with provided credentials."){
                setLoginError(true);
                Alert.alert("Podano nieprawidłowe dane logowania.");
            }
            else {
                setLoginError(true);
                Alert.alert("Błąd serwera! Spróbuj ponownie później.");
                console.log({
                    data
                })
            }
        })
        .catch((error) => {
            setLoginError(true);
            Alert.alert("Podano nieprawidłowe dane logowania.");
            console.log(error)
        })
        .finally(() => {
                setPassword('');
            }
        );
}

export async function getDevices(token: string){
    return fetch(endpoints.devices, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch((error) => {
            Alert.alert("Błąd serwera! Spróbuj ponownie później.");
        });
}

type createDeviceResponse = {
    device_bearer_token: string
    device_id: string
    name: string
}

export async function createDevice(token: string, deviceId: string){
    return fetch(endpoints.devices, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: deviceId
        })
    })
        .then(response => response.json())
        .then((data: createDeviceResponse) => {
            return data.device_bearer_token;
        })
        .catch((error) => {
            Alert.alert("Błąd serwera! Spróbuj ponownie później.");
            return "";
        });
}

export async function deleteDevice(token: string, deviceId: string){
    const url = `${endpoints.devices}/${deviceId}`;
    return fetch(url, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch((error) => {
            Alert.alert("Błąd serwera! Spróbuj ponownie później.");
        });
}

export async function logDevice(
    token: string,
    deviceId: string
){
    return fetch(endpoints.devices + "/" + deviceId + "/login", {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch((error) => {
            Alert.alert("Błąd serwera! Spróbuj ponownie później.");
        });
}

export async function getRecords(
    token: string,
    deviceId: string | undefined,
    from: Date,
    to: Date
) {
    if(token === "" || !deviceId) return [];
    let fromShifted = new Date(JSON.parse(JSON.stringify(from)))
    let toShifted = new Date(JSON.parse(JSON.stringify(to)))
    const fromISO = `${from.toISOString().slice(0, 10)}T00:00:00.000Z`
    const toISO = `${to.toISOString().slice(0, 10)}T23:59:59.999Z`
    console.log({
        from: fromISO,
        to: toISO
    });
    const urlRep = `${endpoints.records}?device_id=${deviceId}&start_date=${fromISO}&end_date=${toISO}`;
    return fetch(urlRep, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
                return response.json();
            }
        )
        .then(data => {
            return data;
        })
        .catch((error) => {
            Alert.alert("Błąd serwera! Spróbuj ponownie później.");
        });
}

function shiftDateByHours(date: Date, hours: number){
    return new Date(date.setHours(date.getHours() + hours));
}