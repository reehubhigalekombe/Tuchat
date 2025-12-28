import React, { useEffect, useRef, useState } from "react";
import { View,  Text, StyleSheet, TouchableOpacity, Image, FlatList, Platform, KeyboardAvoidingView, Alert,Share, Linking} from "react-native";
import ImageViewing from"react-native-image-viewing";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyChat from "../component/EmptyChat";import Emoji from "../component/Emoji";
import axios  from "axios";
import MessageInput from "../component/MessageInput";
import Icon  from "react-native-vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import ChatList from "./ChatList";
export default function Chats() {

    type Message = { id: string; text: string;
    sender?: string, timeStamp: string, type? : "text" | "image" | "video" | "file";  file?: any
};

type RouteParams ={
    user: {
        id: string, name: string, avatar: string,  online: boolean,
        lastMessage? :string, message? : Message[], timeStamp? : string
    };
};

  const route = useRoute();
    const navigation = useNavigation()
    const user  = (route.params as RouteParams | undefined )?.user;

    const [messages, setMessages] = useState<Message[]>([]);
    useEffect(() => {
        if(user?.message) {
            setMessages(user.message)
        }
    }, [user])
    const[isOnline, setIsOnline] = useState(true)
    const[input, setInput] = useState("")
    const[showEmoji, setShowEmoji] = useState(false);
    const [isImageViewVisible, setIsImageViewVisible] = useState(false);
    const[currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imagesForViewing, setImagesForViewing] = useState<any[]>([]);
    const [isPDFViewerVisible, setIsPDFViewerVisible] = useState(false);
    const [currentPDFUrl, setCurrentPDFUrl] = useState("");
    const[currentFileName, setCurrentFileName] = useState("")
    const ws = useRef<WebSocket | null>(null);
    const BASE_URL = "http://10.0.2.2:5002";
    const WS_URL = "ws://10.0.2.2:5002";
    
        const handleImagePress = (imageUri: string) => {
        const allImages = messages
        .filter(msg => msg.type === "image" && msg.file)
        .map(msg => ({uri: msg.file.uri}))
        const imageIndex = allImages.findIndex(img => img.uri === imageUri);
        
        if(imageIndex !== -1) {
            setImagesForViewing(allImages);
            setCurrentImageIndex(imageIndex);
            setIsImageViewVisible(true)
        }};

    const handleVideoPress = async (file: any) => {
        try {
            const supported = await Linking.canOpenURL(file.uri);
            if(supported) {
                await Linking.openURL(file.uri);
            } else {
                Alert.alert("Video Playback",
                `Sorry, Cannot play: ${file.name}\n\nYou can:\n1. Download and play\n2. Share the Video`,
                [{
                    text: "Cancel", style: "cancel"},
                    {text: "Share", onPress: () => shareFile(file)}
                ] ); 
            }

        }catch(error) {
            console.log("Error while playing Video:", error);
            Alert.alert("Error", "Video could not be played")
    }}

 const handleDocumentPress = async(file: any) => {
                    const fileExtension = file.name?.split(".").pop()?.toLowerCase() || "";
                    if(fileExtension === "pdf") {
                        setCurrentPDFUrl(file.uri);
                        setCurrentFileName(file.name);
                        setIsPDFViewerVisible(true);
                          return;
                    };
                    try {
                        const supported = await Linking.canOpenURL(file.uri);
                        if (supported) {
                            await Linking.openURL(file.uri)
                        } else {
                            Alert.alert(
                                "Open Document", 
                                ` Sorry Could not open: ${file.name}\n\nFile type: ${file.type || "Unknown"}`,
                                [
                                    {text: "Cancel", style: "cancel"},
                                    {text: "Share File",
                                        onPress: () => shareFile(file)
                                    },
                                    {text: "File Info", onPress: () => showFileInfo(file)},
                                    {text: "Download", onPress: () => downloadFile(file)}
                                ]
                            ); }
                    }catch(error) {
                        console.error("Error occured on opening Document:", error);
                        Alert.alert("Error", "Document could not be Opened")
                    } };
                const shareFile = async (file: any) => {
                    try {
                        await Share.share({
                            title: `Share ${file.name}`,
                            message: `Kindly check this file: ${file.name}`,
                            url: file.uri,
                        })
                    }catch(error) {
                        console.error("Error occured while sharing file:", error);
                        Alert.alert( "Error", "Could not share the file")
                    }};

                const showFileInfo = (file: any) => {
                    const fileSize = file.size ?  `Size ${(file.size / 1024 / 1024).toFixed
                        (2)
                    }MB` : "Size Unknown";
                    const fileType = file.type ? `Type: ${file.type}` : "Type Unknown";
                    Alert.alert(
                        "File Information",
                        `Name: ${file.name}\n${fileType}\n${fileSize}\n\nTo open this file, you will need a compatible
                        application installed.`,
                        [{text: "OK", style: "default"}]
                    );
                };

                const downloadFile = async(file: any) => {
                    Alert.alert(
                        "Download File",
                        `The file "${file.name}" would be downloaded`,
                        [
                            {text: "Cancel", style: "cancel"},
                            {text: "OK", onPress: () => {
                                Alert.alert("Download", "download function to be implimented here higal")
                            }}] ) };

                const getFileIcon = (file: any) => {
                    const fileName = file.name?.toLowerCase() || "";
                    const fileType = file.type || "";
                    if(fileType.includes("pdf") || fileName.endsWith(".pdf")) {
                        return {name: "document-text", color: "#e74c3c"}
                    }
                    if(fileType.includes("word") || fileName.endsWith(".doc") || fileName.endsWith(".docx")) {
                        return {name: "document-text", color: "#2b579a"}
                    }
                       if(fileType.includes("powerpoint") || fileName.endsWith(".ppt") || fileName.endsWith(".pptx")) {
                        return {name: "document-text", color: '#d24726'}
                    }

                     if(fileType.includes("zip") || fileName.endsWith(".zip") || fileName.endsWith(".rar")) {
                        return {name: "archive", color: '#f39c12'}
                    }
                    return {name: "document", color: "#666"}
                };

          const handleToggleEmoji = () => {
            setShowEmoji(prev => !prev);
          }
       const handleUploadFile = (file: any) => {
            console.log("Filed received in Chat:", file);

            let messageType: "image" | "video" | "file" = "file";
            if(file.type.includes("image")) messageType = "image";
             if(file.type.includes("video")) messageType = "video";

                    const newMessage: Message = {
            id: Date.now().toString(),
            text: messageType === "image" ? "photo" : 
            messageType === "video" ?  "vidoe" : "Document",
            sender: "me",
            timeStamp: new Date().toISOString(),
            type: messageType,
            file: file
        };
        
        setMessages((prev) => [newMessage, ...prev]);
        
        ws.current?.send(JSON.stringify({
            type: "file",
            file: file,
            sender: "me"
        }))
        Alert.alert("Success", `${file.name} sent successfully`)
        };
 
 useEffect(() => {
    const fetchMessages = async () => {
        try{
            const res = await axios.get(`${BASE_URL}/messages`);
            console.log("Fetching from the backend", res.data);

            const formartted = res.data.map((msg: any) => ({
                id: msg._id,
                text: msg.text,
                sender: msg.sender,
                timeStamp: msg.timeStamp || new Date().toISOString(),
                type: "text"
            }));
            setMessages(formartted)
        }catch(err) {
            console.error("Error found while retriveing the messages:",err)
        }
    };
               fetchMessages();
               ws.current = new WebSocket(WS_URL);
ws.current.onopen = () => {
  console.log("WebSocket connected successfully");
  
  ws.current?.send(JSON.stringify({
    type: "join", user: "me"
  }))
};

ws.current.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);

    if(data.type === "file") {
        const newMessage: Message = {
            id: Date.now().toString(),
            text: data.file.type.includes("image") ? "photo" : 
                    data.file.type.includes("video") ? "video" : "Document",
                    sender: data.sender,
                    timeStamp: new Date().toISOString(),
                    type: data.file.type.includes("image") ? "image" :
                    data.file.type.includes("video") ? "video" : "file",
                    file: data.file
        };
        setMessages((prev) => [newMessage, ...prev]);
        return;
    }
    const newMessage: Message = {
      id: Date.now().toString(),
      text: data.message,
      sender: data.sender,
      timeStamp: new Date().toISOString()
    };
    setMessages((prev) => [newMessage, ...prev]);

    if(data.type === "status") {
        setIsOnline(data.online)
        return;
    }
  } catch (err) {
    console.error("WebSocket message parse error:", err);
  }
};
               ws.current.onerror = (err) =>
                console.error("WebSocket error", err);
               ws.current.onclose = () =>
                console.log("WebSocket has been closed");
               return () =>{
                ws.current?.close()
               }
 }, [user?.name])

 const handleSend = (msg: string) => {
        if(!msg.trim()) return;

const newMessage: Message = { 
    id: Date.now().toString(), 
    text: msg ,
    sender: "me",
    timeStamp: new Date().toISOString(),
    type: "text"
};
setMessages((prev) => [ newMessage, ...prev]);
ws.current?.send(JSON.stringify({message: msg, sender: "me"}))
setInput("")
    };

        const handleEmojiSelect = (emoji: string) => {
        setInput(prev => prev + emoji)
    };

     const renderMessage = ({item}: {item: Message}) => {
        const isMe = item.sender === "me";
        if (item.type === "image" || item.type === "video" || item.type === "file") {
            const fileIcon = item.type === "file" ? getFileIcon(item.file) : null
return (
    <View style={[styles.fileContainer, isMe ? styles.myFileMessage :  styles.theirFileMessage]}>
{
    item.type ==="image" && item.file && (
        <TouchableOpacity style={styles.fileContent} onPress={() => handleImagePress(item.file.uri)}
        activeOpacity={0.7}>
            <Image source={{uri: item.file.uri}} resizeMode="cover" style={styles.image} />
            <View style={styles.overlay}>
 <Icon name="expand" size={22} color="#fff"  />
            </View>
              <Text style={styles.fileText}>{item.text}</Text>
            <Text style={styles.fileName}>{item.file.name}</Text>
        </TouchableOpacity>
    )}

    {
item.type === "video"  && item.file && (
    <TouchableOpacity style={styles.fileContent}
    activeOpacity={0.7} onPress={() => handleVideoPress(item.file)}>
<View style={styles.video}>
 <Icon name="videocam" size={40} color="#686464ff"  />
 <View style={styles.videoPlay}>
     <Icon name="play-circle" size={35} color="#ffff"  />
 </View>
</View>
<Text style={styles.fileText}>{item.text}</Text>
       <Text style={styles.fileName}>{item.file.name}</Text>
       <Text style={{fontSize: 12, color: "#007AFF", fontStyle: "italic"}}>Tap to Play</Text>
    </TouchableOpacity>
)}

    {
item.type === "file"  && item.file && (
    <TouchableOpacity style={styles.fileContent} onPress={() => handleDocumentPress(item.file)}
    activeOpacity={0.7}>
<View style={styles.fileIconContainer}>
 <Icon name={fileIcon?.name || "document"} size={40} color={fileIcon?.name || "#666"}  />
</View>
<Text style={styles.fileText}>{item.text}</Text>
       <Text style={styles.fileName}>{item.file.name}</Text>
       <Text style={{fontSize: 12, color: "#007AFF", fontStyle: "italic"}}>Tap to open Document</Text>
    </TouchableOpacity>
)}
<Text style={styles.timeStamp}>
    {new Date(item.timeStamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    })}
</Text>
    </View>
)}
        return (
            <View style={[
                styles.messageBubble,  isMe ? styles.myMessage : styles.theirMessage
            ]}>
        <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessage]} >
            {item.text} </Text>

    <Text style={styles.timeStamp}>
{new Date(item.timeStamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
})}
    </Text>
            </View>
        );
    };
    return(
<SafeAreaView style={styles.container}>
<KeyboardAvoidingView
style={{flex: 1}}
behavior={Platform.OS === "ios" ? "padding" : undefined}
keyboardVerticalOffset={90}
>
    <View style={styles.background}>
        <View style={styles.header}> 
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrow}>
            <Icon name="chevron-back" size={26} color="white" />
        </TouchableOpacity>
       
       <TouchableOpacity onPress={() => navigation.navigate("Profile", {user})}>
         <Image  source={{uri:  user.avatar}}
        style={styles.avatar}  />
       </TouchableOpacity>
        <View style={styles.status}>
            <Text style={styles.senderName}>{user.name}</Text>


        <Text style={isOnline  ? styles.online :  styles.offline}>
            {isOnline? "online" : "offline"}
        </Text>
        </View>
    </View>
    <View style={{flex: 1}}>
  <View style={styles.messagePorts}>
    {messages.length === 0 ? (
        <EmptyChat/>
    ) : (
        <FlatList 
        data={messages} 
        keyExtractor={(item) =>item.id}
        renderItem={renderMessage}
        inverted
        />
   )}
