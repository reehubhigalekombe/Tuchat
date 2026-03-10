import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons"
export default function BottomScreen() {
    const navigation = useNavigation()
    return (
<View style={styles.port}>
<TouchableOpacity
style={styles.items}
onPress={() => navigation.navigate("Chats" as never)}>
    <Icon name="chatbubble-ellipses-outline" size={26} color="#fff"/>
    <Text style={styles.text}>Chats</Text>
</TouchableOpacity>

<TouchableOpacity
style={styles.items}
onPress={() => navigation.navigate("Chats" as never)}>
    <Icon name="radio-button-off-outline" size={26} color="#fff"/>
    <Text style={styles.text}>Uploads</Text>
</TouchableOpacity>

<TouchableOpacity
style={styles.items}
onPress={() => navigation.navigate("Chats" as never)}>
    <Icon name="people-circle-outline" size={26} color="#fff"/>
    <Text style={styles.text}>Groups</Text>
</TouchableOpacity>

<TouchableOpacity
style={styles.items}
onPress={() => navigation.navigate("Chats" as never)}>
    <Icon name="videocam-outline" size={26} color="#fff"/>
    <Text style={styles.text}>Live</Text>
</TouchableOpacity>

<TouchableOpacity
style={styles.items}
onPress={() => navigation.navigate("Chats" as never)}>
    <Icon name="cog-outline" size={26} color="#fff"/>
    <Text style={styles.text}>Menu</Text>
</TouchableOpacity>
</View>
    )
}
const styles = StyleSheet.create({
    port: {
        position: "absolute", bottom: 20, right: 20, left: 20, flexDirection: "row",
        justifyContent: "space-around", alignItems: "center", borderRadius: 30, paddingVertical: 12,
        elevation: 10, backgroundColor: "#1f1f1f",

    },
     items: {
        alignItems: "center"
     },
     text: {
        color: "rgba(10,157,241,1)", fontSize: 15, marginTop: 2
     }
    
})