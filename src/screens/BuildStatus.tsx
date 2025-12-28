import React, {useEffect, useState} from "react";
 import { View, Image, FlatList, StyleSheet, TouchableOpacity, Platform, PermissionsAndroid } from "react-native";
 import Icon from "react-native-vector-icons/Ionicons";
 import { useNavigation } from "@react-navigation/native";
 import {CameraRoll}from "@react-native-camera-roll/camera-roll"
 import { launchCamera } from "react-native-image-picker";

export default function BuildStatus() {
    const navigation = useNavigation();
const[mediaItems, setMediaItems] = useState<any[]>([]);

useEffect(() => {
    loadGallery()
}, [])

const requestGalleryPermission = async() => {
    if(Platform.OS === "android") {
        const permission = Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        const granted = await PermissionsAndroid.request(permission);
        return granted === PermissionsAndroid.RESULTS.GRANTED
    }
    return true;
};

 const requestCameraPermission = async () => {
        if(Platform.OS === "android") {
            const granted  = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED
        }
        return true;
    }

const loadGallery =  async() => {
    const hasPermission = await requestGalleryPermission();
    if(!hasPermission) return;

   const photos = await CameraRoll.getPhotos({
    first: 50,
    assetType: "All"
   });
   const items = photos.edges.map(edge => edge.node.image)
   setMediaItems(items);
};

const openCamera =  async (isVideo = false) => {
const hasPermission = await requestCameraPermission();
if(!hasPermission) return;

const result = await launchCamera({
            mediaType: isVideo ? "video" : "photo",
            quality: 1
        });
            if(!result.didCancel && result.assets?.length) {
                navigation.navigate("Edit", {
                    medias: result.assets
                })
            }
}

   const openImageForEdit = (item: any) => {
    navigation.navigate("Edit", {
        medias: [item]
    })
   };

   const renderItem = ({item} : {item: any}) => (
    <TouchableOpacity onPress={() => openImageForEdit(item)}>
<Image source={{uri: item.uri}} style={styles.image}  />
    </TouchableOpacity>
   )
    return( 
<View style={styles.port}>
    <FlatList   
data={mediaItems}
keyExtractor={(item) => item.uri}
numColumns={3}
renderItem={renderItem}
    />
<View style={styles.camPos}>
    <TouchableOpacity style={styles.sideBut}>
        <Icon name="close" size={30} color="#fff" />
    </TouchableOpacity>

 <TouchableOpacity
    onPress={() => openCamera(false)}
    onLongPress={() => openCamera(true)}
    style={styles.camBut}
    >
<Icon name="camera" size={45} color="#000" />
    </TouchableOpacity>

    <TouchableOpacity  style={styles.sideBut}>
        <Icon name="camera-reverse-outline" size={35} color="#fff" />
    </TouchableOpacity>
    
</View>
   
</View>
    )
} 
const styles = StyleSheet.create({
    port: {
        flex: 1, backgroundColor: "#000", 
    },
    image: {
width: 200,
height: 200,
margin: 3
    },
    camBut: {
        width: 80, height: 80, borderRadius: 40, justifyContent: "center",
        alignItems: "center",  backgroundColor: "#ffff", elevation: 5, shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3, shadowRadius: 4, 
    }, camPos: {
        position: "absolute", bottom: 20, left: 0, right: 0, flexDirection: "row",
        justifyContent: "space-around", alignItems: "center", paddingHorizontal: 20
    },
    sideBut: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center", 
        backgroundColor: "rgba(0,0,0,0.6)",
    }

})