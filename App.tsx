import React from "react";
import Navigator from "./routes/MainStack";
import {NavigationContainer} from "@react-navigation/native";
import {useFonts} from "expo-font";
import UserCredentialsProvider from "./hooks/useUserCredentials";



function App() {
    const [fontIsLoaded] = useFonts({
        'montserrat': require('./assets/fonts/static/Montserrat-Regular.ttf'),
        'montserrat-bold': require('./assets/fonts/static/Montserrat-Bold.ttf'),
        'montserrat-light': require('./assets/fonts/static/Montserrat-Light.ttf'),
    });
    global.Buffer = require('buffer').Buffer;


    return fontIsLoaded ? (
        <>
            <UserCredentialsProvider>
                <NavigationContainer>
                    <Navigator />
                </NavigationContainer>
            </UserCredentialsProvider>
        </>
    ) : null;
}

export default App;
