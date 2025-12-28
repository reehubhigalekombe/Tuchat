import React, {useState}from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Platform,
    TouchableOpacity, Image, Alert, useWindowDimensions} from "react-native";
 import Icon from "react-native-vector-icons/Ionicons";
 import { useNavigation, useRoute} from "@react-navigation/native";

export default function Edit() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const medias = route.params?.medias || [];
    const [uploading, setUploading] = useState(false);
    const CURRENT_USER_ID = "user_1234";
    const {width, height} = useWindowDimensions()

    if(medias.length === 0) {
        return (
            <View style={styles.port}>
<Text style={{color: "#000", }}>
    Hello! No Media selected
</Text>
            </View>
        )
    }

    const SERVER_URL = "http://10.0.2.2:3000";

    const postStatus = async () => {
        try {
setUploading(true);
const formData = new FormData();
medias.forEach((media: any) => {
    formData.append("media", {
        uri: Platform.OS === "android" ? media.uri :media.uri.replace("file://", ""),
        name: media.fileName || "status.jpg",
        type: media.type || "image/jpg"

    } as any);
})
formData.append("userId", CURRENT_USER_ID);
const res = await fetch(`${SERVER_URL}/status/upload-multiple`, {
    method: "POST",
    body: formData,
    headers: {
        "Accept": "application/json"
    }
}
);
const data = await res.json();
if(data.success) {
    navigation.navigate("Status", {
        newStatuses: data.mediaUrl.map((url:string) => ({
            mediaUrl: url,
            createdAt: new Date().toISOString()
        }))
    });
} else {
    throw new Error("Uploading failed");
    
} 
 
        }catch(err) {
            console.error("Sorry, Upload failed", err);
            Alert.alert("Error", "Status upload failed")
        }
        finally {
            setUploading(false)
        }
    }
    return(
<View style={styles.port}>
<FlatList   
data={medias}
keyExtractor={(_, i) => i.toString()
}
horizontal
pagingEnabled
renderItem={({item}) => (
    <Image source={{uri: item.uri}} style={[styles.statusPreview,  {width, height}]}  />
)}
/>
<View style={styles.actions}>
<TouchableOpacity onPress={() => navigation.goBack()}>
<Icon name="close" size={35} color="#fff"  />
</TouchableOpacity>

<TouchableOpacity
onPress={ postStatus
 }
 disabled={uploading}
 style={styles.postButton}>

  {uploading ? (
    <ActivityIndicator  color="red" />
  ) : (
  <Text style={{color: "#000", fontWeight: "500", fontSize: 18}}>
    Post
</Text>
  )
}
</TouchableOpacity>
</View>
</View>
    )
} 
const styles = StyleSheet.create({
    port: {
        flex: 1,
       backgroundColor: "#fff"
    },
    statusPreview: {
        resizeMode: "cover"
    },
    actions: {
        position: "absolute", bottom: 40, left: 20, right: 20, flexDirection: "row",
        justifyContent: "space-between", alignItems: "center"
    }, postButton: {
        backgroundColor:  "#fff", paddingHorizontal: 18,
        paddingVertical: 9,  borderRadius: 20
    }
})