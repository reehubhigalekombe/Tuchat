import React, {useState}from "react";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, Text } from "react-native";
import axios from "axios";

const BASE_URLL = "http://10.0.2.2:3000";

export default function SignUp() {
    const navigation = useNavigation();
    const [name, setName] = useState("");
    const [handle, setHandle] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = async () => {
        if(!name || !handle || !password) return Alert.alert(" All fields are required to be filled");
        try {
            const res = await axios.post(`${BASE_URLL}/auth/register`, {name, handle, password});
            Alert.alert(`Woow, user account has been created, ${res.data.user.handle}`);
            navigation.navigate("Login");
        }catch (err: any) {
            console.error(err)
            Alert.alert("Error", err.response?.data?.message || "Sorry failed to register" )
        }

    }
    return(
<View style={styles.port}>
<TextInput placeholder="Name" value={name}  onChangeText={setName} style={styles.input} />
<TextInput placeholder="TuChat handle i.e @higal" value={handle}  onChangeText={setHandle}  style={styles.input}  />
<TextInput placeholder="Password" secureTextEntry value={password}  onChangeText={setPassword}  style={styles.input}  />
<TouchableOpacity onPress={handleSignUp}>
    <Text>Sign Up</Text>
</TouchableOpacity>

<Text style={{marginTop: 10 }}onPress={() =>navigation.navigate("Login") }>
    Already have an Account? Login

</Text>
</View>

    )
}
const styles = StyleSheet.create({
    port: {
flex: 1, justifyContent: "center", padding: 20
    },
    input: {
borderWidth: 1, marginBottom: 10, padding: 6
    }
})