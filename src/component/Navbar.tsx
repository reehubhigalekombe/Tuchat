import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { UserContext} from "../context/UserContext";
import * as Keychain from "react-native-keychain"

type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  search: string
  setSearch: (v: string) => void

};
const BASE_URL = "https://tuback-8pr0.onrender.com";

export default function Navbar({activeTab, setActiveTab, 
  search, setSearch }: Props) {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const userContext  = useContext(UserContext)
  if(!userContext) {
    throw new Error ("UserContext must be used inside UserProvider");
  }
  const {currentUser, logout} = userContext

const handleLogOut = async () => {
  try {
    console.log("Context User: ", currentUser);
    if(!currentUser?.id) {
      throw new Error("User not found")
    }
  await axios.post(`${BASE_URL}/auth/logout`, {userId: currentUser.id});
  await Keychain.resetGenericPassword();
  await logout()
  console.log("User logout success")
  }catch(err) {
    console.log("Log-out failed")
  }
}
  return(
<View style={styles.port}>
<View style={styles.topNav}>
 <View style={styles.topNa}>
   <Image source={{uri: "https://drive.google.com/uc?export=view&id=1FTBlSIIkFmEIuotP17CWq_Nq7Oeb2dO-"}} style={styles.logo} />
<Text style={{fontSize: 30, color: "white", fontWeight: "400"}}>TuChat</Text>
 </View>
<View style={{flexDirection: "row"}}>
    <TouchableOpacity style={styles.iconBut}
    onPress={() => setMenuVisible(true)}>
<Icon name="menu-outline"  size={27} color="white"/>
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

   <TouchableOpacity onPress={() =>  {setMenuVisible(false); navigation.navigate("Settings" as never);}}>
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

    <TouchableOpacity onPress={() => {setMenuVisible(false); navigation.navigate("Support" as never);}}>
        <View style={styles.settingIcon}>
               <Icon  name="hand-left-outline" size={22} color="white" />
 <Text style={styles.menuStaff}>Support & Feedback</Text>
        </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={handleLogOut}
  >
        <View style={styles.settingIcon}>
               <Icon  name="power-outline" size={22} color="white" />
 <Text style={styles.menuStaff}>Log-Out</Text>
        </View>
    </TouchableOpacity>
</View>
  </TouchableOpacity>
</Modal>

<View style={styles.botNav}>
<TouchableOpacity style={styles.tabItem}
onPress={() => {
  setActiveTab("Chats")
}}>
<Text style={[
  styles.texts, (activeTab === "Chats" || activeTab === "Search") && styles.activeText
]}>
  Chats</Text>
</TouchableOpacity>

<View style={styles.search}>
  <TextInput 
placeholder="Search....."

placeholderTextColor={"#fff"}
value={search}
onChangeText={setSearch}
onFocus={() => setActiveTab("Search")}
returnKeyType="search"
style={styles.searchBar}
onBlur={() => {
  if(search.length === 0) {
    setActiveTab("Chats")
  }
}}
clearButtonMode="while-editing"
underlineColorAndroid="transparent"
/>
<TouchableOpacity onPress={() => {
  setSearch("");
}}
  style={styles.icon} activeOpacity={0.7}>

{search.length > 0 ? (
  <Icon name="close-outline" size={18} color="#fff"  />
) : (
  <Icon name="search-outline" size={18} color="#ffffff"  />
)}
</TouchableOpacity>
</View>

<TouchableOpacity onPress={() => {
  setActiveTab("Profile")
  navigation.navigate("OwnerProfile" as never)
}}
style={styles.tabItem}>

<Image source={{uri: currentUser?.avatar ||  "https://via.placeholder.com/150"}} style={[styles.profAvatar,
  activeTab === "Profile" && styles.activeProfile
]}   />
</TouchableOpacity>
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
logo:  {
width: 40, height: 40, borderRadius: 20
},
topNa: {
flexDirection: "row", gap: 10, justifyContent: "center", alignItems: "center"
},
iconBut: {
  marginLeft: 12
},
botNav: {
  flexDirection: "row", justifyContent: "space-around",  alignItems: "center",
  backgroundColor: "#1f2020ff", height: 60
},
tabsItem: {
  alignItems: "center", paddingVertical: 8, flex:1, justifyContent: "center",
  width: 60,
  height: "100%"
},
texts: {
  color: "rgba(10,157,241,1)",
  fontWeight: "bold",
  marginTop: 0, fontSize: 22, textAlign: "center",
  marginLeft: 2
  
},
floatModal: {
  flex: 1, backgroundColor:  "rgba(0,0,0,0.3)",
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
}, 
tabItem: {
alignItems: "center", width:60, 
},
search: {
flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#2a2b2b",
paddingHorizontal: 12, marginHorizontal: 12, borderRadius: 20, height: 44,
elevation: 3, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius:4

},
searchBar: {
  flex: 1, fontSize: 18, color: "#fff", height: "100%", textAlignVertical: "center"
},
icon: {
  position: "absolute", right: 10
}, 

activeProfile: {
  borderWidth: 2, 
}, 
profAvatar: {
  width: 46, height: 46, borderRadius: 23,
},
activeText: {
  color: "rgba(10,157,241,1)"
}

})