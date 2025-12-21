import React, { useEffect, useState }  from "react";
import { View, Text, StyleSheet, TextInput,  Image, TouchableOpacity,} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon  from "react-native-vector-icons/Ionicons";

export default function Profile() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const {user} = route.params;
    const [qoute, setQoute] = useState("Memories are immortal");
    const[phone, setPhone] = useState(user.phone || "No contact Available");

     useEffect(() => {
        const synnchedContact = "+254742106109";
        setPhone(synnchedContact);

     }, [])

    return(
<View style={styles.tagRow}>
       <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrow}>
        <Icon name="chevron-back" size={25} color="blue"/>
    </TouchableOpacity>

  <View style={styles.prof}>
   <TouchableOpacity onPress={() => navigation.navigate("ZoomImage", {image: user.avatar})}>
     <Image  
    source={{uri: user.avatar}}
    style={styles.avatarPro}
    />
   </TouchableOpacity>
    <Text style={styles.namePro}>{user.name}</Text>

    <Text style={{fontSize: 22, fontWeight: "bold", color: "#4b4b4bff", marginTop: 3}}>
        {phone}
    </Text>
    <Text style={{fontSize: 26, color: "#666", textAlign: "center"}}>
        Finding Me ✨
    </Text>
     {user.email &&    <Text style={styles.emailPro}>{user.email}</Text>}
  </View>

     <View style={styles.contactPort}>   
<TouchableOpacity style={styles.callsBut} onPress={() => navigation.navigate("Calls")}>
       <View style={styles.iconPort}>
<Icon  name="call" size={26} color="black"/>
<Text style={styles.iconText}>Call</Text>
       </View>

</TouchableOpacity>
<TouchableOpacity style={styles.callsBut} onPress={() => navigation.navigate("VideoCall")}>
   <View style={styles.iconPort}>
     <Icon  name="videocam-outline" size={30} color="black"/>
    <Text style={styles.iconText}>Video</Text>
   </View>
</TouchableOpacity>
<TouchableOpacity style={styles.callsBut} onPress={()=> navigation.navigate("Chats", {user})}>
       <View style={styles.iconPort}>
<Icon name="chatbubble" size={26} color="black" />
    <Text style={styles.iconText}>Message</Text>
       </View>
</TouchableOpacity>
     </View>

     
  <View style={styles.highlight}>
    <Text style={styles.mediaHead}>
        Profile Highlights
    </Text>
       
        <View>
        <Text style={styles.highText}>Tag: </Text>
    </View>

       <View style={{flexDirection: "row"}}>
        <Text style={styles.highText}>Favourite Qoute: </Text>
        <TextInput 
        value={qoute}
        onChangeText={setQoute}
placeholder="Hello wirte your Fav Qoute!!🙌"
placeholderTextColor="#aaa"
style={styles.qoute}
        />
    </View>
  </View>

<View style={styles.mediaPort}>
    <Text style={styles.mediaHead}>
        Media
    </Text>
    <View style={styles.mediaRow}>
        <TouchableOpacity style={styles.mediaIcon1}>
            <Icon name="image-outline" size={60} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.mediaIcon1}>
            <Icon name="videocam" size={40} color="#525050ff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.mediaIcon1}>
            <Icon name="document-text" size={50} color="#525050ff" />
        </TouchableOpacity>

         <TouchableOpacity >
                    <Icon name="chevron-forward-outline" size={30} color="gray" />
    </TouchableOpacity>
    </View>  

<View style={{flexDirection: "column", marginTop: 10}}>
<View>
    <Text style={styles.highText}>
    Joined: 
</Text>
</View>
<View>
    <Text style={styles.highText}>
    last seen || online
</Text>
</View>
</View>
<View style={styles.contactPort}>
    <TouchableOpacity  style={styles.block}>
 <Icon  name="ban" size={26} color="red"/>
        <Text style={styles.iconText1}>Block</Text>
    </TouchableOpacity>

        <TouchableOpacity style={styles.block}>
            <Icon  name="megaphone" size={26} color="amber"/>
        <Text style={styles.iconText1}>Report</Text>
    </TouchableOpacity>

        <TouchableOpacity style={styles.block}>
            <Icon  name="settings-outline" size={26} color="neutral"/>
        <Text style={styles.iconText1}>Settings</Text>
    </TouchableOpacity>
</View>
</View>
</View>
    )
}
const styles = StyleSheet.create({
    tagRow: {
         flex: 1
         , paddingTop: 20
    },

    prof: {
       alignItems: "center",  
    },
    arrow: {
        position: "absolute",  padding: 2,  top: 5, left: 10, zIndex: 5
    },
    avatarPro: {
        width: 120, height: 120, borderRadius: 60
    },
    namePro: {
        fontSize: 23,  fontWeight: "bold", marginTop: 10,
    },
    emailPro: {
        fontSize: 16,  fontWeight: 100,  marginTop: 5,
    },
    contactPort: {
        flexDirection: "row",  justifyContent: "space-around",
        alignItems: "center", width: "100%", marginTop: 10, paddingVertical: 20
    },
    callsBut: {
        width: 120, height: 50,  paddingVertical: 12,  gap: 0,  backgroundColor: "rgba(10, 10, 10, 0.05)",
        borderRadius: 8,
        
    }, 
    iconText: {
        marginLeft: 6,
        fontSize: 19,
        fontWeight: 500,
        color: "#333",
        textAlign: "center"
    },
     iconText1: {
        marginLeft: 6,
        fontSize: 20,
        fontWeight: 500,
        color: "#333",
        textAlign: "center"
    },
    phone: {
        fontSize: 19,
        fontWeight: 700,
        marginRight: 20
    },
    calls: {
        flexDirection: "row",
        gap: 27
    },
    qoute: {
        backgroundColor: "#dedbdbff", color: "black", fontSize: 18, padding: 4,  borderRadius: 12,
    
    },
    iconPort: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    block: {
        flexDirection: "row"
    }, 
    mediaPort: {
        width: "100%",
        marginTop: 10,
        paddingHorizontal: 10,

    },
    mediaRow: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        width: "100%", marginTop: 10
    },
    mediaHead: {
        fontSize: 25,
        fontWeight: 600,
        color: "#111",
        marginBottom: 1
    },
        mediaIcon1: {width: 70, height: 70,   backgroundColor: "rgba(10, 10, 10, 0.05)", alignItems: "center", justifyContent: "center",  marginHorizontal: 8,  borderRadius: 8, color: "blue"
    },
    highlight: {
        flexDirection: "column",
        marginLeft: 10,
    },
    highText: {
          fontSize: 25,
        fontWeight: 400,
        color: "#252323ff",
        marginBottom: 1
    }, 
    
    targPort: {
        overflow: "hidden",
        marginTop: 5,
        borderRadius: 12,
    },
    picker: {
        height: 50,
        width: "100%"
    }

 
})


