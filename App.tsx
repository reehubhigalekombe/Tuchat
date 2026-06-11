import React, {useEffect, useState} from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigator/AppNavigator";
import AuthNavigator from "./src/navigator/AuthNavigator";
import UserProvider from "./src/context/UserContext"
import * as Keychain from "react-native-keychain"

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkLogin = async ()  => {
    try {
      const creds = await Keychain.getGenericPassword();
      if(creds) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    }catch(err) {
      console.error()
    }
    }
    checkLogin();
  }, [])
  return (
    <UserProvider>
      <NavigationContainer>
      {
        isAuthenticated ? (
          <AppNavigator setIsAuthenticated={setIsAuthenticated}/>
        ) : (
          <AuthNavigator setIsAuthenticated={setIsAuthenticated}   />
        )
      }

    </NavigationContainer>
    </UserProvider>
  )
}