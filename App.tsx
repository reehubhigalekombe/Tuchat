import React, {useState} from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigator/AppNavigator";
import AuthNavigator from "./src/navigator/AuthNavigator";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  return (
    <NavigationContainer>
      {
        isAuthenticated ? (
          <AppNavigator setIsAuthenticated={setIsAuthenticated}/>
        ) : (
          <AuthNavigator setIsAuthenticated={setIsAuthenticated}   />
        )
      }

    </NavigationContainer>
  )
}