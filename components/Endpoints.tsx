import {Alert} from "react-native";
import {Dispatch, SetStateAction} from "react";

const url = "https://krecik.bieda.it";

const endpoints = {
    register: url + "/users/register",
    login: url + "/users/login",
    devices: url + "/devices",
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
            } else {
                setLoginError(true);
                Alert.alert("Błąd serwera! Spróbuj ponownie później.");
            }
        })
        .catch((error) => {
            setLoginError(true);
            Alert.alert("Podano nieprawidłowe dane logowania.");
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
        .then(data => {
            return data;
        })
        .catch((error) => {
            Alert.alert("Błąd serwera! Spróbuj ponownie później.");
        });
}

export async function deleteDevice(token: string, deviceId: string){
    return fetch(endpoints.devices + "/" + deviceId, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
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
    deviceId: string,
    from: string,
    to: string
) {
    const urlRep = new URL(endpoints.devices)
    urlRep.searchParams.append("device_id", deviceId);
    urlRep.searchParams.append("start_date", from);
    urlRep.searchParams.append("end_date", to);

    return fetch(urlRep.toString(), {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
                console.log(response);
                return response.json();
            }
        )
        .then(data => {
            console.log(data);
            return data;
        })
        .catch((error) => {
            Alert.alert("Błąd serwera! Spróbuj ponownie później.");
        });
}