import React, {useState} from "react"
import { View, StyleSheet } from "react-native";
import Navbar from "../component/Navbar";
import BottomTab from "../navigator/BottomTab";

interface HomeProps {
    setIsAuthenticated: (value: boolean) => void
}
export default function Home ({setIsAuthenticated}: HomeProps) {
    const [activeTab, setActiveTab] = useState("Chats")
    const[search, setSearch] = useState("");

    return (
        <View style={styles.port}>
<Navbar    
activeTab={activeTab}
setActiveTab={setActiveTab}
setIsAuthenticated={setIsAuthenticated}
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