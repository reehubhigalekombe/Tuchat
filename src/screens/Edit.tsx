import React, {useState}from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Platform,
    TouchableOpacity, Image, Alert} from "react-native";
 import Icon from "react-native-vector-icons/Ionicons";
 import { useNavigation, useRoute} from "@react-navigation/native";

export default function Edit() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const medias = route.params?.medias || [];
    const [uploading, setUploading] = useState(false)

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

    const uploadStatus = async (media: any) => {
        const formData = new FormData();
        
         formData.append("media", {
            uri:  
            Platform.OS === "android"
            ? media.uri
            : media.uri.replace("file://", ""),
            name: media.fileName || "status.jpg",
            type: media.type || "image/jpg"
       
         } as any);

         formData.append("userId", "USER_ID_HERE");

         const res = await  fetch(`${SERVER_URL}/status/upload`, {
            method: "POST",
            body: formData
         })
const data = await res.json();
return data;
    }

    const postStatus = async () => {
        try {
            setUploading(true);
            const uploadedStatuses: any[] =[];
            for(const media of medias) {
                const formData = new FormData();
                formData.append("media", {
                    uri: Platform.OS === "android"
                    ? media.uri 
                    : media.uri.replace("file://", ""),
                    name: media.fileName || "status.jpg",
                    type: media.type || "image/jpg",
                } as any);
                formData.append("userId", "USER_ID_HERE");
                const res = await fetch(`$ERVER_URL/status/upload-multiple`, {
                    method: "POST",
                    body: formData
                });
                const data = await res.json();
                if(data?.success && data.mediaUrl) {
                    if(Array.isArray(data.mediaUrl)) {
                        data.mediaUrl.forEach((url: string) => {
                            uploadedStatuses.push({
                                mediaUrl: url,
                                createdAt: new Date().toISOString()
                            });
                        })
                    } else {
                        uploadedStatuses.push({
                            mediaUrl: data.mediaUrl,
                                createdAt: new Date().toISOString()
                        })
                    }
                }
            }
            
        if(uploadedStatuses.length === 0) {
            throw new Error ("Upload never succeeded")
        }
        navigation.navigate("Status", {
            newStatuses: uploadedStatuses
        });
        }catch(err) {
            console.error("failed to Upload status", err);
            Alert.alert("Error", "Status upload failed")
        } finally {
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
showsHorizontalScrollIndicator={false}
renderItem={({item}) => (
    <Image source={{uri: item.uri}} style={styles.statusPreview}  />
)}
/>


<View style={styles.actions}>
<TouchableOpacity onPress={() => navigation.goBack()}>
<Icon name="close" size={28} color="#fff"  />
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
       backgroundColor: "#000"
    },
    statusPreview: {
        flex: 1, resizeMode: "contain"
    },
    actions: {
        position: "absolute", bottom: 40, left: 20, right: 20, flexDirection: "row",
        justifyContent: "space-between", alignItems: "center"
    }, postButton: {
        backgroundColor:  "#fff", paddingHorizontal: 18,
        paddingVertical: 9,  borderRadius: 20
    }
})