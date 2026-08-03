import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity} from "react-native";

type Props = {
    user: {
        id: string, 
        name: string,
         avatar: string | null, 
         online: boolean,  
    };
      lastMessage?: string,
      timeStamp?: string,
    onPressRow: () => void;
    onPressAvatar: () => void
}

const getInitials = (name: string) => {
  if (!name) return "";

  const parts = name.trim().split(" ");

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0).toUpperCase() +
    parts[1].charAt(0).toUpperCase()
  );
};

export default function ChatItem({user, lastMessage, timeStamp, onPressRow, onPressAvatar}: Props) {
    const getAvatarColor =  (id: string) => {
        let hash = 0;
        for(let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash)% 360;
        return `hsl(${hue}, 65%, 50%)`

    }
    const formatTime  = (dateString?: string) => {
        if(!dateString) return "";
        const messageDate = new Date(dateString);
        const now = new Date();
        const isToday = messageDate.toDateString() === now.toDateString();

        const yesterday = new Date();
        yesterday.setDate(now.getDate() -1);
        const isYesterday = messageDate.toDateString() === yesterday.toDateString();

        if(isToday) {
            return messageDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
        }

        if(isYesterday) {
            return "Yesterday";
        }
const diffrentDays = (now.getTime() - messageDate.getTime()) /
(1000 * 60 * 60 * 24);
if(diffrentDays <7) {
    return messageDate.toLocaleDateString([],{
        weekday: "long"
    });
}

return messageDate.toLocaleDateString([],  {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit"
})
    }
    return(
        
<TouchableOpacity onPress={onPressRow}  style={styles.chatItem}>
        <TouchableOpacity onPress={onPressAvatar} style={{position: "relative", marginLeft: 2}}>
{user.avatar ? (
        <Image source={{uri: user.avatar}} style={styles.avatar}  />
    ) : (
        <View style={[
            styles.avatarFall,
            {backgroundColor:getAvatarColor(user.id),},
        ]} >

           <Text style={styles.avatarText} >
             {getInitials(user.name)}
           </Text>
        </View>
    )
}
         </TouchableOpacity>

         <View style={styles.mid}>
<Text style={styles.name}>{user.name}</Text>
<Text style={styles.lastMessage} numberOfLines={1}>
    {lastMessage}
</Text>
         </View>
         <View style={styles.right}>
<Text style={styles.time}>{formatTime(timeStamp)}</Text>
         </View>
</TouchableOpacity>
     
    )
}
const styles = StyleSheet.create({
    chatItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth:0.5,
        borderBottomColor: "#ECECEC"
    },
   mid: {
flex: 1, justifyContent: "center", marginLeft: 12, 
   },
    right: {
alignItems: "flex-end",
justifyContent: "flex-start",
width: 100,
    },
    avatar: {
        width: 58,
        height: 58,
        borderRadius: 29,
        marginRight: 5,
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
    avatarFall: {
width: 58,
height: 58,
justifyContent: "center",
alignItems: "center",
borderRadius: 29,
marginRight: 2,


    },
    avatarText: {
color: "#fff", 
fontSize:25,
   fontWeight: "bold",
    },
    name: {
        fontSize:22,
        color: "#3a3232",
        fontWeight: "700",
        marginBottom: 2
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
        fontSize: 16,
        color: "#363434",
        marginTop: 2
    },
    time: {
        fontSize: 18, 
        color: "gray"
    }
})
