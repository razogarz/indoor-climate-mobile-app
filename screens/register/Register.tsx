import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import {useState, Dispatch, SetStateAction} from "react";
import {styles} from "../../styles/global";
import { handleRegister} from "../../components/Endpoints";

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


