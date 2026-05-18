import React, { useState, useRef, useEffect } from "react";
import { View,  Text, StyleSheet, TouchableOpacity , Image, Alert, SafeAreaView} from "react-native";
import io from "socket.io-client";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import InCallManager from "react-native-incall-manager";
import {RTCPeerConnection, RTCView, mediaDevices} from "react-native-webrtc";
import inCallManager from "react-native-incall-manager";

const SERVER_URL = "http://10.0.2.2:3000";

export default function Live({route}: any) {
    const navigation = useNavigation();

    const user = { name: route?.params?.name  || "Live Host", phone: route?.params?.email,};

    const [isFrontCamera, setisFrontCamera] = useState(false);
    const [isSpeaker, setIsSpeaker] = useState(false)

    const isHost = route?.params?.isHost ?? true;
    const liveId = route?.params?.liveId ?? "public-live";

    const[localStream, setLocalStream] = useState<any>(null);
    const [remoteStream, setRemoteStream] = useState<any>(null);
    const[Viewers, setViewers] = useState(0);
    
    const [isMuted, setIsMuted] = useState(false)

    const pc = useRef<any>(new RTCPeerConnection());
    const socket = useRef<any>(null);

    const[likes, setLikes] = useState(0)

    const avatar = route?.params?.avatar || "https://drive.google.com/uc?export=view&id=19XRQ062YGtJbptSiwgNXz4uuTARJBe-s"

    useEffect(() => {
        socket.current = io(SERVER_URL);
         socket.current.emit(isHost ? "live-start" : "live-join", {liveId});
         const startHostStream = async () => {
            const stream = await mediaDevices.getUserMedia({
                audio: true,
                video: true
            });
            setLocalStream(stream);
            stream.getTracks().forEach((track) => 
            pc.current.addTrack(track, stream)
        );
        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);
        socket.current.emit("offer", {liveId, offer})
         };
         if(isHost) {
            startHostStream()
         }

         pc.current.ontrack = (event: any) => {
            setRemoteStream(event.stream[0])
         };

         socket.current.on("offer", async ({offer}: any) => {
            if(!isHost) {
                await pc.current.setRemoteDescription(offer);
                const answer = await pc.current.createAnswer();
                await pc.current.setLocalDescription(answer);
                socket.current.emit("answer", {liveId, answer})
            }
         });

         socket.current.on("answer", async ({answer}: any) => {
            if(isHost) {
                await pc.current.setRemoteDescription(answer)
            }
         });

         socket.current.on("ice-candidate", async({candidate}: any) => {
            try {
                await pc.current.addIceCandidate(candidate)

            }catch(err) {
                console.log(err)
            }
         });

         pc.current.onicecandidate =(event: any) => {
            if(event.candidate) {
                socket.current.emit("ice-candidate", {
                    liveId,
                    candidate: event.candidate,
                });
            }
         };
         socket.current.on("viewer-count", (count: number) => {
            setViewers(count)
         });

         socket.current.on("live-likes", (count: number) => {
            setLikes(count)
         });

         socket.current.on("cohost-invite", ({liveId}) => {
            Alert.alert("Co-host Inviation", "Hello you have been invited to co-host this live",
                [
                    {text: "Decline", style: "cancel"},
                    {text: "Accept", 
                        onPress: () => {
                            socket.current.emit("accept co-host invite", {liveId})
                        },
                    },
                ]
            );
         });
         return() => {
            socket.current.disconnect();
            pc.current.close()
         }; 
    }, []);

    const toggleMute = () => {
        if(!localStream) return;

        localStream.getAudioTracks().forEach((track: any) => {
            track.enabled = !track.enabled;
        });

        setIsMuted(prev => !prev)
    };

    const endCall = () => {
        socket.current.emit("live-end", {liveId});
        localStream?.getTracks().forEach(track => track.stop());
        remoteStream?.getTracks().forEach(track => track.stop());

        pc.current?.close();
        socket.current?.disconnect();

        inCallManager.stop();
        navigation.goBack();
    };

    const flipCamera = () => {
        if(!localStream) return;

        localStream.getVideoTracks().forEach((track: any) => {
            if(track._switchCamera) {
                track._switchCamera()
            }
        });
        setisFrontCamera(prev => !prev)
    };
    const toggleSpeaker = () => {
if(!isSpeaker) {
    InCallManager.setSpeakerphoneOn(true)
} else {
    InCallManager.setForceSpeakerphoneOn(false);
}
setIsSpeaker(prev => !prev)
    }
    return(
<View style={styles.port}>
    {localStream && (
        <RTCView streamURL={localStream.toURL()}  style={styles.video}/>
    )}
    <SafeAreaView style={styles.liveHead}>
<View style={styles.left}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBut}>
        <Icon name="arrow-back" size={26} color="#fff"/>
    </TouchableOpacity>

    <Icon name="radio-button-on" size={26} color="red"  />
    <Text style={styles.liveText}>Live</Text>
</View>
<View style={styles.right}>
    <Icon name="eye-outline"  size={26} color= "#fff"/>
<Text style={styles.viewerText}>{Viewers}</Text>
</View>
    </SafeAreaView>
   
    <View style={styles.rightControls}>
<TouchableOpacity style={styles.avatarControls}>
<Image source={{uri: avatar}} style={styles.image} />
</TouchableOpacity>

<TouchableOpacity onPress={toggleSpeaker} style={styles.circle}>
    <Icon name="volume-high" size={26} color= "#fff" />
</TouchableOpacity>

<TouchableOpacity onPress={toggleMute} style={styles.circle}>
        <Icon name={isMuted ? "mic-off" : "mic"} size={26} color= "#fff" />
</TouchableOpacity>

<TouchableOpacity style={styles.circle} onPress={flipCamera}>
        <Icon name="camera-reverse"  size={26} color="#fff"/>
</TouchableOpacity>

<TouchableOpacity onPress={endCall} style={[styles.circle, styles.end]}>
    <Icon name="call-outline"  size={26} color="#fff"/>
</TouchableOpacity>
    </View>
</View>
    )
}
const styles = StyleSheet.create({
    port: {
        backgroundColor: "#000",
        flex: 1
    },
    video: {
        width: "100%",
        height: "100%"
    },
    liveHead: {
        position: "absolute", top: 0, right: 0, left: 0, zIndex: 10, flexDirection: "row",
        justifyContent: "space-between", alignItems: "center", paddingHorizontal: 6, paddingVertical: 8,
backgroundColor: "rgba(0,0,0,0.3)",
    },
    left: {
        flexDirection: "row", alignItems: "center", gap: 8
    }, 
    backBut: {
marginRight: 8, padding: 8
    },
    liveText: {
        color: "#fff", fontSize: 18, fontWeight: "400"
    },
    right: {
            flexDirection: "row", alignItems: "center", gap: 8
    }, 
    viewerText:  {
        fontSize: 18, fontWeight: "400"
    },
    rightControls: {
        position: "absolute",
        right: 16, bottom: 120, alignItems: "center", gap: 15
    },
    avatarControls: {
width: 70, height: 70, borderRadius: 35, overflow: "hidden", borderWidth: 2, borderColor: "#0a9df1",
    },
    image: {
        width: "100%", height: "100%"
    },
    circle: { width: 60, height: 60, borderRadius: 30, backgroundColor:"rgba(0,0,0,0.6)",
        alignItems: "center", justifyContent: "center"

    },
    end: {
backgroundColor: "#E53935"
    }
})