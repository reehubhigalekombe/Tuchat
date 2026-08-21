import React, { useState, useContext } from"react";
import { useNavigation } from "@react-navigation/native";
import { View, Image, ActivityIndicator,  Modal, TouchableOpacity, Text, ScrollView, StyleSheet, Alert,
    TouchableWithoutFeedback
} from "react-native";
import Icon  from "react-native-vector-icons/Ionicons";
import { launchImageLibrary, launchCamera, Asset} from "react-native-image-picker";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://tuback-8pr0.onrender.com";

export default function OwnerProfile() {
    const navigation = useNavigation()
    const[loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [pickerVisible, setPickerVisible] = useState(false)
    const userContext = useContext(UserContext);
    if(!userContext){
        throw new Error("UserContext is not defined")
    }
    const {currentUser, setCurrentUser} = userContext
    const uploadAvatar = async (asset: Asset) => {
        if(!asset.uri) {
            Alert.alert("Error", "Sorry could not find the selected image")
            return;
        }
if(!currentUser?.id) {
    Alert.alert("Error", "Sorry user informationi s missing")
    return;
}

try {
    setLoading(true);
    const formData = new FormData();
    formData.append("avatar", {
        uri: asset.uri,
        type: asset.type || "image/jpeg",
        name: asset.fileName || `avatar.${asset.type?.split("/")[1] || "jpg"}`,
    } as any)

formData.append("userId", currentUser.id);
console.log("Uploading the User Avartar", currentUser.id);
const response = await axios.post(`${BASE_URL}/media/upload/avatar`,
    formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }
);
console.log("Avatar response upload:", JSON.stringify(response.data, null, 2));
const updatedUser = response.data.user;
if(!updatedUser?.avatar) {
    throw new Error("The avatar URL did not return from the server")
}
 setCurrentUser((prev) => {
    if(!prev) return prev;

    return {
        ...prev, 
        avatar: updatedUser.avatar,
    };
 });
 const storedUser = await  AsyncStorage.getItem("currentUser");
 if(storedUser) {
    const parsedUser = JSON.parse(storedUser);
    const updatedStoredUser = {
        ...parsedUser, avatar: updatedUser.avatar,
    };
    await AsyncStorage.setItem("currentUser",
         JSON.stringify(updatedStoredUser)
    );
 }
 Alert.alert(" Success", "Your Profile photo uploaded.");

}catch(error: any) {
    console.log("Avatar upload failed");
    if(error.response) {
        console.log("Status:", error.response.status);
                console.log("Data:", error.response.data);
    } else {
        console.log("Error", error.message)
    }
    Alert.alert("Error", "Failed to update your profile photo");
} finally {
    setLoading(false)
}
    };

const handleChangeAvatar = async() => {
    const response = await launchImageLibrary({
        mediaType: "photo",
        quality: 0.8,
        maxWidth: 500,
        maxHeight: 500, includeBase64: false
    });
    if(response.didCancel) {
        return;
    }

    if(response.errorMessage) {
        Alert.alert("Error", response.errorMessage);
        return;
    }

    const asset = response.assets?.[0];
    if(!asset) {
        return
    }
    await uploadAvatar(asset);
};
    const handleTakePhoto = async () => {
      const response = await launchCamera({
            mediaType: "photo",
            quality: 0.8,
            maxWidth: 500,
            maxHeight: 500, 
            includeBase64: false,
            cameraType: "front",
            saveToPhotos: true
            });
             if(response.didCancel) return;
                if(response.errorMessage) {
                    Alert.alert("Error", response.errorMessage);
                    return
                }
                const asset = response.assets?.[0];
                if(!asset) {
                    return
                }
                await uploadAvatar(asset)
    }
    return(

<ScrollView style={styles.mainContainer}>
<View style={styles.picContainer}>
<TouchableOpacity onPress={() => navigation.goBack()}
    style={{left: 10, position: "absolute"}} >
    <Icon  name="chevron-back" size={24} color= "rgba(10,157,241,1)"/>
</TouchableOpacity>
 <Text style={styles.title}> Profile</Text>
</View>

<View style={styles.profPort}>
    <TouchableOpacity onPress={() => setModalVisible(true)} >
        <Image source={{uri: currentUser?.avatar ||  "https://ui-avatars.com/api/?name=User",}} style={styles.avatar}  />
    </TouchableOpacity>

<TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.edit} activeOpacity={0.7}>
        <Icon  name="camera-outline" size={24} color="white" />
</TouchableOpacity>
</View>


<View style={styles.profData}>
    <Text  style={{color: 'black', fontSize: 22}}>{currentUser?.name || "User"} </Text>
    <Text style={{color: 'blue', fontSize: 16}}> Online</Text>
</View>

 <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)} >
            <TouchableWithoutFeedback
                onPress={() => setModalVisible(false)}>
                <View style={styles.modalPort}>
                    <Image
                        source={{uri:currentUser?.avatar ||"https://ui-avatars.com/api/?name=User" ,}} style={styles.modalImage} />
                    <TouchableOpacity style={styles.closeButton}
                        onPress={() => setModalVisible(false)} >
                        <Icon name="close" size={30} color="black"  />
                    </TouchableOpacity>
                </View>

            </TouchableWithoutFeedback>

        </Modal>
        
         <Modal
            visible={pickerVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setPickerVisible(false)}>
            <TouchableWithoutFeedback
                onPress={() => setPickerVisible(false)}>

                <View style={styles.pickerFloat}>
                    <TouchableWithoutFeedback>
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerTitle}>Change Profile Photo </Text>

                            <TouchableOpacity
                                style={styles.pickOption}
                                onPress={() => {
                                    setPickerVisible(false);
                                    handleTakePhoto();
                                }}  >
                                <Icon  name="camera-outline" size={24} color="#0A9DF1" />
                                <Text style={styles.pickText}> Take a Photo </Text>

                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.pickOption}
                                onPress={() => {
                                    setPickerVisible(false);
                                    handleChangeAvatar();   }} >
                                <Icon  name="images-outline"  size={24}  color="#0A9DF1" />
                                <Text style={styles.pickText}>
                                    Choose from the gallery
                                </Text>

                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cancelOption}
                                onPress={() =>
                                    setPickerVisible(false)}  >

                                <Text style={styles.cancelText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
{
    loading && (
        <View style={styles.loading}>
            <ActivityIndicator size={40} color="#0A9DF1" />
            <Text>Updating the Profile Photo</Text>
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
pickerFloat: {
justifyContent: "flex-end", flex: 1, backgroundColor: "rgba(0,0,0,0.95)"
},
pickerContainer: {
backgroundColor: "#ffffff", padding: 25, paddingBottom: 20, borderTopLeftRadius: 25, borderTopRightRadius: 25
},
pickerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#cc3a3a"

},
pickOption: {
flexDirection: "row", alignItems: "center",  paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#eee"
}, 
pickText: {
color: "#333", fontSize: 15, marginLeft: 15
}, 
cancelText: {
fontSize: 15, fontWeight: "500", color: "#0A9DF1",
},
cancelOption: {
paddingVertical: 14, marginTop: 14, alignItems: "center", backgroundColor: "#f2f2f2", borderRadius: 8
},
title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
},

closeBut:{
    position: 'absolute', top: 40, right: 20, zIndex: 10
},
modalImage: {
    width: "100%",
    height: "100%",
   
},
loading: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    bottom: 0,
    left: 0,
    right: 0,

},
modalPort: {
flex:1 ,
justifyContent: "center",
alignItems: "center"
},
closeButton: {
    zIndex: 10,
    right: 20,
    top: 40
}
})