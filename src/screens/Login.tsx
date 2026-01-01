import React, {useState} from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { View,Image, StyleSheet,  Platform, KeyboardAvoidingView, ActivityIndicator,
    TextInput, TouchableOpacity, Alert, Text } from "react-native";

const BASE_URLL = "http://10.0.2.2:3000";

interface LoginProps {
    setIsAuthenticated: (value: boolean) => void
}
export default function  Login({setIsAuthenticated}: LoginProps) {
    const navigation = useNavigation()
    const [handle, setHandle] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

     const handleLogin = async () => {
        if(!handle || !password) return Alert.alert(" All fields are required to be filled");
        try {
            setLoading(true)
            const res = await axios.post(`${BASE_URLL}/auth/login`, { handle, password});
            Alert.alert(`Woow, Login Sucess, ${res.data.user.handle}`);

            setIsAuthenticated(true)

        }catch (err: any) {
            console.error(err)
            Alert.alert("Error", err.response?.data?.message || "Sorry failed to Login" )
        } finally {

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


    <View  style={styles.port}>
<TextInput 
placeholderTextColor="#666"
placeholder="TuChat handle i.e @higal" value={handle}  onChangeText={setHandle}  style={styles.input}  />
<TextInput 
placeholderTextColor="#666"
placeholder="Password" secureTextEntry value={password}  onChangeText={setPassword}  style={styles.input}  />

<TouchableOpacity onPress={handleLogin} 
style={[ styles.but,  (!handle || !password ) && {opacity: 0.6}
]}
disabled={!handle || !password || loading}>
    {loading ?  (     <ActivityIndicator color="#fff" />
    ) : (
    <Text style={styles.log}>Login</Text>
    )}
</TouchableOpacity>
<Text style={{textAlign: "center", fontSize: 18, marginTop: 10, color: "#aaa"}}>
        Don't' have an Account?{""}     
</Text>
<Text style={{ color: "#0A9DF1", fontSize: 25, }}onPress={() =>navigation.navigate("SignUp") }>
Sign In
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
    title: {fontSize: 30,
        color: "#0A9DF1", textAlign: "center", fontWeight:  "600", marginBottom: 10

    }, 
    input: {
borderWidth: 1, fontSize: 16, color: "#fff",
 marginBottom: 10, padding: 6, borderColor: "#222", borderRadius: 10, 
 paddingVertical: 10, paddingHorizontal: 12,   backgroundColor: "#000"
    },
    log: {
        fontSize: 20, fontWeight:  "600",
        color: "#fff", 
    },
    but: {
        alignItems: "center",
        backgroundColor: "#0A9DF1",
        marginTop: 6, 
        borderRadius: 8, 
         paddingVertical: 10,       
    }, 
    avatar: { width: 90, height: 90, borderRadius: 45, alignSelf: "center", marginBottom: 10,
        

    }
})