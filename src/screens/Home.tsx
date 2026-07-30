import React, {useState} from "react"
import { View, StyleSheet } from "react-native";
import Navbar from "../component/Navbar";
import BottomTab from "../navigator/BottomTab";

export default function Home () {
    const [activeTab, setActiveTab] = useState("Chats")
    const[search, setSearch] = useState("");

    return (
        <View style={styles.port}>
<Navbar    
activeTab={activeTab}
setActiveTab={setActiveTab}
search={search}
setSearch={setSearch}

/>
<View style={{flex: 1}}>
    <BottomTab activeTab={activeTab} search={search}/>
</View>
        </View>
    )
}

const styles = StyleSheet.create({
    port: {
        flex: 1,
        backgroundColor: "#000"

    }
})