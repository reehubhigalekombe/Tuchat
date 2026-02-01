import React, { useState, useRef, useEffect } from "react";
import { View,  Text, StyleSheet, TouchableOpacity , Image, Alert} from "react-native";
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
      <View style={styles.liveHead} >
        <View style={styles.live}>
 <Icon name="radio-button-on-outline" size={25} color= "red"  />
        <Text    style={{color: "white", fontSize: 20, fontWeight: "bold"}}>Live</Text>
        </View>
            <View style={styles.live}>
            <Icon name="heart" size={25} color= "rgba(10, 157, 241, 1)"  />
               <Text   style={{color: "white", fontSize: 20, marginRight: 10}}>{Viewers} </Text>
        </View>
           
        
    </View>
{isHost && localStream &&  (
        <RTCView  streamURL = {localStream.toURL()}
        style={styles.remoteVid}
        />
    )}

{isHost && remoteStream && (
        <RTCView streamURL={remoteStream.toURL()}
style={styles.remoteVid}
        />
    )}
  
{!localStream && isHost && <Text>Loading Camera......</Text>}

<View style={styles.rightControls}>

    <TouchableOpacity style={styles.avatarContainer}  activeOpacity={0.7} 
    onPress={() => navigation.navigate("Profile" as never, {user} as never)}>
        <Image  source={{uri: avatar }} style={styles.image} />
    </TouchableOpacity>

    <TouchableOpacity style={styles.add}  activeOpacity={0.7}>
        <Icon name="add" size={20} color="white" />
    </TouchableOpacity>

     <TouchableOpacity style={[styles.grounds, isSpeaker && styles.speaker]} activeOpacity={0.7}
     onPress={toggleSpeaker}>
    <Icon name={isSpeaker ?  "volume-mute" : "volume-high"} size={30} 
    color={isSpeaker ?  "#fff" : "#fff"  }  />
    </TouchableOpacity>   

     <TouchableOpacity style={[styles.grounds, isMuted && styles.muteBut]} activeOpacity={0.7} onPress={toggleMute}>
    <Icon name={isMuted ? "mic-off" : "mic"} size={30}
     color={isMuted ? "#E53935" : "#fff"} />
    </TouchableOpacity>   

     <TouchableOpacity style={[styles.grounds,  isFrontCamera && styles.rearBut]} activeOpacity={0.7}
     onPress={flipCamera}>
    <Icon name="camera-reverse" size={30}
     color= {isFrontCamera ?  "#FFF"  : "#fff" } />
    </TouchableOpacity>   

     <TouchableOpacity style={[styles.grounds, styles.endCall]} activeOpacity={0.7}
     onPress={endCall}>
    <Icon name="call-outline" size={30} color= "#fff"  />
    </TouchableOpacity>   
</View>


<View style={styles.outline}>
<View style={styles.side}>
    <TouchableOpacity style={styles.ground} activeOpacity={0.7}>
        <Text style={styles.text}>Join</Text>
    </TouchableOpacity>
</View>
 
 <View style={styles.center}>
  <TouchableOpacity style={styles.ground} activeOpacity={0.7}>
    <Icon name="chatbubbles-outline" size={25} color= "#000"  />
    </TouchableOpacity>   

<TouchableOpacity style={styles.ground} 
onPress={() => {
    socket.current.emit("invite-cohost", {
        liveId,
        from: socket.current.id
    })
}}
activeOpacity={0.7}>
 <Icon name="person-add" size={25} color= "#000"  />
</TouchableOpacity>

    <TouchableOpacity  style={styles.ground} 
    onPress={() => {
        socket.current.emit("live-like", {liveId})
    }}
    activeOpacity={0.7}>
<Icon name="heart" size={25} color= "#E53935" />
    </TouchableOpacity>
 </View>
   <View style={styles.side}>
      <TouchableOpacity style={styles.ground} activeOpacity={0.7}>
        <Text style={styles.text}>Exit</Text>
    </TouchableOpacity>
  
   </View>
</View>
</View>
    )
}
const styles = StyleSheet.create({
    port: {
flex: 1, backgroundColor: "#112"
    },
    liveHead: {
position: "absolute",  top: 40, gap: 10, left: 20, right: 20, zIndex: 10, flexDirection: "row",   justifyContent: "space-between" , alignItems: "center"
    }, 
    remoteVid: {
        width: "100%", height: "100%"
    },
    live: {
        flexDirection: "row", gap: 10, justifyContent: "center", alignItems: "center",marginLeft: 10
    }, 
    outline :  { position: "absolute", bottom: 10, zIndex: 10, left: 10, right: 10,
         justifyContent: "space-between" , alignItems: "center",
        flexDirection: "row", 
        paddingVertical:6, paddingHorizontal: 10, borderRadius: 10
    }, 
    side: {
width: 75, alignItems: "center"
    },
    center: {
flexDirection: "row", flex: 1, justifyContent: "center", gap: 15
    },
    text: {
        color: "#000", fontSize: 20, fontWeight: "500"
    }, ground: {
        width: 62, height: 36,
        backgroundColor: "#fff",
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: {width: 0, height: 2}
    },
    rightControls: {
        position: "absolute",
        right: 16,
        bottom: 120,
        zIndex: 20,
        alignItems: "center",
        gap: 15,
        marginRight: 10
    },
    endCall: {
        backgroundColor:  "#E53935",
    },
    grounds: {
        width: 60, height: 60,
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: {width: 0, height: 2}
    },
    muteBut: {backgroundColor: "#999"},
    rearBut: {
        backgroundColor: "#999"
    }, 
    speaker: {backgroundColor: "#999"},
    image:  {
        width: "100%", height: "100%"
    },
    add: {position: "absolute", top: 30, right: 10, width: 20, height: 20, borderRadius: 10, backgroundColor: "#E53935",
        justifyContent: "center", alignItems: "center", elevation: 5
    },
    avatarContainer: {width: 66, height: 66, borderRadius: 33, overflow: "hidden",
        marginRight: 10, position: "relative", borderWidth: 2, borderColor: "rgba(10, 157, 241, 1)"

    }
  

})