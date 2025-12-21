import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";


export default function  ZoomImage() {
    const navigation = useNavigation();
    const route = useRoute();
    const {image} = route.params
    return(
<View style={styles.zoom}>
    <TouchableOpacity style={styles.drop} onPress={() => navigation.goBack()}>
<Image
source={{uri: image}} style={styles.fullImage}
/>
    </TouchableOpacity>
</View>
    )
}
const styles = StyleSheet.create({
    zoom: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
    },
    fullImage: {
        width: "100%",
        height: "100%",
        resizeMode: "contain"
    },
    drop: {
        flex: 1,
        width: "100%"
    }
})