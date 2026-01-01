
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"

type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setIsAuthenticated: (v: boolean) => void;
  currentUser: {id: string; name: string; handle: string}
};
const BASE_URL = "http://10.0.2.2:3000";
export default function Navbar({activeTab, setActiveTab, setIsAuthenticated}: Props) {
  const navigation = useNavigation();
  const tabs = [
    {name: "Camera",  icon: "camera-outline"},
        {name: "Chats",  icon: "chatbubble-ellipses-outline"},
        {name: "Status",  icon: "ellipse-outline"},
            {name: "Calls",  icon: "call-outline"},       
  ];
  const [menuVisible, setMenuVisible] = useState(false);

const handleLogOut = async (
  setIsAuthenticated: (v: boolean) => void,
navigation: any, 
ws?: WebSocket | null,
currentUser?: {id: string}
) => {
try {
  if(!currentUser?.id) throw new Error ("User not found");
 await axios.post(`${BASE_URL}/auth/logout`, {userId: currentUser});
 ws?.close();
 await AsyncStorage.clear();
  setIsAuthenticated(false);
   navigation.navigate("Login")
}catch(err) {
  console.error("Sorry logout Failed", err)
}
}
  return(
<View style={styles.port}>

<View style={styles.topNav}>
<Text style={{fontSize: 24, color: "white", fontWeight: "bold"}}>TuChat</Text>

<View style={{flexDirection: "row"}}>
  <TouchableOpacity style={styles.iconBut}>
<Icon name="search-outline"  size={24} color="white"/>
  </TouchableOpacity>

    <TouchableOpacity style={styles.iconBut}
    onPress={() => setMenuVisible(true)}>
<Icon name="menu-outline"  size={24} color="white"/>
  </TouchableOpacity>
</View>
</View> 

<Modal 
visible={menuVisible}
transparent
animationType="fade"
onRequestClose={() => setMenuVisible(false)}
>
  <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.floatModal}>

<View style={styles.menu}>
<TouchableOpacity onPress={() => {setMenuVisible(false); navigation.navigate("OwnerProfile" as never);}}>
<View style={styles.settingIcon}>
<Icon name="person-circle-outline"  size={24} color="white"/>
<Text style={styles.menuStaff}>View Profile</Text>
</View>
</TouchableOpacity>

   <TouchableOpacity onPress={() =>  {setMenuVisible(false); navigation.navigate("OwnerProfile" as never);}}>
       <View style={styles.settingIcon}>
          <Icon  name="settings-outline" size={22} color="white" />
<Text style={styles.menuStaff}>Settings</Text>
       </View>
    </TouchableOpacity>

       <TouchableOpacity onPress={() =>  {setMenuVisible(false); navigation.navigate("Link" as never);}}>
        <View style={styles.settingIcon}>
               <Icon  name="link-outline" size={22} color="white" />
 <Text style={styles.menuStaff}>App-Link</Text>
        </View>
    </TouchableOpacity>

     <TouchableOpacity onPress={() => setMenuVisible(false)}>
        <View style={styles.settingIcon}>
               <Icon  name="hand-left-outline" size={22} color="white" />
 <Text style={styles.menuStaff}>Support & Feedback</Text>
        </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => 
    handleLogOut(setIsAuthenticated, navigation, undefined, currentUser)
  }>
        <View style={styles.settingIcon}>
               <Icon  name="power-outline" size={22} color="white" />
 <Text style={styles.menuStaff}>Log-Out</Text>
        </View>
    </TouchableOpacity>
</View>
  </TouchableOpacity>
</Modal>

<View style={styles.botNav}>
{tabs.map((tab) => (
  <TouchableOpacity key={tab.name}
  style={styles.tabsItem} 
  onPress={() => {
    setActiveTab(tab.name);
    navigation.navigate(tab.name as never)
  }}>
    <Icon name={tab.icon}  size={24} 
    color={activeTab === tab.name ? "rgba(10, 157, 241, 1)" : "#aaa" }/>
<Text style={[
  styles.text,
  activeTab === tab.name && { color: "rgba(10, 157, 241, 1)", fontWeight: "bold" }
]}>
{tab.name}
</Text>
  </TouchableOpacity>
))}
</View>
</View>
  )
}
const styles = StyleSheet.create({
port: {
  backgroundColor: "#000"
},
topNav: {
  alignItems: "center",
  justifyContent: "space-between",
  flexDirection: "row",
  paddingHorizontal: 15,
  paddingVertical: 15
},
iconBut: {
  marginLeft: 12
},
botNav: {
  flexDirection: "row", justifyContent: "space-around", 
  backgroundColor: "#1f2020ff"
},
tabsItem: {
  alignItems: "center", paddingVertical: 8, flex:1
},
text: {
  color: "#aaa",
  fontWeight: "bold",
  marginTop: 4, fontSize: 16
},
floatModal: {
  flex: 1, backgroundColor: "#999"
}, 
menu: {
  position: "absolute", top: 50, right: 120, borderRadius: 8, padding: 10, elevation: 5,
  backgroundColor: "black"
},
settingIcon: {
  flexDirection: "row", paddingHorizontal:12, paddingVertical: 6, alignItems: "center"
},
 menuStaff: {
  fontSize: 20, color: "white", padding: 8
}

})