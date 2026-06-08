import React from "react";
import { FlatList, View, TouchableOpacity, StyleSheet, Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ChatItem from "./ChatItem";
import  Icon  from "react-native-vector-icons/Ionicons";
import useContact from "../data/useContact";
import { useEffect, useState, useRef } from "react";
import { Animated } from "react-native";
import axios from "axios";

const BASE_URL = "https://tuback-8pr0.onrender.com";

export default function ChatList({search, currentUser}) {

    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const query = search?.toLowerCase() || "";
    const contacts = useContact();
    const [conversations, setConversations] = useState([]);

    const filteredContacts = contacts.filter((contact) => {
      const fullName =  `${contact.givenName} ${contact.familyName || ""}`.toLowerCase();
      const phone = contact.phoneNumbers[0]?.number || "";
      return (
        fullName.includes(query) || phone.includes(query)
      );
    });

    useEffect(() => {
    if(currentUser?.id) {
        fetchConversations();
    }
    }, [currentUser])

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        userNativeDriver: true,
      }).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
               toValue: -10,
        duration: 800,
        userNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
               toValue: 0,
        duration: 800,
        userNativeDriver: true
          }),
        ])
      ).start()
    }, [])
const fetchConversations = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}/messages/conversations/${currentUser.id}`
    );
    setConversations(res.data)

  } catch(err) {
    console.error(err)
  }
}


    const filteredChats = conversations.filter(chat => 
      chat.user?.name?.toLowerCase().includes(query)
    );

    const mergedData = query.length > 0
    ? [
      ...filteredChats.map(item => ({
        id: item.chatId,
        chatId: item.chatId,
        user: item.user,
        lastMessage: item.lastMessage,
        type: "chat"

      })),
         ...filteredContacts.map((item) => ({
        id: item.recordID,
        name: `${item.givenName} ${item.familyName || ""}`,
        phoneNumber: item.phoneNumbers[0]?.number || "",
        avatar: item.thumbnailPath || null,
        type: "contact"
       }))
 
    ]
      : conversations.map(item => ({
        id: item.chatId,
        chatId:  item.chatId,
        user: item.user,
        lastMessage: item.lastMessage,
        type: "chat"

      }))
    return(
<View style={{flex: 1}}>

  <FlatList
    data={mergedData}
    keyExtractor={(item) => item.type === "chat"? item.chatId : item.id}
    renderItem={({ item }) => {

      if (item.type === "chat")  {
        return (
          <ChatItem 
          user={item.user}
          lastMessage={item.lastMessage}

          onPressRow={() => navigation.navigate(
            "Chats",
             {user: item.user,
                 chatId: item.chatId,
             })
            }
          onPressAvatar={() => navigation.navigate("Profile", {user: item.user})}
          />
        )}

      return(
        <TouchableOpacity 
        style={styles.myContact}
        onPress={() => navigation.navigate("Chats", {
          user: {
            id: item.id,
            name: item.name,
            phoneNumber: item.phoneNumber,
            avatar: item.avatar,
            messages: [],
          },
          isNewChat: true,
        })}>
          
          <View style={styles.avatarContact}>
<Text >
  {item.name}
</Text>
          </View>
        </TouchableOpacity>
      )

    }}
 ListEmptyComponent={() => (
<Animated.View
style={[styles.emptyPort, {opacity: fadeAnim}]}>
  <Animated.Text  style={[styles.emoji, 
    { transform: [{translateY: bounceAnim}],
  },
  ]}>
    🤝
  </Animated.Text>

<Text style={styles.emptyTitles}>
      Start Chat With TuChat!!
    </Text>
    <Text style={styles.emptyTitle}>
      Tap the + button to start a chat with friends!!
    </Text>


</Animated.View>

    

 )}
    contentContainerStyle={{paddingBottom: 150, flexGrow: 1 }}
    showsVerticalScrollIndicator={true}
    persistentScrollbar={true}
  />
  <TouchableOpacity
    style={styles.float}
    onPress={() => navigation.navigate("AddCall" as never)}
  >
    <View style={styles.chatText}>
      <Icon name="add" size={26} color="white" />
    </View>
  </TouchableOpacity>

</View>

    )
}
const styles = StyleSheet.create({
        float: {
        position: "absolute", bottom: 20, right: 15, backgroundColor: "#1f2020ff",    elevation: 2,
        zIndex: 2,
        height: 70, width: 70, borderRadius: 35, alignItems: "center", justifyContent: "center"
    },
    chatText: {
        color: "white", alignItems: "center",   justifyContent: "center"
    },
    myContact: {
      flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1,
      borderBottomColor: "#333"
    },
    avatarContact: {
      width: 60, height: 60, borderRadius: 30, justifyContent: "center",
      alignItems: "center", marginRight: 10, 
  backgroundColor: "#0a9df1"
    },
    emptyPort: {
      justifyContent: "center", alignItems: "center", paddingHorizontal: 20, flex: 1
    },
    emptyTitle: {
      color: "#000",
      fontSize: 25, fontWeight: "bold",
      textAlign: "center"
    },
    emoji: {
      fontSize: 100,
      marginBottom: 5
    },
      emptyTitles: {
      color: "#0a9df1",
      fontSize: 28, fontWeight: "bold",
      textAlign: "center"
      
    },
   
})


