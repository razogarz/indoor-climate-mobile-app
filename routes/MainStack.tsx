import { createNativeStackNavigator } from '@react-navigation/native-stack';
import About from "../screens/about";
import MyDevices from "../screens/myDevices";
import AddDevices from "../screens/addDevices";
import Dashboard from "../screens/dashboard";
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
            <Stack.Screen options={{headerLeft: () => <></>, headerTitle: "Dashboard"}} name="Dashboard" component={Dashboard} />
            <Stack.Screen options={{headerLeft: () => <></>, headerTitle: "About app"}} name="About" component={About} />
            <Stack.Screen options={{headerLeft: () => <></>, headerTitle: "My devices"}} name="MyDevices" component={MyDevices} />
            <Stack.Screen options={{headerLeft: () => <></>, headerTitle: "Add device"}} name="AddDevices" component={AddDevices} />
        </Stack.Navigator>
    );
}

export default MainStack;