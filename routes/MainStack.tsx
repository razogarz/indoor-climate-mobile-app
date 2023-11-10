import { createNativeStackNavigator } from '@react-navigation/native-stack';
import About from "../screens/about";
import Data from "../screens/data";
import Home from "../screens/home";
import Login from "../screens/login";
import Register from "../screens/register";

const Stack = createNativeStackNavigator();

function MainStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen options={{headerShown: false}}
                          name={"Login"} component={Login} />
            <Stack.Screen options={{headerTitle: ""}}
                          name={"Register"} component={Register} />
            <Stack.Screen options={{headerLeft: () => <></>, headerTitle: ""}} name="Home" component={Home} />
            <Stack.Screen name="About" component={About} />
            <Stack.Screen name="Data" component={Data} />
        </Stack.Navigator>
    );
}

export default MainStack;