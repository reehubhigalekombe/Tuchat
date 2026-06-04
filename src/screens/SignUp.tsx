import React, {useState}from "react";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, Image,
    Alert, Text } from "react-native";
import axios from "axios";

const BASE_URLL = "https://tuback-8pr0.onrender.com";

export default function SignUp() {
    const navigation = useNavigation();
    const [name, setName] = useState("");
    const [handle, setHandle] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("")

    const handleSignUp = async () => {
        if(!name || !handle || !phone || !password) return Alert.alert(" All fields are required to be filled");
        try {
            const res = await axios.post(`${BASE_URLL}/auth/register`, {name, handle, phone,  password});
            Alert.alert(`Woow, user account has been created, ${res.data.user.handle}`);
            navigation.navigate("Prof", {
                userId: res.data.user._id
            });
        }catch (err: any) {
            console.error(err)
            Alert.alert("Error", err.response?.data?.message || "Sorry failed to register" )
        }

    }
    return(
<KeyboardAvoidingView  
style={styles.viewPort}
behavior={Platform.OS === "ios" ? "padding" : undefined}
>
    <Image 
    source={{uri: "https://drive.google.com/uc?export=view&id=1AgQd8Qgku8gXG8iyoFZgSkBNCGgMDaKX"}} style={styles.avatar}
    />
<View style={styles.port}>
<TextInput placeholder="Name" value={name} 
placeholderTextColor="#666"
 onChangeText={setName} style={styles.input} />
<TextInput placeholder="TuChat handle i.e @higal" 
placeholderTextColor="#666"
value={handle}  onChangeText={setHandle}  style={styles.input}  />

<TextInput
placeholder="+254742106109"
placeholderTextColor="#666"
value={phone}
onChangeText={setPhone}
keyboardType="phone-pad"
style={styles.input}
   />

<TextInput placeholder="Password"
placeholderTextColor="#666"
 secureTextEntry value={password}  onChangeText={setPassword}  style={styles.input}  />
<TouchableOpacity onPress={handleSignUp}>
    <Text style={{ color: "#0A9DF1", fontSize: 25, }}>Sign Up</Text>
</TouchableOpacity>

<Text style={{textAlign: "center", fontSize: 18, marginTop: 10, color: "#aaa"}}>
    Already have an Account?  {""}
    <Text  style={{color: "#0A9DF1", fontWeight: "bold", fontSize: 25, }}
    onPress={() => navigation.navigate("Login")}>
        Login
    </Text>

</Text>
</View>

</KeyboardAvoidingView>
        

    )
}
const styles = StyleSheet.create({
        viewPort: {
flex: 1, backgroundColor: "#000", justifyContent: "center", padding: 20,
    },
    port: {
borderRadius: 12, padding: 30, backgroundColor: "#111"
    },
    input: {
borderWidth: 1, fontSize: 16, color: "#fff",
 marginBottom: 10, padding: 6, borderColor: "#222", borderRadius: 10, 
 paddingVertical: 10, paddingHorizontal: 12,   backgroundColor: "#000"
    },
    avatar: { width: 90, height: 90, borderRadius: 45, alignSelf: "center", marginBottom: 15,
    }
})