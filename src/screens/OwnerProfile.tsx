import React, { useState } from"react";
import { TouchableWithoutFeedback } from "react-native";
import { useNavigation} from "@react-navigation/native";
import { View, Image, ActivityIndicator,  Modal, TouchableOpacity, Text, ScrollView, StyleSheet, Alert} from "react-native";
import Icon  from "react-native-vector-icons/Ionicons";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";

export default function OwnerProfile() {
    const navigation = useNavigation()
    const[avatar, setAvatar] = useState("https://randomuser.me/api/portraits/women/1.jpg")
    const[modalVisible, setModalVisible] = useState(false);
    const[loading, setLoading] = useState(false);

const showImagePickerOptions = () => {
    Alert.alert(
        "Change Profile Pic",
        "Choose from Options",
        [
            {
                text: "Take a Photo",
                onPress: () => handleTakePhoto(),
            },
            {
                text: "Choose from Gallery",
                onPress: () => handleChangeAvatar(),
            },
            {
                text: "Cancel",
                style: "cancel"
            }
        ]
    )
}
const handleChangeAvatar = () => {
    launchImageLibrary(
        {mediaType: "photo",
            quality: 0.8,
            maxWidth: 500,
            maxHeight: 500, 
            includeBase64: false
        },
        async (response) => {
            if(response.didCancel) return;
            if(response.errorMessage) {
                Alert.alert("Error", response.errorMessage);
                return
            }
            const uri = response.assets?.[0]?.uri;
            if(!uri) return;
            setLoading(true)
            try{
                await new Promise((resolve) => setTimeout(resolve, 2000));
                setAvatar(uri)
                Alert.alert("Profile Pic upload Successs")

            }catch(err) {
                Alert.alert("Error", "Failed to upload the Profile Pic")
            } finally{
                setLoading(false)
            }
        }
    )
}
    const handleTakePhoto = () => {
        launchCamera(
            {
                mediaType: "photo",
                quality: 0.8,
            maxWidth: 500,
            maxHeight: 500, 
            includeBase64: false,
            cameraType: "front",
            saveToPhotos: true
            },
            async(response) => {
                if(response.didCancel) return;
                if(response.errorMessage) {
                    Alert.alert("Error", response.errorMessage);
                    return
                }
                const uri = response.assets?.[0].uri;
                if(!uri) return;
                setLoading(true)
                try{
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    setAvatar(uri);
                    Alert.alert("Woow, Profile pic updated Sucess")

                }catch(err) {
                    Alert.alert("Error", "Failed to take Pic");
                } finally {
                    setLoading(false)
                }
            }
        )
    }
    return(

<ScrollView style={styles.mainContainer}>
<View style={styles.picContainer}>
<TouchableOpacity
   
    style={{left: 10, position: "absolute"}} >
    <Icon  name="chevron-back" size={24} color="green" />
</TouchableOpacity>
 <Text style={styles.title}> Profile</Text>
</View>

<View style={styles.profPort}>
    <TouchableOpacity onPress={() => setModalVisible(true)} >
        <Image source={{uri: avatar}} style={styles.avatar}  />
    </TouchableOpacity>

<TouchableOpacity onPress={showImagePickerOptions} style={styles.edit}>
        <Icon  name="camera-outline" size={24} color="white" />
</TouchableOpacity>
</View>


<View style={styles.profData}>
    <Text  style={{color: 'black', fontSize: 22}}>Higal Ekombe </Text>
    <Text style={{color: 'blue', fontSize: 16}}> Online</Text>
</View>

<Modal visible={modalVisible} transparent animationType="fade"  >
 <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
       <View style={styles.modalPort}>
<Image source={{uri: avatar}} style={styles.modalImage} />
<TouchableOpacity onPress={() => setModalVisible(false)}>
       <Icon  name="close" size={24} color="white" />
</TouchableOpacity>
    </View>
 </TouchableWithoutFeedback>

</Modal >

{
    loading && (
        <View style={styles.loading}>
            <ActivityIndicator size="large" color="green" />
        </View>
    )
}

</ScrollView>
    )
}
const styles = StyleSheet.create({
mainContainer: {
    flex: 1, backgroundColor: "white"
},
picContainer: {
    flexDirection: "row", alignItems: "center", justifyContent: 'center', paddingVertical: 8, position: "relative"
},
profPort: {
    position: "relative", marginVertical: 15, alignItems: "center", marginBottom: 2
},
profData: {
flexDirection: "column", justifyContent: 'center', alignItems: "center"
},
avatar: {
    width: 120, height: 120, borderRadius: 60, borderColor: "#e0dbdbff"
},
edit: {
    position: "absolute", right: 135, backgroundColor: "#666", borderRadius: 17, bottom: 10, padding: 5
},
modalPort: {
justifyContent: "center", alignItems: 'center', flex: 1, backgroundColor: "rgba(0,0,0,0.95)"
},
title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
}, closeBut:{
    position: 'absolute', top: 40, right: 20, zIndex: 10
},
modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 10,
    

},
loading: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    bottom: 0,
    left: 0,
    right: 0,

}
})