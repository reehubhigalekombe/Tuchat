import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import Chats from "../screens/Chats";

const Tab = createBottomTabNavigator();
export default function BottomTab({activeTab, search}) {
    
    return(
        <Tab.Navigator screenOptions={({route}) => ({
            headerShown: false,

            tabBarItemStyle: {
             justifyContent: "center",
                alignItems: "center"
            },
            tabBarLabelStyle: {
                fontSize: 18,
                marginBottom: 5

            },
            tabBarStyle: {
                backgroundColor:  "#1f1f1f",
                height: 80,
                paddingBottom: 8, 
                paddingTop: 8,
                display: activeTab === "Search" ? "none" : "flex"
            },
            tabBarIcon:({focused}) => {
                let iconName = "";

                if(route.name === "Chats") iconName = "chatbubble-ellipses-outline";
                else if (route.name === "Camera") iconName = "camera-outline";
                else if (route.name === "Status") iconName = "radio-button-off-outline";
                else if (route.name === "Live") iconName = "radio-button-on";

                return (
                    <Icon name={iconName} size={26} color={focused ?  "#0a9df1" : "#fff"} />
                )
            },
            tabBarActiveTintColor: "#0a9df1",
            tabBarInactiveTintColor: "#fff"
        })}>
            <Tab.Screen name="Chats">
                {() => <Chats search={search}/>}

            </Tab.Screen>

            <Tab.Screen name="Camera"
            component={Chats} 
            listeners={({navigation}) => ({
                tabPress: (e) => {
                    e.preventDefault();
                    navigation.getParent()?.navigate("Camera")
                }
            })}
            />

            <Tab.Screen  name="Live"  component={Chats}
            listeners={({navigation}) => ({
                tabPress: (e) => {
                         e.preventDefault();
                navigation.getParent()?.navigate("Live")
                }
               
            })} />

    <Tab.Screen  name="Status"  component={Chats}
            listeners={({navigation}) => ({
                tabPress: (e) => {
                         e.preventDefault();
                navigation.getParent()?.navigate("Status")
                }
               
            })} />
            
        </Tab.Navigator>
    )
}