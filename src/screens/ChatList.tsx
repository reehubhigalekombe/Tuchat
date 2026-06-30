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

type RegisteredUser = {
  _id: string;
  name: string;
  handle: string;
  phone: string;
  avatar?: string;
  isOnline?: boolean;
};
type CurrentUser =  {
  _id: string;
} | null;

type Props = {
  search: string; 
  currentUser: CurrentUser;
}

type Conversations = {
  chatId: string;
  user: {
    _id: string;
    name: string,
    avatar?: string,
  };
  lastMessage: string
}

type ChatItemType = |
{ type: "chat";  id: string; chatId: string; user: any; lastMessage: string} |
{
  type: "contact"; id: string; name: string; avatar?:string; online?: boolean
}
export default function ChatList({search, currentUser,}: Props) {

    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const query = search?.toLowerCase() || "";
    const {contacts=[], registeredUsers = [],} = useContact();
    const users: RegisteredUser[] = registeredUsers
    
    const [conversations, setConversations] = useState<Conversations[]>([]);
    console.log("ChatList currentUser: ", currentUser);

    const normalizePhone = (phone: string) => {
      return phone.replace(/\D/g, "");
    }

    const fetchConversations = async () => {
  try {
    if(!currentUser?._id) return;
    const res = await axios.get(
      `${BASE_URL}/messages/conversations/${currentUser._id}`
    );  
    setConversations(res.data)
  } catch(err) {
    console.error(err)
  }
};

    useEffect(() => {
        fetchConversations();
    }, [currentUser?._id])

    
    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
               toValue: -15,
        duration: 800,
        useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
               toValue: 0,
        duration: 800,
        useNativeDriver: true
          }),
        ])
      ).start()
    }, [])

    const filteredContacts = contacts.filter((contact) => {
      const phone = normalizePhone(
        contact.phoneNumbers[0]?.number || ""
      );
      const fullName =  `${contact.givenName} ${contact.familyName || ""}`.toLowerCase();
      const isRegistered = users.find(
        user => normalizePhone(user.phone) === phone
      );
      return isRegistered && (
        fullName.includes(query) || phone.includes(query)
      );
    });

    const filteredChats = conversations.filter(chat => 
      chat.user?.name?.toLowerCase().includes(query)
    );

    const mergedData: ChatItemType[] = query.length > 0
    ? [
      ...filteredChats.map(item => ({
        id: item.chatId,
        chatId: item.chatId,
        user: item.user,
        lastMessage: item.lastMessage,
        type: "chat" as const,
      })),
         ...filteredContacts.map(contact=> {
          const matchUser = registeredUsers.find(
            (user: RegisteredUser)=> 
              normalizePhone(user.phone) === 
            normalizePhone( contact.phoneNumbers[0]?.number || "")
          );
          if(!matchUser) return null;
          return {
           id: matchUser._id,
            name: matchUser.name,
            avatar: matchUser.avatar,
            online: matchUser.isOnline,
            type:  "contact" as const,
          };
         })
         .filter(
          (item
          ) : item is Extract <
          ChatItemType, 
          {type: "contact"}
          >  => item !== null
         ),
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
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => {

      if (item.type === "chat")  {
        return (
          <ChatItem 
          user={item.user}
          lastMessage={item.lastMessage}
          onPressRow={() => navigation.navigate(
            "Chats" as never,
             {user: item.user,
                 chatId: item.chatId,
             } as never
            )
            }
          onPressAvatar={() => navigation.navigate("Profile" as never, 
            {
              user: item.user,
            } as never)}
          />
        )}

      return(
        <TouchableOpacity 
        style={styles.myContact}
        onPress={() => navigation.navigate("Chats" as never, {
          user: {
            id: item.id,
            name: item.name,
            avatar: item.avatar,
            message: [],
          },
          isNewChat: true,
        })}>
          
          <View style={styles.avatarContact}>
<Text >
  {item.name
  .split(" ")
  .map(n => n[0]
  )
  .join("")
  .toUpperCase()}
</Text>
          </View>
          <Text>
            {item.name}
          </Text>
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
        zIndex: 999,
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
      textAlign: "center",
    },
})


