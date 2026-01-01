import React, { useState, useRef } from "react";
import { View, TextInput, TouchableOpacity,StyleSheet, Alert, Text, PermissionsAndroid, Platform} from "react-native";
import  Icon from "react-native-vector-icons/Ionicons";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import AudioRecorderPlayer from "react-native-audio-recorder-player"

type Props = {
    onSend: (message: string) => void;
    onUploadFile?: (file: any) => void;
    onToggleEmoji: () => void
}
type FileType = {
    uri: string;
    name: string;
    type: string;
    size: number;
}
export default function MessageInput({onSend, onToggleEmoji, onUploadFile}: Props) {

    const [input, setInput] = useState("");
    const[showUploadOptions, setShowUploadOptions] = useState(false)
    const[isRecording, setIsRecording] = useState(false);
    const [recordedFile, setIsRecordedFile] = useState<any>(null);
    const[recordingDuration, setRecordingDurartion] = useState(0)

    const audioRecorderPlayerRef =  useRef<AudioRecorderPlayer | null>(null);
    if(!audioRecorderPlayerRef.current) {
        audioRecorderPlayerRef.current = new AudioRecorderPlayer();
    }
            const audioRecorderPlayer = audioRecorderPlayerRef.current!

    const handleUploadPress = () => setShowUploadOptions(!showUploadOptions);

     const requestMicPermission =async () => {
        if(Platform.OS === "android") {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED
        }
        return true;
     };

     const startRecording =  async () => {
        if(isRecording) return;
        const hasPermission = await requestMicPermission();
        if(!hasPermission) {
            Alert.alert("Permission has been denied",  "Microphone set is required");
            return;
        }
        const path = Platform.select({
            ios: "voice.m4a",
            android: `${AudioRecorderPlayer.DEFAULT_FILE_PATH}${DarkTheme.now()}_voice.m4a`,
        });

        await audioRecorderPlayer.startRecorder(path!);
        setIsRecording(true)
        setRecordingDurartion(0);

        audioRecorderPlayer.addPlayBackListener((e) => {
            setRecordingDurartion(Math.floor(e.currentPosition /1000))
        })
     }

     const stopRecording = async () => {
        if(!audioRecorderPlayer) return;

        const uri = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        setIsRecording(false)

        if(!uri) return;

        const audioFile = {
            uri,
            name: `voice_${Date.now()}.m4a`,
            type: "audio/m4a",
            size: 0,
            duration: recordingDuration
        };
        onUploadFile?.(audioFile)
     }

    const handleSend = () => {
        if(input.trim()) {
            onSend(input.trim());
            setInput("")
        }
    };
    const pickImage = async () => {
        const options = {
            mediaType: "photo" as const,
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000
        };
        launchImageLibrary(options, (response) => {
            if(response.didCancel) {
                console.log("User has canceld image pick")
            } else if (response.errorCode){
Alert.alert("Error", "Image pick failed")
            } else if (response.assets && response.assets[0]) {
                const asset = response.assets[0];
                const file: FileType = {
                    uri: asset.uri!,
                    name: asset.fileName || `image_${Date.now()}.jpg`,
                    type: asset.type || "image/jpeg",
                    size: asset.fileSize || 0,
                };
                onUploadFile?.(file);
                setShowUploadOptions(false)
            }
        });
    }

    const pickVideo = async () => {
        const options = {
            mediaType: "video" as const,
            includeBase64: false,
            videoQuality: "high" as const,
        };
        launchImageLibrary(options, (response) => {
            if(response.didCancel) {
                console.log("User canceled video pick");
            } else if (response.errorCode) {
Alert.alert("Error", "Failed to pick Video")
            } else if (response.assets && response.assets[0]) {
                const asset = response.assets[0];
                const file: FileType = {
                    uri: asset.uri!,
                    name: asset.fileName || `video_${Date.now()}.mp4`,
                    type: asset.type || "video/mp4",
                    size: asset.fileSize || 0
                };
                onUploadFile?.(file);
                setShowUploadOptions(false)
            }
        });
    };
    const takePhoto = async () => {
        const options = {
            mediaType: "photo" as const,
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
            saveToPhotos: true,
            quality: 0.8
        };
        launchCamera(options, (response) => {
            console.log("Camera response:", response)
            if(response.didCancel) {
                console.log("User Canceled Camera");
            } else if(response.errorCode) {
                Alert.alert("Error", "Failed to take Photo:" + response.errorMessage)
            } else if(response.assets && response.assets[0]) {
                const asset = response.assets[0];
                const file: FileType ={
                    uri: asset.uri!,
                    name: `photo_${Date.now()}.jpg`,
                    type: "image/jpeg",
                    size: asset.fileSize || 0
                };
                console.log("Camera file ready:", file)
                onUploadFile?.(file);
                setShowUploadOptions(false)
            }
        });
    };

    return (
        <View style={styles.container}>     
            {
                showUploadOptions && (
                    <View style={styles.uploadOpt}>
                        <TouchableOpacity style={styles.options} onPress={takePhoto}>
<Icon name="camera" size={25} color="#666"   />
  <Text style={{fontSize: 12, color:"#666", marginTop: 3}}>Camera</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.options }  onPress={pickImage}>
<Icon name="image" size={25} color="#666"   />
  <Text style={{fontSize: 12, color:"#666", marginTop: 3}}>Gallery</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.options}  onPress={pickVideo}>
<Icon name="videocam" size={25} color="#666"   />
  <Text style={{fontSize: 12, color:"#666", marginTop: 3}}>Video</Text>
                        </TouchableOpacity>

                        </View>
                ) }
<View style={styles.mainPort}>
<TouchableOpacity onPress={onToggleEmoji}>
   <Icon name="happy-outline" size={26} color="gray" />
</TouchableOpacity>

    <TouchableOpacity style={styles.iconButtons} 
    onPress={handleUploadPress}>
         <Icon name="attach" size={26}  color="gray"/>
    </TouchableOpacity>
<TextInput 
style={styles.inputs}
value={input}
returnKeyType="send"
blurOnSubmit={false}
onSubmitEditing={handleSend}
onChangeText={setInput}
placeholder="Send Message"
placeholderTextColor="#000"
multiline
/>
{
    input.trim().length === 0 ? (
        <TouchableOpacity
        style={styles.iconButtons}
        onPressIn={startRecording}
        onPressOut={stopRecording}
       >
 <Icon   
name={isRecording ? "mic" : "mic-outline"} size={26}
color={isRecording ? "blue" : "gray"}
 />
 {
    isRecording && (
        <Text style={{position: "absolute", top: -20, fontSize: 14, color: "red"}}>
            Recording{recordingDuration}s</Text>
    )}
        </TouchableOpacity>
    ) : (
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Icon name="send" size={26} color="gray"/>
        </TouchableOpacity>
    )
}
</View>
        </View>
    )
}
const  styles = StyleSheet.create({
    container: {
position: "relative"
    },
    uploadOpt: {
position: "absolute", bottom: 70, left: 10, backgroundColor: "white", borderRadius: 12,
padding: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 3},
shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, flexDirection: "row", zIndex: 999,
    },
    options: {
alignItems: "center", paddingVertical: 6, paddingHorizontal: 10
    }, 
mainPort: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderTopWidth: 1,
    padding: 8,
    borderRadius: 25
},
inputs: {
    flex: 1,
    marginRight: 6,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 20,
    borderColor:"#f0f0f0",
    backgroundColor: "white",
    fontSize: 16
}, 

iconButtons: {
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 10
},
sendButton: {
     backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    transform: [{rotate: "-30deg"}]
}
})