import React, {useEffect, useRef, useState} from "react";
import { useIsFocused } from "@react-navigation/native";
import { View, StyleSheet, Text, Image, TouchableOpacity, AppState } from "react-native";
import { Camera, useCameraDevice} from "react-native-vision-camera";
import Icon  from "react-native-vector-icons/Ionicons";

export default function CameraScr() {
    const[hasPermission, setHasPermission] = useState(false)
        const [cameraPosition, setCameraPosition] = useState<"front" | "back">("front");

    const device = useCameraDevice(cameraPosition);
    const cameraRef = useRef<Camera>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const isFocused = useIsFocused();
    const [recordingTime, setRecordingTime] = useState(0);
    let recordingInterval  = useRef<NodeJS.Timeout | null>(null)

    const [isRecording, setIsRecording] = useState(false);
    const[timer, setTimer] = useState(0);
    const [appState, setAppState] = useState(AppState.currentState);

    const startTimer = () => {
        setRecordingTime(0);
        recordingInterval.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000)
    };

    const stopTimer = () => {
        if(recordingInterval.current) {
            clearInterval(recordingInterval.current);
            recordingInterval.current =  null
        }
    }
    useEffect(() => {
        const subscription = AppState.addEventListener("change", setAppState);
        return () => subscription.remove()
    }, [])
    const isCameraActive = isFocused && appState === "active"  && !photo

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermission();
            const micStatus = await Camera.requestMicrophonePermission()
             setHasPermission(
                     (cameraStatus === "authorized" || cameraStatus === "granted")
                 && (micStatus === "authorized" || micStatus === "granted") 
             ) ;
        })()
    }, []);

    const takePhoto = async(delay = 0) => {
        if(delay > 0) {
            setTimer(delay);
            const interval = setInterval(() => {
                setTimer(prev => {
                    if(prev <= 1) {
                        clearInterval(interval);
                        capturePhoto();
                        return 0;
                    }
                    return prev -1;
                });
            }, 1000)
        } else {
            capturePhoto();
        }
    }

const capturePhoto = async() => {
    if(cameraRef.current) {
        const photoFile = await cameraRef.current.takePhoto();
        setPhoto(`file//${photoFile.path}`);
        console.log("Photo has been autosaved to status")
    }
};

const startRecording  = () => {
    if(!cameraRef.current || isRecording) return;
    setIsRecording(true);
    startTimer();

    cameraRef .current.startRecording({
        flash: "off",
        onRecordingFinished: (video) => {
            stopTimer()
            setIsRecording(false)
            console.log("Your video has been saved to status:", video.path);
            setVideoPath(`file://${video.path}`)
        },
        onRecordingError: (error) => {
            stopTimer();
            setIsRecording(false);
            console.error("Recording error", error)
        }
    });
};

const stopRecording = () => {
    if(!cameraRef.current || isRecording) return;
    cameraRef.current.stopRecording();
}

if(!device) return  <Text>Kindly wait, the camera is loading...</Text>
if(!hasPermission) return <Text>Camera Permission has been denied</Text>


    return (
<View style={styles.container}>
  {
    !photo ? (
        <>
        <Camera  
        key = {isFocused ? "camera-active" : "camera-inactive"}
style={{flex: 1}}
device={device}
isActive={isCameraActive}
ref={cameraRef}
photo={true}
video={true}
enableZoomGesture={true}
        />
        <View style={styles.cameraControls}>
{timer > 0 &&  
    <Text style={styles.timeText}>{timer}</Text>
}
{isRecording && <Text style={styles.timeText}>
    {isRecording}</Text>}
<View style={styles.row}>
<TouchableOpacity 
style={styles.iconButton}
onPress={() => setCameraPosition(prev => (prev === "front" ? "back" : "front"))}
>
    <Icon  name="camera-reverse-outline"  size={35} color="black"/>
</TouchableOpacity  >

<TouchableOpacity 
style={styles.shutter}
onPress={() => takePhoto(3)}
onLongPress={startRecording}
onPressOut={stopRecording}
>
    <Icon  name={isRecording ? "radio-button-on" : "camera-outline"} 
    size={55}  color={isRecording ? "red" : "#fff"} />
</TouchableOpacity>
</View>
        </View>
        </>
    ) : (
        <View style={styles.prev}>
<Image  
source={{uri: photo}} style={styles.imagePrev}
/>
<TouchableOpacity style={styles.butt} 
onPress={() => setPhoto(null)}>
    <Text style={{color: "white", fontWeight: "bold"}}>
        Retake
    </Text>

</TouchableOpacity>

            </View>
    )
  }
</View>
    )
}
const  styles = StyleSheet.create({
    container: {
    flex: 1, 
    backgroundColor: "black"
    },
    cameraControls: {
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
        alignItems: "center"
    },
    shutter: {
        width: 80,
        height: 80,
        backgroundColor: "#fff",
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        
    },
    timeText: {
color: "#ffff",
marginBottom: 15,
fontWeight: "400",
fontSize: 45
    },

    row: {
justifyContent: "space-between",
alignItems: "center",
flexDirection:"row"
    },
    shutText: {
        fontSize: 20
    },
    prev: {
        flex:1, alignItems: "center", justifyContent: "center"
    }, 
    imagePrev: {
        width: "100%", height: "80%", borderRadius: 10
    },
    butt: {
        marginTop: 10,
        padding:12,
        borderRadius: 8,
        backgroundColor: "#0a84ff"
    },
    iconButton: {
        padding: 10
    }

})