</View>

<Emoji  
visible={showEmoji}
onSelect={ handleEmojiSelect}
onClose={() => setShowEmoji(false)}

/>

<View style={styles.wrapper}>
<MessageInput 
onSend={handleSend}
onToggleEmoji={handleToggleEmoji}
onUploadFile={handleUploadFile}
/>
</View>          
    </View>
    </View>
</KeyboardAvoidingView>
<ImageViewing 
images ={imagesForViewing}
imageIndex={currentImageIndex}
visible={isImageViewVisible}
onRequestClose={() => setIsImageViewVisible(false)}
presentationStyle="overFullScreen"
animationType="slide"
backgroundColor="black"
swipeToCloseEnabled={true}
doubleTapToZoomEnabled={true}
/>
{isPDFViewerVisible && (
    <View style={styles.pdfView}>
<View style={styles.pdfHead}>
<Text style={{color: "white", fontSize: 18, fontWeight: "300", flex: 1}}>{currentFileName}</Text>
<TouchableOpacity style={{padding: 5}} onPress={() => setIsPDFViewerVisible(false)}>
<Icon name="close" size={26} color="white" />
</TouchableOpacity>
</View>
    </View>
)}
</SafeAreaView>
    )
}
const  styles = StyleSheet.create({
    container: {
        flex: 1,  width: "100%",
    },
    background: {  flex: 1, backgroundColor: "#f0f0f0"
    },
    fileContainer: {
alignSelf: "flex-end", maxWidth: "70%", marginVertical: 10
    },
    myFileMessage: {
alignSelf: "flex-end",
    },
    theirFileMessage: {
alignSelf: "flex-start"
    },
    fileContent: {
alignItems: "center", padding: 0
    },
    video: {
marginBottom: 10, alignItems: "center", justifyContent: "center", backgroundColor: "#f0f0f0",
height: 80, width: 80, borderRadius: 12
    },
    fileIconContainer: {
marginBottom: 10, alignItems: "center", justifyContent: "center", backgroundColor: "#f0f0f0",
height: 80, width: 80, borderRadius: 12
    },
    overlay: {
position: "absolute", top: 10, right: 10, padding: 5, borderRadius: 12, backgroundColor: '#000'  
    },
    videoPlay: {
position: "absolute",  padding: 5, borderRadius: 20, backgroundColor: '#000' 
    },
messagePorts: {
    flex: 1, padding: 12,backgroundColor: "transparent",
},
messageBubble: {
    alignSelf: "flex-start",  maxWidth: "70%", padding: 10, borderRadius: 20, marginVertical: 5,
}, 
myMessage: {
    alignSelf: "flex-end", backgroundColor: "#3fed3fff", borderRadius: 20
},
header: {
flexDirection: "row", alignItems: "center", backgroundColor: "#171616ff", borderColor: "white", borderBottomWidth: 0.1, padding: 12,
},
status: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
},

senderName: {
fontSize: 24, color: "white", fontWeight: "bold", marginLeft: 5, fontFamily: "Times New Roman",
},

online: {
    fontSize: 18,  color: "white",  fontFamily: "Times New Roman",
},
offline: {
   fontSize: 14,  color: "green", fontFamily: "Times New Roman",   
},
wallpaper: {
    width: "100%",
    flex: 1,
},
theirMessage: {
alignSelf: "flex-start", backgroundColor: "#ffffff", borderRadius: 20,
},
messageText: { fontSize: 18, textAlign: "justify",
},
    chatItem: {
        flexDirection: "row",backgroundColor: "white", borderBottomWidth: 0.5,    paddingVertical: 11, paddingHorizontal: 15,
    },
    avatar: {
        width: 50,  height: 50, borderRadius: 25,   marginRight: 12,
    },
    chattingPot: {
        flex: 1
    },
    message: {
        fontSize: 16,
        color: "#aaa"
    },
    name: {
        fontWeight: "bold",
        fontSize: 20,
        color: "white"
    },
    arrow: {
        marginRight: 12,
    },
    time: {
        fontSize: 14, color: "green"
    },
    myMessageText: {
        color: "#000",  fontWeight: "500"
    },
    theirMessageText: {
        color: "black", fontWeight: "500"
    },
    wrapper: {
        backgroundColor: "transparent",
    },
    timeStamp: {
        fontSize: 13, alignSelf: "flex-end", marginTop: 4, color: "#333"
    },
    image: {
        width: 250, height: 200, borderRadius: 12, marginBottom: 10
    },
    fileName: {
fontSize: 14, color: "#999", marginBottom: 5
    },
    fileText: {
fontSize: 15, color: "#080808ff", fontWeight: "400", marginBottom: 5
    },
    pdfView: {
position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, backgroundColor: "#ffff"
    },
    pdfHead: {
        flexDirection: "row", paddingHorizontal: 15, paddingVertical: 10, justifyContent: "center",
        alignItems: "center", backgroundColor: "#007AFF", paddingTop: Platform.OS === "ios" ? 50 : 10
    }
})