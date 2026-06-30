import React, { useEffect, useRef, useState, useContext } from "react";
import { View,  Text, StyleSheet, TouchableOpacity, Image, FlatList, Platform, KeyboardAvoidingView, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyChat from "../component/EmptyChat";
import axios  from "axios";
import MessageInput from "../component/MessageInput";
import Icon  from "react-native-vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import ChatList from "./ChatList";
import { UserContext } from "../context/UserContext";

const getInitials = (name: string) => {
  if (!name) return "";

  const parts = name.trim().split(" ");

  if (parts.length === 1) {return parts[0].charAt(0).toUpperCase();}

  return (
    parts[0].charAt(0).toUpperCase() +
    parts[1].charAt(0).toUpperCase() );
};

const BASE_URL = "https://tuback-8pr0.onrender.com";
const WS_URL = "wss://tuback-8pr0.onrender.com";

type Prop = {
    search: string;
}
export default function Chats({search}: Prop) {

    type Message = { id: string; text: string;
    sender?: string, timeStamp: string, 
    status?: "sending" | "sent" | "delivered" | "seen",
    type? : "text" | "image" | "audio" | "video" | "file";  file?: any
};

type RouteParams ={
    user: {id: string, name: string, avatar: string,  online: boolean,
        lastMessage? :string, message? : Message[], timeStamp? : string  };
};

    const route = useRoute();
    const navigation = useNavigation();

    const user  = (route.params as RouteParams | undefined )?.user;
    const userContext = useContext(UserContext);
    if(!userContext) {
        throw new Error ("{UserContext must be inside UserPrtovider}")
    }
    const{currentUser} = userContext

    const [messages, setMessages] = useState<Message[]>([]);
    useEffect(() => {
        if(user?.message) {
            setMessages(user.message)
        }
    }, [user])
    const[isOnline, setIsOnline] = useState(true)

    const ws = useRef<WebSocket | null>(null);
    const chatId = currentUser?.id && user?.id?
  [currentUser?.id, user.id].sort().join("_") : "";

useEffect(()  => {
    const parent = navigation.getParent();
    parent?.setOptions({
        tabBarStyle: {display: "none",},
    });
    return () => {
        parent?.setOptions({
            tabBarStyle: {  backgroundColor: "#000",  height: 80,  paddingBottom: 8, paddingTop: 8 },
        }) }
}, [navigation])
        
 useEffect(() => {
    if(!user?.id || !currentUser?.id)  return;

    const fetchMessages = async () => {
        try{
            const res = await axios.get(`${BASE_URL}/messages/${chatId}`);

            const formartted= res.data.map((msg: any) => ({
                id: msg._id,text: msg.text, sender: msg.senderId,  timeStamp: msg.createdAt, status: msg.status,  type: msg.type, file: msg.file || null   }));
            setMessages(formartted.reverse());
        }catch(err) {
            console.error("Error found while retriveing the messages:",err)
        } };
    fetchMessages();
 ws.current = new WebSocket(WS_URL);
ws.current.onopen = () => {
  console.log("WebSocket connected successfully");
  
  ws.current?.send(
    JSON.stringify({
    type: "join", 
    userId: currentUser.id,
    chatId,
  }));
};

ws.current.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    if(data.type === "join" || data.type === "status") return
        const newMessage: Message = {
            id: data._id ||  Date.now().toString(),
            text: data.text, sender: data.senderId,    timeStamp: data.createdAt || new Date().toISOString(),  type: data.type,  file: data.file || null,
        };
        setMessages((prev) => [newMessage, ...prev]);
        return;
  } catch (err) {
    console.error("WebSocket message parse error:", err);
  }};
               ws.current.onerror = (err) =>
                console.error("WebSocket error", err);

               ws.current.onclose = () =>
                console.log("WebSocket has been closed");
               return () =>{
                ws.current?.close()
               }
 }, [chatId]);

 const handleSend = (msg: string) => {
        if(!msg.trim()) return;
        if(!currentUser?.id) {
            console.log("currentUSer is null", currentUser);
            return
        }
        if(!currentUser?.id || !user?.id) {
            console.log("Chat user is null", user);  return  }
        const tempId = Date.now().toString();
        const newMessage: Message = {
            id: tempId,  text: msg, sender: currentUser.id, timeStamp: new Date().toISOString(),  status: "sending",  type: "text"  }
        setMessages((prev) => [newMessage, ...prev]);
        const payload = { tempId, chatId, sender: currentUser?.id,  receiver: user.id, message: msg, type: "text"  };
        ws.current?.send(JSON.stringify(payload));
setInput("")
    };
     const renderMessage = ({item}: {item: Message}) => {
        const isMe = item.sender === "me";
        if (item.type === "image" || item.type === "video" || item.type === "file"|| item.type === "audio") {
return (
    <View style={[styles.fileContainer, isMe ? styles.myFileMessage :  styles.theirFileMessage]}>
<Text >
    {new Date(item.timeStamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    })}
</Text>
    </View>
)}
        return (
<View style={[ isMe ? styles.myWrap : styles.theirWrap]}>
 <View style={[styles.messageBubble,  isMe ? styles.myMessage : styles.theirMessage ]}>
        <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessage]} > {item.text} </Text>
            </View>

            <View style={{flexDirection: "row", alignItems: "center"}}>
                <Text style={[
                    styles.timeStampOut, 
                    isMe ? styles.myTime : styles.theirTime
                ]}>
                    {new Date(item.timeStamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    })} </Text>
                {isMe && (
                    <View style={{marginLeft: 4}}>
                        {item.status === "sending" && (<Icon name="time-outline"  size={12} color= "#999"/>)}
                        {item.status === "sent" && ( <Icon name="checkmark"  size={12} color= "#999"/> )}
                        {item.status === "delivered" && ( <Icon name="done-all"  size={12} color= "#999"/> )}
                        {item.status === "seen" && (<Icon name="ellipse"  size={12} color= "#2196F3"/>)}
                        </View>
                )}
            </View>  
