import React from "react";
import { FlatList, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ChatItem from "./ChatItem";
import  Icon  from "react-native-vector-icons/Ionicons";

const dummyUsers = [
    {
        id: "1", name: "Ken",
        avatar: "https://drive.google.com/uc?export=view&id=1niTtaBYKNWAvx9FbUtFVmBkgH6n-uxi3",
        online: true,
        lastMessage: "Hello, kindly wait till kesho very early in the morning!!",
        message: [
             {
            id: "1-l", text: "Yes Pumkin", sender: "Reagan", time: "11.24 AM"
        },
         {
            id: "1-2", text: "How is the going so fur", sender: "me", time: "11.27 AM"
        },
        ],
        timeStamp: "2:01 PM"
       
    },
    {
        id: "2",
        name: "Reagan",
        avatar:  "https://drive.google.com/uc?export=view&id=1IdTKppTdsK4_i9lUR1VKOUXujxC6RrsL",
        online: true,
          lastMessage: "Hello dear",
        message: [
             {
            id: "2-l", text: "Yes Pumkin", sender: "Reagan", time: "11.24 AM"
        },
         {
            id: "2-2", text: "How is the going so fur", sender: "me", time: "11.27 AM"
        },
        ],
        timeStamp: "12.27 PM"
       
    },
    {
        id: "3",
        name: "Ekombe",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        online: true,
          lastMessage: "Omwana wefu, mulembe okhukhama nakhwo",
        message: [
             {
            id: "3-1", text: "Yes Pumkin", sender: "Reagan", time: "11.24 AM"
        },
         {
            id: "3-2", text: "How is the going so fur", sender: "me", time: "11.27 AM"
        },
        ],
        timeStamp: "12: 20 PM"
       
    },
    {
        id: "4",
        name: "Higal",
        avatar: "https://drive.google.com/uc?export=view&id=19XRQ062YGtJbptSiwgNXz4uuTARJBe-s",
        online: true,
          lastMessage: "Akombe, share the MVP, I wanna take a look at it",
        message: [
             {
            id: "4-1", text: "Yes Pumkin", sender: "Reagan", time: "11.24 AM"
        },
         {
            id: "4-2", text: "How is the going so fur", sender: "me", time: "11.27 AM"
        },
        ],
        timeStamp: "9.27 AM"
       
    },
    {
        id: "5",
        name: "Kevo",
        avatar: "https://drive.google.com/uc?export=view&id=19XRQ062YGtJbptSiwgNXz4uuTARJBe-s",
        online: true,
          lastMessage: "Kindly, get me posted if you are still showng up tommorow",
        message: [
             {
            id: "5-1", text: "Yes Pumkin", sender: "Reagan", time: "11.24 AM"
        },
         {
            id: "5-2", text: "How is the going so fur", sender: "me", time: "11.27 AM"
        },
        ],
        timeStamp: "9.23 AM"
       
  
    },
     {
        id: "6",
        name: "Irene",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        online: true,
          lastMessage: "Mluhya uko aje, how the going so fur",
        message: [
             {
            id: "6-1", text: "Yes Pumkin", sender: "Reagan", time: "11.24 AM"
        },
         {
            id: "6-2", text: "How is the going so fur", sender: "me", time: "11.27 AM"
        },
        ],
        timeStamp: "8:56 AM"
       
    },
     {
        id: "7",
        name: "Mum",
        avatar:  "https://drive.google.com/uc?export=view&id=1IdTKppTdsK4_i9lUR1VKOUXujxC6RrsL",
        online: true,
          lastMessage: "Yes Mulembe  Mum, I will call kesho",
        message: [
             {
            id: "7-1", text: "Yes Pumkin", sender: "Reagan", time: "11.24 AM"
        },
         {
            id: "7-2", text: "How is the going so fur", sender: "me", time: "11.27 AM"
        },
        ],
        timeStamp: "8:01 AM"
    },
       {
        id: "8",
        name: "Ekombe",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        online: true,
          lastMessage: "Omwana wefu, mulembe okhukhama nakhwo",
        message: [
             {
            id: "8-1", text: "Yes Pumkin", sender: "Reagan", time: "11.24 AM"
        },
         {
            id: "8-2", text: "How is the going so fur", sender: "me", time: "11.27 AM"
        },
        ],
        timeStamp: "12: 20 PM"
       
    },
       {
        id: "9",
        name: "Ekombe",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        online: true,
          lastMessage: "Omwana wefu, mulembe okhukhama nakhwo",
        message: [
             {
            id: "9-1", text: "Yes Pumkin", sender: "Reagan", time: "11.24 AM"
        },
         {
            id: "9-2", text: "How is the going so fur", sender: "me", time: "11.27 AM"
        },
        ],
        timeStamp: "12: 20 PM"
       
    },
       {
        id: "10",
        name: "Ekombe",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        online: true,
          lastMessage: "Omwana wefu, mulembe okhukhama nakhwo",
        message: [
             {
            id: "10-1", text: "Yes Pumkin", sender: "Reagan", time: "11.24 AM"
        },
         {
            id: "10-2", text: "How is the going so fur", sender: "me", time: "11.27 AM"
        },
        ],
        timeStamp: "12: 20 PM"
       
    },
       {
        id: "11",
        name: "Ekombe",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        online: true,
          lastMessage: "Omwana wefu, mulembe okhukhama nakhwo",
        message: [
             {
            id: "11-1", text: "Yes Pumkin", sender: "Reagan", time: "11.24 AM"
        },
         {
            id: "11-2", text: "How is the going so fur", sender: "me", time: "11.27 AM"
        },
        ],
        timeStamp: "12: 20 PM"
       
    },

]
export default function ChatList() {
    const navigation = useNavigation();
    return(
<View style={{flex: 1}}>
<View style={{ flex: 1 }}>
  <FlatList
    data={dummyUsers}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <ChatItem
        user={item}
        onPressRow={() => navigation.navigate("Chats", { user: item })}
        onPressAvatar={() => navigation.navigate("Profile", { user: item })}
      />
    )}
    contentContainerStyle={{ paddingBottom: 150 }}
    showsVerticalScrollIndicator={true}
    persistentScrollbar={true}
  />

  <TouchableOpacity
    style={styles.float}
    onPress={() => navigation.navigate("StartChat" as never)}
  >
    <View style={styles.chatText}>
      <Icon name="add" size={26} color="white" />
      <Text style={{ color: "white", fontSize: 22 }}>New Chat</Text>
    </View>
  </TouchableOpacity>
  
<View style={styles.bottomNav} >
<View style={styles.bots}>
    <TouchableOpacity onPress={() => navigation.navigate("Live" as never) } style={styles.botItem}>
<Text style={styles.navText}>Live</Text>
</TouchableOpacity>
</View>

<View style={styles.bots}>
<TouchableOpacity onPress={() => navigation.navigate("Groups" as never) } style={styles.botItem}>
<Text style={styles.navText}>Groups</Text>
</TouchableOpacity>
</View>
 
<View style={styles.bots}>
<TouchableOpacity onPress={() => navigation.navigate("Trends" as never) } style={styles.botItem}>
<Text style={styles.navText}>Trends</Text>
</TouchableOpacity>
</View>
            </View>
</View>

            
</View>

    )
}
const styles = StyleSheet.create({
        float: {
        position: "absolute", bottom: 80, right: 20, backgroundColor: "black",    elevation: 2,
        zIndex: 2,
        height: 60, width: 150, borderRadius: 30, alignItems: "center", justifyContent: "center"
    },
    chatText: {
        flexDirection: "row", color: "white", alignItems: "center", gap: 4, padding: 8, 
    },
    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        left:0,
        right: 0,
        position: "absolute",
        paddingVertical: 10,
        zIndex: 1,
        bottom: 1,
     
    },

    botItem: {paddingHorizontal: 15,

    },
    navText: {
        color: "white",
        fontWeight: "400",
        fontSize: 22
    },
    bots: {
        backgroundColor: "black", height: 50, width: 120, borderRadius: 30, justifyContent: "center", alignItems: "center"
    }
})