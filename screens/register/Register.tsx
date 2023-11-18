import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import {useState, Dispatch, SetStateAction} from "react";
import {styles} from "../../styles/global";
import {endpoints} from "../../components/Endpoints";

function Register({navigation}: any){
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    return (
        <View style={styles.wrapper}>
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Name"
                onChangeText={text => setLogin(text)}
                value={login}
            />
            <TextInput
                style={styles.textInput}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={text => setPassword(text)}
                value={password}
            />
            <TextInput
                style={styles.textInput}
                placeholder="Confirm Password"
                secureTextEntry={true}
                value={confirmPass}
                onChangeText={text => setConfirmPass(text)}
            />
            <TouchableOpacity style={styles.button} onPress={() =>
                handleRegister(navigation, login, password, confirmPass, setConfirmPass, setPassword)
            }>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    </View>
    )
}

export default Register;

function handleRegister(
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
