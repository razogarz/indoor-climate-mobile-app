import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    KeyboardAvoidingView,
    TouchableOpacity,
    Image,
    Alert
} from "react-native";
import {useState, Dispatch, SetStateAction, useContext} from "react";
import {styles} from "../../styles/global";
import {endpoints} from "../../components/Endpoints";
import {useUserCredentials} from "../../components/userCredentials/UserCredentials";

function Login({navigation}: any){
    const {setVerifiedLogin, setVerifiedPassword, setToken} = useUserCredentials();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);

    return(
        <View style={[styles.wrapper, {backgroundColor:"white"}]}>
            <View style={styles.container}>
                <View style={{
                    alignItems: "center",
                }}>
                    <Image source={require("../../assets/kretLogo.png")} style={styles.logo} />
                    <Text style={{fontSize: 20, marginBottom:10}}>Krecik i spułka</Text>
                </View>
                <Text style={{color: loginError ? "red" : "white"}}>
                    Invalid username or password
                </Text>
                <TextInput
                    placeholder="Enter your username"
                    onChangeText={text => setLogin(text)}
                    style={styles.textInput}
                />
                <TextInput
                    placeholder="Enter your password"
                    onChangeText={text => setPassword(text)}
                    style={styles.textInput}
                    secureTextEntry={true}
                    value={password}
                />
                <TouchableOpacity style={styles.button} onPress={
                    () => handleLogin(login, password, setPassword, setLoginError, navigation, setVerifiedLogin, setVerifiedPassword, setToken)
                }>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={
                    () => navigation.navigate("Register")
                }>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Login;

function handleLogin(
    login: string,
    password: string,
    setPassword: Dispatch<SetStateAction<string>>,
    setLoginError: Dispatch<SetStateAction<boolean>>,
    navigation: any,
    setVerifiedLogin: Dispatch<SetStateAction<string>>,
    setVerifiedPassword: Dispatch<SetStateAction<string>>,
    setToken: Dispatch<SetStateAction<string>>
){
    fetch(endpoints.login, {
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
            navigation.navigate("Home");
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