import React from "react";
import { View, Text, StyleSheet} from "react-native";
import Icon  from "react-native-vector-icons/Ionicons";

export default function EmptyChat() {
    return (
     
<View style={styles.emptyPort}>
    <Icon name="chatbubble-ellipses-outline" size={140} color="green"/>
    <Text style={styles.text}>
     Chat With JAMBO!!
    </Text>
</View>


    )
}
const  styles = StyleSheet.create({
emptyPort: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
},
text: {
    fontSize: 30,
    color: "white",
    marginTop: 10,
    textAlign: "center",
    fontStyle: "italic", 
    fontWeight: "300"
}, 

})