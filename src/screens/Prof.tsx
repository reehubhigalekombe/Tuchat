import React, { useState } from "react";
import { View, Text, Image, Alert, StyleSheet,  TouchableOpacity} from "react-native";
import axios from "axios";
import { launchImageLibrary } from "react-native-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";

const BASE_URL = "https://tuback-8pr0.onrender.com";
export default function Prof() {
    const navigation = useNavigation();
    const route = useRoute();

    const {userId} = route.params as {userId: string};
    const[avatar, setAvatar] = useState<string | null>(null);
    const[loading, setLoading]= useState(false);

    const pickImage = async () => {
        const results = await launchImageLibrary({
            mediaType: "photo",
            quality: 0.7
        });
        if(results.assets &&  results.assets.length > 0) {
            setAvatar(results.assets[0].uri || null);
        }
    };

    const uploadAvatar = async () => {
        if(!avatar) return Alert.alert("Please select and image");
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("avatar", {
                uri: avatar.startsWith("file://") ? avatar : "file://" + avatar,
                type: "image/jpeg",
                name: "avatar.jpg",
            }as any );
            formData.append("userId", userId);
const res =  await axios.post(`${BASE_URL}/upload/avatar`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Alert.alert("Woow", "You've updated the profile pic");
            console.log("Updated the user:", res.data.user)
            navigation.navigate("Login")

        } catch(err) {
            console.log(err);
            Alert.alert("Error", "Failed to upload avatar")
        } finally {
            setLoading(false)
        }
    }

    return (
<View style={styles.port}>
<Text style={styles.head}>Set Your Profile  Pic!!</Text>

<TouchableOpacity onPress={pickImage}>
<Image source={{uri:  avatar || "https://ui-avatars.com/api/?name=User",}} 
style={styles.ava} />
</TouchableOpacity>

<TouchableOpacity onPress={uploadAvatar} style={styles.but}>
    <Text style={{color: "#fff"}}>
        {loading ? "Saving...." : "Continue"}
    </Text>
</TouchableOpacity>
</View>
    )
}

const styles = StyleSheet.create({
    port: {
        flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center",
    },
    head: {
        color: "#fff", fontSize: 18, marginBottom: 15
    },
    ava: {
        width: 120, height: 120, borderRadius: 60 , marginBottom:15
    }, 
    but: { backgroundColor: "#0A9DF1", padding:10, borderRadius: 8

    }

})