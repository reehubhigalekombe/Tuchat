import React from "react";
import { View, StyleSheet } from "react-native";
import EmojiPicker from "rn-emoji-keyboard"

type Props = {
    visible: boolean;
    onSelect: (emoji: string) => void;
    onClose: () => void
}
export default function Emoji({visible, onClose, onSelect}: Props) {
    return (
<View style={styles.port}>
    <EmojiPicker  
    open={visible} 
    onClose={onClose}
    onEmojiSelected={(emoji) => onSelect(emoji.emoji)}
    theme={{
        backdrop: "#00000055",
        knob: "#666"
    }}
    enableSearch
    enableCategoryChange
    />
</View>
    )
}
const styles = StyleSheet.create({
    port: {
        position: "absolute",
        left: 0, right: 0,
        zIndex: 999,
        bottom: 0
    }
})