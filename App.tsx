import React, {useContext} from "react";
import { View} from "react-native";
import { ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigator/AppNavigator";
import AuthNavigator from "./src/navigator/AuthNavigator";
import UserProvider, {UserContext} from "./src/context/UserContext"

function RootNavigator () {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error(("UserComtext must be used insde the userprovidert"));
    
  }
  
const {currentUser, loading} = userContext;
if(loading) {
  return (
    <View style={{flex:1, justifyContent: "center", alignItems: "center"}}>
      <ActivityIndicator size="large" color="#0A9DF1"  />
    </View>
  )
}
return (
  <NavigationContainer>
{currentUser ? 
  <AppNavigator/> : <AuthNavigator/>}

    </NavigationContainer>
)
}
export default function App() {

  return (
    <UserProvider>
     <RootNavigator/>
    </UserProvider>
  )
}