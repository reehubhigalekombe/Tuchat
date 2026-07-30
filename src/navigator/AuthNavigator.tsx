import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import Prof from "../screens/Prof";

export type AuthStackParamList = {
    Login: undefined;
    SignUp: undefined
    Prof: {
        userId: string;
    }
}
const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp}  />
            <Stack.Screen  name="Prof"  component={Prof}/>
        </Stack.Navigator>
    );
}