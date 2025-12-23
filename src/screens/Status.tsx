import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";

const UpdateData = [
    {id: "1", username: "Higal", avatar: "https://drive.google.com/uc?export=view&id=1niTtaBYKNWAvx9FbUtFVmBkgH6n-uxi3", hasNew: true,},
      {id: "2", username: "Reagan", avatar: "https://i.pravatar.cc/150?img=2", hasNew: true,},
        {id: "3", username: "Ekombe", avatar: "https://i.pravatar.cc/150?img=3", hasNew: true,},
          {id: "4", username: "Benja", avatar: "https://i.pravatar.cc/150?img=4", hasNew: true,},
        
    {id: "5", username: "Higal", avatar: "https://drive.google.com/uc?export=view&id=1niTtaBYKNWAvx9FbUtFVmBkgH6n-uxi3", hasNew: true,},
      {id: "6", username: "Origo", avatar: "https://i.pravatar.cc/150?img=5", hasNew: true,},
        {id: "7", username: "Elon", avatar: "https://i.pravatar.cc/150?img=6", hasNew: true,},
          {id: "8", username: "Benjamin", avatar: "https://i.pravatar.cc/150?img=7", hasNew: true,},
];
export default function Status() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const [myStatus, setMyStatus] = useState([]);
    const [recentUpdates, setRecentUpdates] = useState(UpdateData)

    useEffect(() => {
        fetchMyStatus();
    }, []);

    useEffect(() => {
        const newStatuses = route.params?.newStstuses;

        if(newStatuses?.length) {
            setMyStatus( prev => [ ...newStatuses, 
 ...prev
            ])
        }
    }, [route.params?.newStatuses])

    const fetchMyStatus = async () => {
        try {
const res = await  fetch("http://10.0.2.2:3000/status");
const data = await res.json();

if(data.success && data.statuses?.length) {
    setMyStatus(prev => [...data.statuses, ...prev]);
}
        }catch(err) {
console.log("Sorry failed to fetch status from the backend", err)
        }
    }
    const renderItem = ({item}: any) => (
        <TouchableOpacity 
       onPress={() => {
        if(myStatus.length > 0) {
            navigation.navigate("StatusView", {
                avatar: myStatus[0].mediaUrl,
                username: "My Status"
            })
        }
       }}
        
        style={styles.statusItem}>
        <View style={[
            styles.avatarPort,
            {borderColor: item.hasNew ? "rgba(10, 157, 241, 1)": "#ccc"}
        ]}>
        <Image source={{uri: item.avatar
        }} 
         style={styles.avatar} />
        </View>
<View style={{flex: 1, flexDirection: "row", 
    alignItems: "center"
}}>
            <Text style={styles.username} numberOfLines={1}
            ellipsizeMode="tail">
        {item.username}</Text>
        <Text style={styles.statusTime}>Just now</Text>
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
<View style={{flex: 1 }}>

<View style={styles.statusRow}>
<View style={styles.avatarWrap} >
<TouchableOpacity onPress={() => {
    if(myStatus) {
        navigation.navigate("StatusView", {
            avatar: myStatus[0].mediaUrl,
            username: "MyStatus",
        });
    }
}}>
    <View style={[
        styles.avatarPort,  {
            borderColor: myStatus.length > 0 
            ? "rgba(10, 157, 241, 1)"
            : "transparent"
        },
    ]}>

 <Image
  source={{
    uri: myStatus.length > 0 && myStatus[0]?.mediaUrl
      ? myStatus[0].mediaUrl
      : "https://drive.google.com/uc?export=view&id=19XRQ062YGtJbptSiwgNXz4uuTARJBe-s"
  }}
  style={styles.avatar}
/>
    </View>
    </TouchableOpacity>


<TouchableOpacity style={styles.addIcon} onPress={() =>navigation.navigate("BuildStatus")}>
    <Icon name="add"  size={18} color="#fff" />
</TouchableOpacity >
</View>

<View>
    <Text style={{fontSize: 19, fontWeight: "600"}}>My Status</Text>
   
    <Text style={{color: "#777", marginTop: 2, fontSize: 16}}>Tap to add  to update status</Text>
</View>

</View>

<Text style={styles.newUpdate}>Recent Updates</Text>

<FlatList
data={UpdateData}
keyExtractor={(item) => item.id}
renderItem={renderItem}
showsVerticalScrollIndicator={true}
style={{flex: 1}}
contentContainerStyle={{paddingBottom: 15}}

/>

</View>
        </View>
    )
}
const styles = StyleSheet.create({
    port: {
        flex: 1,
        backgroundColor: "#fff"
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
        marginLeft: 14, marginBottom: 6, color: "#777", fontWeight: "600"
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