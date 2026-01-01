import React, { useState } from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack"

import Navbar from "../component/Navbar";

import Calls from "../screens/Calls";
import CameraScr from "../screens/CameraScr";
import ChatList from "../screens/ChatList";
import Status from "../screens/Status";
import Chats from "../screens/Chats";
import Profile from "../screens/Profile";
import ZoomImage from "../screens/ZoomImage";
import AddCall from "../screens/AddCall";
import VideoCall from "../screens/VideoCall";
import OwnerProfile from "../screens/OwnerProfile";
import StatusView from "../screens/StatusView";
import Edit from "../screens/Edit";
import BuildStatus from "../screens/BuildStatus";
import Link from "../screens/Link";

const Stack = createNativeStackNavigator();

interface AppNavigatorProps {
    setIsAuthenticated: (value: boolean) => void
}
export default function AppNavigator({setIsAuthenticated}: AppNavigatorProps) {
    const [activeTab, setActiveTab] = useState("Chats")
    return (
        <>
         <Navbar activeTab={activeTab} setActiveTab={setActiveTab}
         setIsAuthenticated={setIsAuthenticated}
         currentUser={currentUser}
          />
         <Stack.Navigator>
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
             <Stack.Screen name="Link"  component={Link}   />
         </Stack.Navigator>
        </>
    );
}