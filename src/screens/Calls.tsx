import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView,  StatusBar,
    Image, 
 } from "react-native";
 import { useNavigation } from "@react-navigation/native";
 import Icon  from "react-native-vector-icons/Ionicons";

 type Contact = {
    id: string;
    name:  string;
    avatar?: string;
    phoneNumber?: string;
 }
export default function Calls() {
    const [callDuration, setCallDuration] = useState(0)
    const [isMuted, setIsMuted] = useState(false);
    const[isSpeakerOn, setIsSpeakerOn] = useState(false)
    const[isOnHold, setIsOnHold] = useState(false);
    const navigation = useNavigation();
    const[addedParticipants, setAddedParticipants] = useState<Contact[]>([]);

    const callInfo = {
        name: "Higal Ekombe",
        phoneNumber: "+24742106109",
        status: "Calling",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        isOnline: true,
        lastSeem: "2 mins ago"
    }

    useEffect (() => {
        const timer = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer)
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds/60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

const handleAddCall = () => {
    navigation.navigate("AddCall" as never, {
        onContactSelect: (contact: Contact) => {
            setAddedParticipants(prev => [...prev, contact])
        },
    } as never)
}
    const handleEndCall = () => {
        console.log("End Call")
    };
    const handleToggleMute = () => {
        setIsMuted(!isMuted)
    }
        const handleToggleSpeaker = () => {
        setIsSpeakerOn(!isSpeakerOn)
        }
        const handleToggleHold = () => {
            setIsOnHold(!isOnHold)
        }
        const Avatar = ({source, size=120, online = false, 

        } : {
            source: string;
            size?: number;
            online?: boolean;
        }) => (
            <View style={[styles.avatarContainer, {width: size, height: size}]}>
                <Image source={{uri: source}}
                style={[styles.avatarImage,  {width: size, height: size}]}
                resizeMode="cover"
                  />
                  {online && (
                    <View style={styles.onlineIndicator}>
<View style={styles.onlineDot} />
                        </View>
                  )}
            </View>
        );
        const ControlButton = ({icon, label, onPress, isActive = false, iconSize=24}) => (
            <TouchableOpacity 
            style = {[styles.coButton,
                isActive && styles.controlButtonActive ]}
            onPress={onPress}
            >
<Icon  name={icon}
size={iconSize}
color ="white"
style={styles.coIcon} />

                   <Text style={styles.coLabel}>{label}</Text>

            </TouchableOpacity>
        )
    return(
<SafeAreaView style={styles.Port}>
    <StatusBar   barStyle="light-content"  backgroundColor="white"  />
<View style={styles.topPort}>
<TouchableOpacity style={styles.wrapper}>
        <Icon name="ellipsis-vertical-outline" size={24} color ="black"  />
</TouchableOpacity>
</View>
    <View style={styles.caller}>
<Avatar 
source = {callInfo.avatar}
online = {callInfo.isOnline}
/>
<View style={styles.callerDetail}>
<Text style={styles.callName}>{callInfo.name}</Text>
<Text style={styles.callNu}>{callInfo.phoneNumber}</Text>

<View style={{alignItems: "center"}}>
    <View style={styles.statusRow}>
        <Text style={styles.statusValue}>
{
    callInfo.isOnline ? "Online" :  `Last seen ${callInfo.lastSeem}`
}</Text>
    </View>
</View>
</View>

<View style={styles.callsInfo}>
<Text style={styles.callStatus}>
{isOnHold ? "⏸️ On Hold" : "📞 " + callInfo.status}
</Text>
<Text style={styles.callDuration}>
    {formatTime(callDuration)}
</Text>
</View>
<View style={styles.partiSection}>
<View style={{alignItems: "center", marginBottom: 10}}>
    <Text style={{
        color: "#333", fontSize: 18, fontWeight: "400", marginBottom: 5
    }}>The Caller</Text>
    <View style={styles.iniBox}>
        <Text style={{color: "white", fontSize: 16, fontWeight: "400"}}>{callInfo.name}</Text>
    </View>
</View>

{
    addedParticipants.length > 0 && (
        <>
        <Text style={styles.participantsText}>Participants</Text>
        <View style={styles.partiPort}>
            {addedParticipants.map((p) =>(
<View style={styles.partBox}>
    <Text style={styles. participantsText}>
        {p.name}
    </Text>
    </View>
            ))}
        </View>
        </>
    )
}
</View>
    </View>
    <View style={styles.portContainers}>
<View style={styles.portRow}>
<ControlButton
icon={isMuted ? "mic-off" : "mic"}
label={isMuted ? "Unmute" : "Mute"}
onPress={handleToggleMute}
isActive={isMuted}
/>

<ControlButton
icon={isSpeakerOn ? "volume-high" : "volume-medium"}
label="speaker"
onPress={handleToggleSpeaker}
isActive={isSpeakerOn}
/>

<ControlButton
icon="pause"
label={isOnHold? "Resume" : "Hold"}
onPress={handleToggleHold}
isActive={isOnHold}
/>
<ControlButton
icon="person-add-outline"
label="Add Call"
onPress={handleAddCall}
/>
</View>

    </View>

    <View style={styles.endCallPort}>
<TouchableOpacity
style={styles.endButton} 
onPress={handleEndCall}
>
    <Text style={styles.endCallIcon}>📞</Text>
    <Text style={styles.endCallText}>End Call</Text>

</TouchableOpacity>
    </View>
</SafeAreaView>
    )
}
const styles = StyleSheet.create({
    Port: {
        flex: 1,
        backgroundColor: "#F5F5F5"
    }, partBox: {
backgroundColor: "#000", minWidth: 70, justifyContent: "center", alignItems: "center",
margin: 4, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8
    },
    partiSection: {
width: "100%",
alignItems: "center",
paddingHorizontal: 15, marginTop: 15
    },
    iniBox: {
        backgroundColor: "#000",
        paddingHorizontal: 15, paddingVertical: 8, alignItems: "center",
        justifyContent: "center", borderRadius: 20
    },
    participantsText: {
fontSize: 15, color: "white", marginBottom: 8, textAlign: "center"
    },
    partiPort: {
flexDirection: "row", flexWrap: "wrap", gap: 109, justifyContent: "center"
    },
    topPort: {
position: "absolute",
right: 10,
left: 10, alignItems: "center",
top: 10, flexDirection: "row", justifyContent: "flex-end", zIndex: 10
    },
    wrapper: {
borderRadius: 20, padding: 6, backgroundColor: "rgba(255,255,255,0.3)"
    },
    caller: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20
    },
    callerDetail: {
alignItems: "center", marginBottom: 20
    },
    callName: {
fontSize: 25, fontWeight: 400, color: 'rgba(7, 7, 7, 0.8)', marginBottom: 4
    },
    callNu: {
fontSize: 16, color: 'rgba(7, 7, 7, 0.8)', marginBottom: 12
    },
    statusRow: {
        flexDirection: "row", alignItems: "center"
    },
    statusLabel: {
fontSize: 15,
        color: 'rgba(168, 166, 176, 0.7)',
    },
    statusValue: {
        fontSize: 16,
        color: "blue",
        fontWeight: "400"
    }, 
    callsInfo:  {
        backgroundColor:  'rgba(59, 13, 224, 0.1)', alignItems: "center",
        paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, 
    },
    callStatus: {
        fontSize: 14, color:  'rgba(8, 8, 8, 0.9)', marginBottom: 4, fontWeight: "400", 
    },
    callDuration: {
        fontSize: 16, fontWeight: "600", color: "black"
    }, 
    portContainers: {
backgroundColor: "black", padding: 25, alignItems: "center", justifyContent: "center"
    },
    portRow: {
        flexDirection: "row", justifyContent: "space-between",  alignItems: "center",  gap: 13
    },
    endCallPort: {
        alignItems: "center",
        padding: 20,
    }, 
    endButton: {
flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 30,
paddingHorizontal: 35,
paddingVertical: 15, backgroundColor: '#ff3b30', shadowColor: '#ff3b30',
shadowOffset: {
    width: 0, height: 4
},
shadowOpacity: 0.4, shadowRadius: 15, elevation: 5, minWidth: 150
    },
    endCallIcon: {
        fontSize: 20, marginRight: 10, transform: [{rotate: '135deg'}]
    },
    endCallText: {
        fontSize: 16, fontWeight: "600", color: "white"
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 20
    },
    avatarImage: {
        borderRadius: 60, borderWidth: 3, borderColor: 'rgba(255, 255, 255, 0.3)'
    },
    onlineIndicator: {
position: "absolute",
right: 5,
bottom: 5,
padding: 2,
borderRadius: 10,
backgroundColor: "white"
    },
    onlineDot: {
        width: 12, height: 12, borderRadius: 6, backgroundColor: '#4CAF50'
    },
    coButton: {
        alignItems: "center", backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.3)', 
        borderRadius: 20, width: 90, height: 90 , minWidth: 70, justifyContent: "center"
    },
    controlButtonActive: {
        borderColor: "white",
        backgroundColor: 'rgba(221, 214, 214, 0.3)',
    },
    coIcon:{
 marginBottom: 8
    },
    coLabel: {
fontSize: 15, fontWeight: "300", color: "white"
    }
})