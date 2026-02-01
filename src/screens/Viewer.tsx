import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RTCView } from "react-native-webrtc";
import Icon from "react-native-vector-icons/Ionicons"

export default function Viewer( {remoteStream, viewers, likes, onLikes, onExit}) {
    return(
<View style={styles.port}>
<View style={styles.head}>
<Text style={styles.text}>LIVE</Text>
<Text style={styles.stat}>{viewers}Watching</Text>
</View>
{remoteStream && (
    <RTCView
streamURL={remoteStream.toURL()}
style={styles.video}
objectFit="cover"
       />
)}

<TouchableOpacity onPress={onLikes}  style={styles.likeBut}>
    <Icon name="heart"  size={30} color="red"/>
    <Text style={styles.likeText}>{likes}</Text>
</TouchableOpacity>

<TouchableOpacity onPress={onExit}  style={styles.exitBut}>
    <Text style={{color: "#fff"}}>Exit</Text>
</TouchableOpacity>
</View>
    )
}
const styles = StyleSheet.create({
    port: {
        flex: 1, backgroundColor: "#000"
    }, 
    head: {
position: "absolute", top: 40, left: 15, zIndex: 10
    }, 
    text: {
color: "red", fontWeight: "400", fontSize: 20
    },
    stat: {color: "#fff", marginTop: 6},
    video: {
        flex: 1
    },
    likeBut: {
        position: "absolute", right: 20, bottom: 120, alignItems: "center"
    },
      likeText: {
color: "#fff", marginTop: 6
    },
    exitBut: {
        position: "absolute", bottom: 40, alignSelf: "center",
         backgroundColor: "#222", paddingHorizontal: 30, paddingVertical: 12, borderRadius: 20
    }
})