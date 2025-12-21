import React from "react";
  import { View, Text, StyleSheet, TouchableOpacity, Image, Alert} from "react-native";
 import Icon from "react-native-vector-icons/Ionicons";
 import { useNavigation, useRoute} from "@react-navigation/native";
export default function Edit() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const medias = route.params?.medias || [];
    if(medias.length === 0) {
        return (
            <View style={styles.port}>
<Text style={{color: "#000", }}>
    Hello! No Media selected
</Text>
            </View>
        )
    }

    const SERVER_URL = "http://10.0.2.2:3000"

    const uploadStatus = async (media) => {
        const formData = new FormData();
        
         formData.append("media", {
            uri: media.uri,
            name: media.fileName || "Status.jpg",
            type: media.type
         });
         formData.append("userId", "USER_ID_HERE");

         const res = await  fetch(`${SERVER_URL}/status/upload`, {
            method: "POST",
            body: formData,
         })
const data = await res.json();
return data;
    }

    const postStatus = async () => {
        try {
            for(const media of medias) {
           await uploadStatus(media);
            }
            Alert.alert("Your Status Upload Sucess")
            navigation.navigate("Status");

        } catch(err) {
            console.log("Upload has failed", err)
                        Alert.alert("Error", "Status Upload failed")

        } 
    };
    return(
<View style={styles.port}>
{medias.length > 0 && (
    <Image source={{uri: medias[0].uri}}style={styles.statusPreview}  />
)}

<View style={styles.actions}>
<TouchableOpacity onPress={() => navigation.goBack()}>
<Icon name="close" size={28} color="#fff"  />
</TouchableOpacity>

<TouchableOpacity onPress={() => postStatus() } style={styles.postButton}>
    <Text style={{color: "#000", fontWeight: "500", fontSize: 18}}>
    Post
</Text>
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