import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity} from "react-native";

type Props = {
    user: {
        id: string, name: string, avatar: string, online: boolean,  lastMessage?: string,
        timeStamp?: string,

    };
    onPressRow: () => void;
    onPressAvatar: () => void
}

export default function ChatItem({user, onPressRow, onPressAvatar}: Props) {
    return(
        
<TouchableOpacity onPress={onPressRow}  style={styles.chatItem}>
        <TouchableOpacity onPress={onPressAvatar} style={{position: "relative", marginLeft: 2}}>
<Image 
        source={{uri: user.avatar}}
        style={styles.avatar}/>
        <View 
        style={[
            styles.statusDot,
            {backgroundColor: user.online ? "blue" : "gray"}
        ]}
        />
         </TouchableOpacity>

         <View style={styles.mid}>
<Text style={styles.name}>  {user.name}</Text>
<Text style={styles.lastMessage} numberOfLines={1}>
    {user.lastMessage}
</Text>
         </View>
         <View style={styles.right}>
<Text style={styles.time}>{user.timeStamp}</Text>
         </View>
</TouchableOpacity>


        
    )
}
const styles = StyleSheet.create({
    chatItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
   mid: {
flex: 1, justifyContent: "center", marginLeft: 12
   },
    right: {
alignItems: "flex-end",
justifyContent: "flex-start"
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    pro: {
        flex: 1,
        flexDirection: "row",
       justifyContent: "space-between",
       alignItems: "center"
        
    },
    statusDot: {
width: 12,
height:12,
borderRadius: 6, right: 2, position: "absolute", top: 2, borderWidth: 1, borderColor: "white"
    },
    name: {
        fontSize:22,
        color: "black",
        fontWeight: "bold",
         fontFamily: "Times New Roman",
    },
    online: {
        color: "blue",
        fontSize: 16,
        fontFamily: "Times New Roman",

    },
    offline: {
        fontSize: 16,
        color: "red",
        fontFamily: "Times New Roman",
    },
    lastMessage: {
        fontSize: 19,
        color: "gray",
        marginTop: 2
    },
    time: {
        fontSize: 15, 
        color: "gray"
    }
})
