import React from "react";
 import { View, Text, StyleSheet, TouchableOpacity, Platform, PermissionsAndroid } from "react-native";
 import Icon from "react-native-vector-icons/Ionicons";
 import { useNavigation } from "@react-navigation/native";
 import { launchCamera, launchImageLibrary } from "react-native-image-picker";

export default function BuildStatus() {
    const navigation = useNavigation();

    const requestCameraPermission = async () => {
        if(Platform.OS === "android") {
            const granted  = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED
        }
        return true
    }
    const openCamera = async () => {
        const hasPermission = await requestCameraPermission();
        if(!hasPermission) return
        const result = await launchCamera({
            mediaType: "photo",
            quality: 1
        });
        if(!result.didCancel && result.assets?.length) {
            navigation.navigate("Edit", {medias: [result.assets[0]]})
        }
    };

    const openGallery = async () =>{
        const result = await launchImageLibrary({
            mediaType: "photo",
            selectionLimit: 0,
        });

        if(!result.didCancel && result.assets?.length) {
            navigation.navigate("Edit",  {medias: [result.assets[0]]})
        }
    };
    return( 
<View style={styles.port}>
   <TouchableOpacity style={styles.cameraOpen} onPress={openCamera}>
<Icon name="camera" size={35} color="#fff"  />
<Text style={{color: "#fff", marginTop: 10, fontSize: 14}}>Camera</Text>
   </TouchableOpacity>

    <TouchableOpacity style={{alignItems: "center"}} onPress={openGallery}>
<Icon name="images" size={35} color="#fff"  />
<Text style={{color: "#fff", marginTop: 10, fontSize: 14}}>Gallery</Text>
   </TouchableOpacity>
</View>
    )
} 
const styles = StyleSheet.create({
    port: {
        flex: 1, backgroundColor: "#000", justifyContent: "center"
    },
    cameraOpen: {
        alignItems: "center", marginBottom: 30
    }

})