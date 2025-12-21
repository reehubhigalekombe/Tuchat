import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, Image} from "react-native";
import Icon  from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Camera, useCameraDevice } from "react-native-vision-camera";

const {width, height} = Dimensions.get("window");
type Contact = {
    id: string;
    name: string;
    avatar?: string;
    cameraOn?: boolean; 
    isLocal?:  boolean
};

function getInitials (name: string = "") {
    return name
    .trim()
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}
function VideoTile({user, device}: {user: Contact; device: any}) {
    const hasCamera = user.isLocal && user.cameraOn && device
return(
    <View style={[styles.tile, user.isLocal && {borderWidth: 2, borderColor: "#fff"}]}>
{hasCamera ? (
    <Camera
    style={StyleSheet.absoluteFill}
    device={device}
    isActive = {true}
    />
) : user.avatar ? (
<Image  
source={{uri: user.avatar}}
style={StyleSheet.absoluteFill}
/>
) : (
      <View style={styles.circle}>
    <Text style={{color: "white", fontSize: 35, fontWeight: "bold"}}>{getInitials(user.name)}</Text>
    </View>
)}
<View style={styles.nametag}>
    <Text style={{color: "#fff", fontSize: 14}}>
        {user.name}
    </Text>
</View>
    </View>
)
}
export default function VideoCall() {
    const[isMuted, setIsMuted] = useState(false);
    const [speakerOn, setSpeakerOn] =useState(true);
    const navigation = useNavigation<any>();

    const[hasPermission, setHasPermission] = useState(false);

    const[participants, setParticipants] = useState<Contact[]>([
        {id: "local", name: "You", cameraOn: true, isLocal: true}
    ]);
 
    const device  = useCameraDevice("front");

    const handleAddParticipant = (contact: Contact) => {
        setParticipants((prev) => {
            if(prev.find(p => p.id === contact.id)) return prev;
            return [...prev, 
             {   ...contact,  cameraOn: false, isLocal: false}
            ];
        });
    };

    useEffect(() => { 
        const resquestPermissions = async () => {
            try {
                const cameraPermission = await Camera.requestCameraPermission();
                const micPermission = await Camera.requestMicrophonePermission();
                if(
(cameraPermission === "authorized" || cameraPermission === "granted")  && (
         micPermission === "authorized" || micPermission === "granted" 
))
               {
                    setHasPermission(true)
                } else {
                    Alert.alert("kindly enable Camera and Microphone in your phone settings")
                }
            }catch(err) {
                console.warn("Permission request:", err);
                Alert.alert("Error", "Could not request permission")
            }
        };
        resquestPermissions()
    }, []);

    if(!device|| !hasPermission) {
        return (
            <View style={[styles.poort, {justifyContent: "center", alignItems: "center"}]}>
                <Text style={{color: "white"}}>
                    Loading Camera.....
                </Text>
            </View>
        )
    }
    const columns =
    participants.length <= 1 ? 1 :
    participants.length === 2 ? 2  :
    participants.length <= 4 ? 2 : 3;

    const tileSize = width/columns - 20;
    return(
        <View style={styles.Port}>
           <View style={styles.remoteVid}>
            <Text style={{color: "white", fontSize: 18, fontWeight: "bold"}}>Remote Video will be streaming soon</Text>
           </View>
     {
        participants.length === 1 && (
                   <View style={styles.localeVid}>
<Camera style={StyleSheet.absoluteFill}
device={device}
isActive={true}
 />
            </View>
        )
     }
            <View style={styles.head}>
    <Text style={styles.name} >Ekombe Higal</Text>
    <Text style={styles.duration}>00.45</Text>
    {
        participants.length > 1 && (
            <View style={{marginTop: 8}}>
                <Text style={{color: "#aaa", fontSize: 20, textAlign: "center", fontWeight: "bold"}}>On Call</Text>

                <View style={styles.add}>
{
 participants.map(user => (
    <View  
    key={user.id}
    style={{width: tileSize,
        height: tileSize * 1.3,
        margin: 6
    }}
    >
        <VideoTile user={user} device={device} />
        </View>
 ))
}
    </View>
                </View>
        )
    }
</View>

<View style={styles.controlButts}>

<TouchableOpacity onPress={() => setIsMuted(!isMuted)} style={styles.buttons}>
    <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
    <Text style={{color: "white", fontSize: 16, marginTop: 5}} >{isMuted ? "Mute" : "Unmute"}</Text>
</TouchableOpacity>

<TouchableOpacity  style={styles.buttons} onPress={() => setSpeakerOn(!speakerOn)}>
<Icon name={speakerOn ? "volume-high" : "volume-off"} size={24} color="white" />
<Text style={{color: "white", fontSize: 16, marginTop: 5}} >Speaker</Text>
</TouchableOpacity>

<TouchableOpacity  style={styles.buttons}
onPress={() => navigation.navigate("AddCall", {
    onContactSelect: handleAddParticipant
})}
>
<Icon name="person-add" size={24} color="white" />
<Text style={{color: "white", fontSize: 16, marginTop: 5}} >Add Call</Text>
</TouchableOpacity>

<TouchableOpacity  style={[styles.buttons, styles.endCall]}>
<Icon name="call" size={24} color="white" />
<Text style={{color: "white", fontSize: 13, marginTop: 5}} >End</Text>
</TouchableOpacity>
</View>
        </View>
    )
}
const styles = StyleSheet.create({
Port: {
    flex: 1,
    backgroundColor: "#000"
},
remoteVid: {
    width, height, position: "absolute", top: 0, left: 0, justifyContent: "center", alignItems: "center",
    backgroundColor: "#111"
},
poort: {
    flex: 1,
    backgroundColor: "#000"
},
localeVid: {
    position: "absolute", bottom: 140, right: 20, width: 120, height: 160, borderRadius: 20, overflow: "hidden",
    borderWidth: 2, borderColor: "#fff", backgroundColor: "#141313ff", elevation: 5,
},

head: {
    position: "absolute", width: "100%", alignItems: "center", top: 60
},
name: {
    color: "#fff", fontSize: 20, fontWeight: "400"
},
duration: {
    marginTop: 6, fontSize: 16, color: "#aaa"
}, 
controlButts: {
    position: "absolute", paddingVertical: 10, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: "center",
    justifyContent: "space-around", width: "100%", flexDirection: "row", bottom: 40,
},
buttons: {
    alignItems: "center"
}, 
endCall: {
    padding: 10, borderRadius: 30, backgroundColor: '#E53935', width: 60, height: 60, alignItems: "center", 
    justifyContent: "center", marginHorizontal: 10
},
add: {
  marginTop: 10,
  flexDirection: "row", flexWrap: "wrap", justifyContent: "center", width: "100%"
},
parts: {
    backgroundColor: "#131212ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 4,
    borderRadius: 12
},
tile: {
    flex: 1, justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 18,
    backgroundColor: "#222"
},
circle: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#444"
},
nametag: {
    position: 'absolute',
    paddingHorizontal: 8,
    paddingVertical: 4, 
    borderRadius: 10,
    bottom: 8, 
    left: 8
}
})