import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import PartitionSeg from "../component/PartitionSeg";

const UpdateData = [
    {id: "1", username: "Higal", 
        avatar: "https://drive.google.com/uc?export=view&id=1niTtaBYKNWAvx9FbUtFVmBkgH6n-uxi3", 
        hasNew: true,
        statuses: [
              { id: "s1", mediaUrl: "https://picsum.photos/400/700?1" },
                { id: "s2", mediaUrl: "https://picsum.photos/400/700?2" },
                  { id: "s3", mediaUrl: "https://picsum.photos/400/700?3" },
        ]
    },

      {id: "2", username: "Reagan", 
        avatar: "https://i.pravatar.cc/150?img=2",
         hasNew: true,
           statuses: [
              { id: "s1", mediaUrl: "https://picsum.photos/400/700?4" },
                { id: "s2", mediaUrl: "https://picsum.photos/400/700?5" },
                  { id: "s3", mediaUrl: "https://picsum.photos/400/700?6" },
        ]},

        {id: "3", username: "Ekombe",
             avatar: "https://i.pravatar.cc/150?img=3",
              hasNew: true,
                 statuses: [
              { id: "s1", mediaUrl: "https://picsum.photos/400/700?7" },
                { id: "s2", mediaUrl: "https://picsum.photos/400/700?8" },
                  { id: "s3", mediaUrl: "https://picsum.photos/400/700?9" },
        ]
            },

          {id: "4", username: "Benja", 
            avatar: "https://i.pravatar.cc/150?img=4", 
            hasNew: true,
           statuses: [
              { id: "s1", mediaUrl: "https://picsum.photos/400/700?1" },
                { id: "s2", mediaUrl: "https://picsum.photos/400/700?2" },
                  { id: "s3", mediaUrl: "https://picsum.photos/400/700?3" },
        ]},
        
    {id: "5", username: "Higaaal", 
        avatar: "https://drive.google.com/uc?export=view&id=1niTtaBYKNWAvx9FbUtFVmBkgH6n-uxi3", 
        hasNew: true,
           statuses: [
              { id: "s1", mediaUrl: "https://picsum.photos/400/700?1" },
                { id: "s2", mediaUrl: "https://picsum.photos/400/700?2" },
                  { id: "s3", mediaUrl: "https://picsum.photos/400/700?3" },
        ]
    },

      {id: "6", username: "Origo", 
        avatar: "https://i.pravatar.cc/150?img=5", 
        hasNew: true,
       statuses: [
              { id: "s1", mediaUrl: "https://picsum.photos/400/700?1" },
                { id: "s2", mediaUrl: "https://picsum.photos/400/700?2" },
                  { id: "s3", mediaUrl: "https://picsum.photos/400/700?3" },
        ]},

        {id: "7", username: "Elon", avatar: "https://i.pravatar.cc/150?img=6", hasNew: true,
               statuses: [
              { id: "s1", mediaUrl: "https://picsum.photos/400/700?1" },
                { id: "s2", mediaUrl: "https://picsum.photos/400/700?2" },
                  { id: "s3", mediaUrl: "https://picsum.photos/400/700?3" },
        ]
        },

          {id: "8", username: "Benjamin", avatar: "https://i.pravatar.cc/150?img=7", hasNew: true,
               statuses: [
              { id: "s1", mediaUrl: "https://picsum.photos/400/700?1" },
                { id: "s2", mediaUrl: "https://picsum.photos/400/700?2" },
                
        ]
          },
];
export default function Status() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const [myStatus, setMyStatus] = useState([]);
    const [recentUpdates, setRecentUpdates] = useState(UpdateData);
    const CURRENT_USER_ID = "user_1234"

    useEffect(() => {
        fetchMyStatus();
    }, []);

    useEffect(() => {
        const newStatuses = route.params?.newStatuses;

        if(newStatuses?.length) {
            setMyStatus( prev => [ ...newStatuses, 
 ...prev ])
        }
    }, [route.params?.newStatuses])

    const fetchMyStatus = async () => {
const res = await  fetch("http://10.0.2.2:3000/status");
const data = await res.json();

if(data.success && data.statuses?.length) {
    const mine = data.statuses.filter(
        (s: any) => s.userId === CURRENT_USER_ID
    );
    setMyStatus(mine);
}}

