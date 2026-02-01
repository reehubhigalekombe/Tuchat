import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { RTCView } from "react-native-webrtc";
import Icon from "react-native-vector-icons/Ionicons"
export default function Host({
    localStream, viewers, likes, avatar, onMute, onFlip, onSpeaker, onInvite,
    onEnd, isMute, isSpeaker,
}) {
    return(
<View style={styles.port}>

<View style={styles.head}>

<View style={styles.badge}>
    <Icon name="radio-button-on"  size={26} color="red" />
<Text style={styles.liveText}>Live</Text>
</View>

<View style={styles.icons}>
    <Icon name="eye"  size={26} color="#fff" />
<Text style={styles.liveText}>{viewers}</Text>

    <Icon name="heart"  size={26} color="red" />
<Text style={styles.liveText}>{likes}</Text>
</View>
</View>

{
    localStream && (
        <RTCView
        streamURL={localStream.toURL()}
        style={styles.video}
        objectFit="cover"  />
    )}

    <View style={styles.controls}>
<TouchableOpacity onPress={onSpeaker} style={styles.ground}  activeOpacity={0.7}>
    <Icon name={isSpeaker ?   "volume-mute" : "volume-high"} size={28} color="#000" />
</TouchableOpacity>

<TouchableOpacity onPress={onMute} style={styles.ground}  activeOpacity={0.7}>
    <Icon name={isMute? "mic-off" : "mic"} size={28} 
    color={
        isMute ? "red" : "#000"
    } />
</TouchableOpacity>

<TouchableOpacity onPress={onFlip} style={styles.ground}  activeOpacity={0.7}>
    <Icon name="camera-reverse" size={28} color="#000" />
</TouchableOpacity>

<TouchableOpacity onPress={onInvite} style={styles.ground}  activeOpacity={0.7}>
    <Icon name="person-add" size={28} color="#000" />
</TouchableOpacity>

<TouchableOpacity onPress={onEnd} style={[ styles.grounds]}  activeOpacity={0.7}>
    <Icon name="call" size={28} color="#fff" />
</TouchableOpacity>
    </View>

   <View style={styles.likePort}>
     <Image source={{uri: avatar}} style={styles.avatar}  />
    <TouchableOpacity onPress={onEnd}  activeOpacity={0.7}>
    <Icon name="heart" size={60} color="red" />
</TouchableOpacity>
<Text style={styles.likeCount}>200</Text>
   </View>
</View>
    )
}
const styles = StyleSheet.create({
    port: {
        flex: 1, backgroundColor: "#000"
    },
    head: {
        position: "absolute", top: 40, left: 15, right: 15, flexDirection:"row", 
        justifyContent: "space-between", alignItems: "center", zIndex: 10,
    },
     liveText: {
color: "#fff", marginLeft: 6, fontWeight: "bold", fontSize: 25
    },
    badge: {
        flexDirection: "row", backgroundColor: "#00000099", padding: 6,
        borderRadius: 10, alignItems: "center"
    },
     icons: {
flexDirection: "row", gap: 6, alignItems: "center"
    },
    video: {
        flex: 1
    },
    controls: {
        position: "absolute", bottom: 40, alignSelf: "center", flexDirection: "row",
        gap: 20, alignItems: "center"
    },

     avatar: {
   width: 60, height: 60, borderRadius: 30,
        borderColor: "#fff" , borderWidth: 2
    }, 
    ground: {
   width: 60, height: 60,
        backgroundColor: "#fff",
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: {width: 0, height: 2}
    }, 
    grounds: {
   width: 60, height: 60,
        backgroundColor: "red", borderRadius: 30, alignItems: "center", justifyContent: "center",
        elevation: 4, shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: {width: 0, height: 2}
    }, 
    likePort: {
        position: "absolute", right: 15, bottom: 140,
        gap: 6, alignItems: "center"
    },
    likeCount: {
        color: "#fff", fontWeight: "500", fontSize: 20
    }
})