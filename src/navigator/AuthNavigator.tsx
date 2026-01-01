import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";


const Stack = createNativeStackNavigator();

export default function AuthNavigator({setIsAuthenticated}: any) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >

            <Stack.Screen name="Login">
              {(props)  => <Login {...props} setIsAuthenticated={setIsAuthenticated}  />}
            </Stack.Screen>

            <Stack.Screen name="SignUp" component={SignUp}  />
        </Stack.Navigator>
    );
}