const openStatus = (item: any, index: number) => {
    setRecentUpdates(prev => 
    prev.map(u =>
        u.id === item.id ? { ...u, hasNew:  false} : u
    ));
    navigation.navigate("StatusView", {
        users: recentUpdates,
        startIndex: index
    })
}

    const renderItem = ({item, index}: any) => (
        <TouchableOpacity 
onPress={() => openStatus(item, index)}  
        style={styles.statusItem}>
<PartitionSeg   
size={60}
strokeWidth={4}
statuses={item.statuses}
avatar={item.avatar}
hasNew={item.hasNew}
/>

<View style={{flex: 1,  marginLeft: 10, flexDirection: "row"}}>
            <Text style={styles.username} numberOfLines={1}
            >
        {item.username}</Text>
        <Text style={styles.statusTime}>
         Just Now
        </Text>                         
</View>
        </TouchableOpacity>
    );
    return(
        <View style={styles.port}>
<View style={styles.head}>
<Text style={{fontSize: 24, fontWeight: "bold"}}>Status</Text>

<View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
     <Text style={{fontSize: 24, fontWeight: "bold", marginRight: 10}}> Go Live</Text>
    <TouchableOpacity >
    <Icon name="radio-button-on-outline" size={25} color= "red"  />
</TouchableOpacity>
</View>

</View>

<View style={styles.rowTop}>

<View style={{marginLeft: 10}} >

<TouchableOpacity onPress={() => {
    if(myStatus.length > 0) {
        navigation.navigate("StatusView", {
         users: [
            {
            id: "me",
             username: "MyStatus",
            avatar: myStatus[0]?.mediaUrl,
            statuses: myStatus,
            }
         ],
         startIndex: 0
        });
    }
}}>
    <PartitionSeg
size={60}
strokeWidth={4}
statuses={myStatus}
avatar={myStatus[0]?.mediaUrl || "https://drive.google.com/uc?export=view&id=19XRQ062YGtJbptSiwgNXz4uuTARJBe-s" }
hasNew={myStatus.length > 0}
/>
    </TouchableOpacity>

<TouchableOpacity style={styles.addIcon} onPress={() =>navigation.navigate("BuildStatus")}>
    <Icon name="add"  size={18} color="#fff" />
</TouchableOpacity >
</View>

<View style={{marginLeft: 10}}>
    <Text style={{fontSize: 21, fontWeight: "600"}}>My Status</Text>
    <Text style={{color: "#777", marginTop: 2, fontSize: 16}}>Tap to add  to update status</Text>
</View>

</View>

<Text style={styles.newUpdate}>Recent Updates</Text>

<FlatList
data={recentUpdates}
keyExtractor={(item) => item.id}
renderItem={renderItem}
showsVerticalScrollIndicator={true}
style={{flex: 1}}
contentContainerStyle={{paddingBottom: 15}}

/>

</View>
     
    )
}
const styles = StyleSheet.create({
    port: {
        flex: 1,
        backgroundColor: "#fff"
    },
    rowTop: {
       flexDirection: 'row',
       alignItems: "center",
       paddingVertical:10,
      
    }, 
    statusItem: {
        flexDirection: 'row',
alignItems: "center",
paddingVertical:10,
paddingHorizontal: 12,
borderBottomWidth: 1,
borderBottomColor: "#fff"
    },
    avatarPort: {
width: 60,
height: 60,
borderRadius: 30,
justifyContent: "center",
alignItems: "center",
borderWidth: 10,
    },
    avatar: {
width: 56,
height: 56,
borderRadius: 28,
    },
    username: {
        flex: 1,
       color: "#000",
       fontWeight: 700,
       fontSize: 20,
       marginLeft: 10
    },
    head: {padding: 14, justifyContent: "space-between", alignItems: "center",
        borderColor: "#ddd", borderBottomWidth: 0.5, flexDirection: "row"
    },
    statusRow: {flexDirection: "row", alignItems: "center", padding: 14},
    avatarWrap: {marginRight: 15},
    newUpdate: {
        marginLeft: 14, marginBottom: 6, marginTop: 6, color: "#777", fontWeight: "600", fontSize: 18
    }, 
    addIcon:{
width:22, height: 22, right: 0, bottom: 0, position: "absolute", justifyContent: "center",
alignItems: "center", borderRadius: 11, backgroundColor: "rgba(10, 157, 241, 1)"
    },
    live: {
marginLeft: 4, fontSize: 16, fontWeight: 500, color:  "#000"
    }, 
    statusTime: {
        fontSize: 16,
        color: "rgba(10, 157, 241, 1)",
        marginTop: 3
    }
})