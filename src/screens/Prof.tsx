import React, { useState } from "react";
import { View, Text, Image, Alert, StyleSheet,  TouchableOpacity} from "react-native";
import axios from "axios";
import { Asset, launchImageLibrary } from "react-native-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthStackParamList } from "../navigator/AuthNavigator";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type ProfRouteProp = RouteProp<AuthStackParamList, "Prof">;
type ProfNavigationProp = NativeStackNavigationProp<AuthStackParamList, Prof>
const BASE_URL = "https://tuback-8pr0.onrender.com";
export default function Prof() {
    const navigation = useNavigation<ProfNavigationProp>();
    const route = useRoute<ProfRouteProp>();

    const {userId} = route.params 
    const[avatar, setAvatar] = useState<Asset | null>(null);
    const[loading, setLoading]= useState(false);

    const pickImage = async () => {
        const results = await launchImageLibrary({
            mediaType: "photo",
            quality: 0.7
        });
        if(results.assets?.length) {
            setAvatar(results.assets[0]);
        }
    };

    const uploadAvatar = async () => {
        if(!avatar) return Alert.alert("Please select and image");
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("avatar", {
                uri: avatar.uri,
                type: avatar.type,
                name: avatar.fileName || `avatar.${avatar.type?.split("/")[1] || "jpg"}`,
            }as any );
            formData.append("userId", userId);
const res =  await axios.post(`${BASE_URL}/media/upload/avatar`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Alert.alert("Woow", "You've updated the profile pic");
            console.log("Updated the user:", res.data.user)
            navigation.navigate("Login")

        } catch(err: any) {
            console.log("UPLOAD NOT SUCCESS");
            if (err.response) {
                console.log(err.response.status)
                console.log(err.response.data)
            }
            else {
                console.log(err.message)
            }
        Alert.alert("Error", "Failed to uplaod Avatar")
        } finally {
            setLoading(false)
        }
    }

    return (
<View style={styles.port}>
<Text style={styles.head}>Set Your Profile  Pic!!</Text>

<TouchableOpacity onPress={pickImage}>
<Image source={{uri:  avatar?.uri || "https://ui-avatars.com/api/?name=User",}} 
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