import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert
} from "react-native";
import {useState, Dispatch, SetStateAction, useContext} from "react";
import {styles} from "../../styles/global";
import {handleLogin} from "../../components/Endpoints";
import {useUserCredentials} from "../../components/userCredentialsContext/useUserCredentials";

function Login({navigation}: any){
    const {setVerifiedLogin, setVerifiedPassword, setToken} = useUserCredentials();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);

    // @ts-ignore
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
                <TouchableOpacity style={styles.button} onPress={
                    () => navigation.navigate("Dashboard")
                }>
                    <Text style={styles.buttonText}>Dashboard</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Login;
