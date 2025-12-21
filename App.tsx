import React, {useState} from "react";
import { NavigationContainer } from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";

import Navbar from "./src/component/Navbar";

import Calls from "./src/screens/Calls";
import CameraScr from "./src/screens/CameraScr";
import ChatList from "./src/screens/ChatList";
import Status from "./src/screens/Status";
import Chats from "./src/screens/Chats";
import Profile from "./src/screens/Profile"; 
import ZoomImage from "./src/screens/ZoomImage";
import AddCall from "./src/screens/AddCall";
import VideoCall from "./src/screens/VideoCall";
import OwnerProfile from "./src/screens/OwnerProfile";
import StatusView from "./src/screens/StatusView";
import Edit from "./src/screens/Edit";
import BuildStatus from "./src/screens/BuildStatus";


const Stack = createStackNavigator()
export default function() {
  const[activeTab, setActiveTab] = useState("Chats")
  return (
    <NavigationContainer>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

   <Stack.Navigator screenOptions={{headerShown: false}}>
       <Stack.Screen name="Chats" component={Chats} />
    <Stack.Screen name="Camera" component={CameraScr} />
    <Stack.Screen  name="StatusView" component={StatusView} 
    options={{headerShown: false}}
    />
      <Stack.Screen name="Calls" component={Calls} />
        <Stack.Screen name="Status" component={Status} />
             <Stack.Screen name="ChatList" component={ChatList} />
                            <Stack.Screen name="Profile" component={Profile} />
                                     <Stack.Screen name="ZoomImage" component={ZoomImage} />
                                     <Stack.Screen name="AddCall"   component={AddCall} />
                                     <Stack.Screen name="VideoCall" component={VideoCall}  />
                                     <Stack.Screen name="OwnerProfile" component={OwnerProfile}  /> 
                               <Stack.Screen  name="BuildStatus" component={BuildStatus} />
             <Stack.Screen  name="Edit" component={Edit} />
   </Stack.Navigator>
    </NavigationContainer>
  )
}