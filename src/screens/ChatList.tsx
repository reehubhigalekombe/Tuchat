import React from "react";
import { FlatList, View, TouchableOpacity, StyleSheet, Image, Text,} from "react-native";
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
  id: string;
} | null;

type Props = {
  search: string; 
  currentUser: CurrentUser;
}

type Conversations = {
  chatId: string;
  user: {
    id: string;
    name: string,
    phone: string,
    avatar?: string,
  };
  lastMessage: string,
  status: "sent" | "delivered" | "seen";
  updatedAt: string
}
type MessageResult = {
  messageId: string; chatId: string; text:  string;
  type: "text" | "image" | "audio" | "video";
  createdAt: string;
  user: {
    id: string; name: string; phone: string; handle?: string; avatart?: string;
    isOnline?: string; lastSeen?: string
  };
}

type ChatItemType = |
{ type: "chat";  id: string; chatId: string; user: any; lastMessage: string, 
  status: "sent"| "delivered" | "seen"
  updatedAt: string} |
{
  type: "contact"; id: string; name: string; phone: string; avatar?:string; online?: boolean
}
| {
  type:"message"; id: string; messageId: string; chatId: string; text: string;
  createdAt: string; user: any
}
export default function ChatList({search, currentUser,}: Props) {

    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const query = search?.toLowerCase() || "";
    const {contacts=[], registeredUsers = [],} = useContact();
    const users: RegisteredUser[] = registeredUsers;

    const normalizePhone = (phone?: string) => {
      if(!phone) return "";
        let cleaned =  phone.replace(/\D/g, "");
        // Here we convert Kenyan local contacts (07....) to the international format (254...);
        if(cleaned.startsWith("0")) {
            cleaned = "254" + cleaned.slice(1)
        }
        return cleaned;
      }
   
    const contactMap = new Map<string, string>();
    contacts.forEach(contact => {
      const phone = normalizePhone(contact.phoneNumbers[0]?.number || "");
      const displayName = `${contact.givenName} ${contact.familyName || ""}`.trim();
      if(phone) {
        contactMap.set(phone, displayName)
      }
    });

    const[messageResults, setMessageResults] = useState<MessageResult[]>([]);
    const[searchingMessages, setSearchingMessages] = useState(false)
    const [conversations, setConversations] = useState<Conversations[]>([]);
    console.log("ChatList currentUser: ", currentUser);

    const fetchConversations = async () => {
  try {
    if(!currentUser?.id) return;
    const res = await axios.get(`${BASE_URL}/messages/conversations/${currentUser.id}`
    );  
    console.log("Coversations response: ", JSON.stringify(res.data, null, 2))
    setConversations(res.data)
  } catch(err) {
    console.error(err)
  }
};

useEffect(() => {
  if(!currentUser?.id || query.trim()) {
    setMessageResults([]);
    return
  }
  const timer = setTimeout(async () => {
    try {
      setSearchingMessages(true);
      const res = await axios.get(`${BASE_URL}/messages/search/${currentUser.id}`,
        {
          params: {q: query.trim()
          }
        }
      );
      console.log("Message search results: ",
        JSON.stringify(res.data, null, 2)
      );
      setMessageResults(res.data)
    }catch(err) {
      console.error("Failed to search message: ", err)
      setMessageResults([])
    } finally {
      setSearchingMessages(false);
    }
  }, 350);
  return () => clearTimeout(timer);
}, [query, currentUser?.id])

    useEffect(() => {
        fetchConversations();
    }, [currentUser?.id])

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
        status: item.status,
        updatedAt: item.updatedAt,
        type: "chat" as const,
      })),
         ...filteredContacts.map(contact=> {
          const matchUser = registeredUsers.find(
            (user: RegisteredUser)=> 
              normalizePhone(user.phone) === 
            normalizePhone( contact.phoneNumbers[0]?.number || "")
          );
          if(!matchUser) return null;
           const displayName = `${contact.givenName} ${contact.familyName || ""} `.trim();
        return {
           id: matchUser._id,
            name: displayName,
            phone: matchUser.phone,
            avatar: matchUser.avatar,
            online: matchUser.isOnline,
            type:  "contact" as const,
          };

         }) .filter(
          (item) : item is Extract <
          ChatItemType, 
          {type: "contact"}
          >  => item !== null
         ),

         ...messageResults.map(item => ({
          id: item.messageId,
          messageId: item.messageId,
          chatId: item.chatId,
          text: item.text,
          createdAt: item.createdAt,
          user: item.user,
          type: "message" as const

         }))
    ]
      : conversations.map(item => ({
        id: item.chatId,
        chatId:  item.chatId,
        user: item.user,
        lastMessage: item.lastMessage,
        status: item.status,
          updatedAt: item.updatedAt,
        type: "chat"

      }))
    return(
<View style={{flex: 1}}>

  <FlatList
    data={mergedData}
    keyExtractor={(item) => `${item.type} - ${item.id}`}
    renderItem={({ item }) => {

      if (item.type === "chat")  {
        console.log("Conversations user: ", item.user);
        const normalizedPhone = normalizePhone(item.user.phone);
        console.log("Phone from server: ", item.user.phone);
        console.log("Normarlized phone: ", normalizedPhone);
        console.log("Phonebook match: ", contactMap.get(normalizedPhone))
        const displayUser = {
  ...item.user,
  name:
    contactMap.get(normalizePhone(item.user.phone)) ??
    item.user.name,
};
        return (
          <ChatItem 
          user={displayUser}
          lastMessage={item.lastMessage}
          timeStamp={item.updatedAt}
          status={item.status}
          onPressRow={() => navigation.navigate(
            "Chats" as never,
             {user: displayUser,
                 chatId: item.chatId,
             } as never
            )
            }
          onPressAvatar={() => navigation.navigate("Profile" as never, 
            {
              user: displayUser,
            } as never)}
          />
        )}

        if(item.type === "message")  {
          const normalizedPhone = normalizePhone(item.user.phone);
          const displayUser = {
            ...item.user, 
            name: 
            contactMap.get(normalizedPhone) ?? 
            item.user.name,
          }
          return(
            <TouchableOpacity style={styles.messageSearch}
            onPress={() => {
              navigation.navigate("Chats" as never,
                { user: displayUser,
                  chatsId: item.chatId
                } as never
              );
            }}>
              <View style={styles.messageAvatar}>
             {displayUser.avatar ? (
              <Image source={{uri:displayUser.avatar}}  style={styles.avatarImage} />

             ) : (
              <Text>
                {displayUser.name 
                ?.charAt(0)
                .toUpperCase()
                } </Text>
             )}
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.messageUsername}>
                  {displayUser.name}
                </Text>

                <Text style={styles.searchText}
numberOfLines={1}
                >{item.text}</Text>
              </View>

            </TouchableOpacity>
          )
        }

      return(
        <TouchableOpacity 
        style={styles.myContact}
        onPress={() => {
          console.log("Pressed Item:", item);
          navigation.navigate("Chats" as never, {
             user: {
            id: item.id,
            name: item.name,
            phone: item.phone,
            avatar: item.avatar,
            message: [],
          },
          isNewChat: true
          });
        } }>
          
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
    messageSearch: {
      flexDirection: "row", alignItems: "center", paddingHorizontal: 15, paddingVertical: 12
    },
    messageAvatar: {
      width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center",
      marginRight: 10, backgroundColor: "#ddd"
    },
    avatarImage: {
      width: 50, height: 50, borderRadius: 25,
    },
    messageUsername: {
color: "#fff", fontSize: 15, fontWeight: 500
    },
    searchText: {
      color: "#aaa", fontSize: 13, marginTop: 3
    }
})