</View>         
        );
    };
      if(!user) {
        return <ChatList search={search} currentUser={currentUser}/>  };
    return(
<SafeAreaView style={styles.container}>
<KeyboardAvoidingView
style={{flex: 1, }}
behavior={Platform.OS === "android" ? "padding" : undefined}
keyboardVerticalOffset={90}
>
    <View style={styles.background}>
        <View style={styles.header}> 
            <View style={styles.leftHand}>
   <TouchableOpacity onPress={() => navigation.navigate("Chats" as never)} style={styles.arrow}>
            <Icon name="chevron-back" size={26} color="white" />
        </TouchableOpacity>
    
       <TouchableOpacity onPress={() => navigation.navigate("Profile", {user})}>
      {
          user.avatar ? (
              <Image source={{uri: user.avatar}} style={styles.avatar}  />
          ) : (
              <View style={styles.avatarFall} >
                 <Text style={styles.avatarText} >
                   {getInitials(user.name)}
                 </Text>
              </View>
          )
      }
       </TouchableOpacity>
        <Text style={styles.senderName}>{user.name}</Text>
            </View>
     
        <View style={styles.rightHand}>
    <TouchableOpacity style={{marginHorizontal: 8, padding: 4}}
     onPress={() => navigation.navigate("Calls" as never)}>
            <Icon name="call-outline" size={26} color="white" />
    </TouchableOpacity>

        <TouchableOpacity style={{marginHorizontal: 8, padding: 4}}
           onPress={() => navigation.navigate("VideoCall" as never)}>
              <Icon name="videocam-outline" size={26} color="white" />
    </TouchableOpacity>
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
        inverted />
   )}
</View>

<View style={styles.wrapper}>
<MessageInput 
onSend={handleSend}
/>
</View>          
    </View>
    </View>
</KeyboardAvoidingView>

</SafeAreaView>
    )
}
const  styles = StyleSheet.create({
    container: {
        flex: 1,  width: "100%",
    },
    background: {  flex: 1, backgroundColor: "#2e2d2dff", 
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
    alignSelf: "flex-end", backgroundColor: "rgba(10, 157, 241, 1)", borderRadius: 20
},
header: {
flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#0a0a0aff", paddingHorizontal: 10, paddingVertical: 8
},
rightHand: {
flexDirection: "row", alignItems: "center", 
},
leftHand: {
flexDirection: "row", alignItems: "center"
},

senderName: {
fontSize: 18, color: "white", fontWeight: "400", marginLeft: 2, fontFamily: "Times New Roman",
},

online: {
    fontSize: 18,  color: "rgba(10, 157, 241, 1)",  fontFamily: "Times New Roman",
},
offline: {
   fontSize: 14,  color: "#999", fontFamily: "Times New Roman",   
},
wallpaper: {
    width: "100%",
    flex: 1,
}, messageWrap: {
maxWidth: "75%", marginVertical: 6
},
myWrap: {
alignSelf: "flex-end",
alignItems: "flex-end"
},
theirWrap: {
alignSelf: "flex-start",
alignItems: "flex-start"
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
        width: 40,  height: 40, borderRadius: 20,   marginRight: 6,
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
        marginRight: 6,
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
    timeStampOut: {
        fontSize: 13, opacity: 0.6, marginTop: 4
    },
    myTime: {
marginRight: 4, color: "#fff"
    },
    theirTime: {
marginLeft: 4, color: "white", fontWeight: "500"
    },
    image: {
        width: 250, height: 200, borderRadius: 12, marginBottom: 10
    },
    fileName: {
fontSize: 14, color: "#fff", marginBottom: 5
    },
    fileText: {
fontSize: 15, color: "#fff", fontWeight: "400", marginBottom: 5
    },
    pdfView: {
position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, backgroundColor: "#ffff"
    },
    pdfHead: {
        flexDirection: "row", paddingHorizontal: 15, paddingVertical: 10, justifyContent: "center",
        alignItems: "center", backgroundColor: "#007AFF", paddingTop: Platform.OS === "ios" ? 50 : 10
    },
       avatarFall: {
width: 50,
height: 50,
justifyContent: "center",
alignItems: "center",
borderRadius: 25,
marginRight: 10,
backgroundColor: "#fff", 
    },
    avatarText: {
color: "#999", 
fontSize:22,
   fontWeight: "bold",
    },
})