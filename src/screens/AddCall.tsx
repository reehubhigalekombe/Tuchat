import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation} from "@react-navigation/native";
import Icon  from "react-native-vector-icons/Ionicons";
import { contacts } from "../data/contacts";

type Contact = {
    id: string,
    name: string,
    avatar?: string,
    phoneNumber?: string,
}
export default function AddCall() {
    const navigation = useNavigation();
    const[search, setSearch] = useState("");
    const filteredContacts = contacts.filter((c) => 
    c.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
);

const handleContactSelect = (contact: Contact) => {
    navigation.navigate("Chats" as never, {
   user: {
            id: contact.id,
            name: contact.name,
            phoneNumber: contact.phoneNumber,
            avatar: null,
            messages: [],
        },
        isNewChat: true,
    } as never
);
};
    return (
<View style={styles.port}>
   
   <View style={styles.searchRow}>
     <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrow}>
<Icon name="arrow-back" size={22} color="#fff"/>
    </TouchableOpacity>
<TextInput
placeholder="Search Contacts....."
placeholderTextColor="rgba(255,255,255,0.7)"
value={search}
onChangeText={setSearch}
style={styles.searchBar}
clearButtonMode="while-editing"
/>
   </View>
<View style={styles.header}>
<Text style={styles.headTitle}>Select Contacts to Add</Text>
<Text style={styles.headSub}>
{filteredContacts.length} contacts{filteredContacts.length !==1 ? "s" : ""} found
</Text>
</View>
<FlatList  
data={filteredContacts}
keyExtractor={(item) => item.id}
renderItem={({item}) => (
    <TouchableOpacity style={styles.contacts}
    onPress={() => handleContactSelect(item)}>

<View style={styles.avatarPlace}>
<Text style={{fontSize: 15, color: "white", fontWeight: "bold"}}>{item.name.charAt(0)}</Text>
</View>
<View style={styles.contactInfo}>
<Text style={{fontSize: 15, color: "#666", marginTop: 3}}>{item.name}</Text>
{item.phoneNumber && (
    <Text style={{fontSize: 13, color: "#666", marginTop: 3}}>{item.phoneNumber}</Text>
)}
</View>
<Icon name="call-outline" size={24} color="#fff" />
    </TouchableOpacity>
)}
ListEmptyComponent={
    <View style={{alignItems: "center", justifyContent: "center", paddingHorizontal: 20, paddingVertical: 10}}>
      <Icon name="search-outline" size={24} color="gray" />  
      <Text style={{
        fontSize: 17, color: "#666", marginTop: 10, fontWeight: "400"
      }}>No Contact found from List</Text>
      <Text style={{   fontSize: 13, color: "#999", marginTop: 6, textAlign: 'center'}} >
        Kindly check you search terms
      </Text>
        </View>
}
/>

</View>
    )
}
const styles = StyleSheet.create({
    port: {
        flex: 1, 
        backgroundColor: "white"
    },
    searchBar: {
        flex: 1, fontSize: 19, color: "white", marginLeft:  5, paddingHorizontal: 10, paddingVertical: 8,
        borderRadius: 20, backgroundColor: "rgba(255,255,255,0.2)"
    },
    header: {
padding: 14, borderBottomWidth: 0.5, backgroundColor: "#f9f9f9",
borderBottomColor:  "#f0f0f0"
    }, 
    headTitle: {
fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 4
    },
    headSub: {
fontSize: 15, color: "#666"
    },
    contacts: {
        flexDirection: "row", alignItems: "center", borderBottomWidth: 0.5,
        borderBottomColor: "#ccc",
        padding: 15
    }, 
    contactName: {
        fontSize: 16,
color: "#333"
    },
    arrow: {
        marginRight: 10,
    },
    searchRow:{
        flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 10,
        backgroundColor: "#080808ff"
    },
    avatarPlace: {
        width: 50, height: 50, borderRadius: 20, justifyContent: "center",
        alignItems: "center", backgroundColor: "blue"
    },
    contactInfo: {
        flex: 1, marginLeft: 15
    }
})
