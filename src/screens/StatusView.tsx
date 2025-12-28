import React, {useEffect, useRef, useState} from "react";
import { View, Text, StyleSheet, Image, Animated, TouchableOpacity, PanResponder} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Slider from "@react-native-community/slider"
import { useNavigation } from "@react-navigation/native";
import MessageInput from "../component/MessageInput";
import EmojiSlector from 'react-native-emoji-selector'

export default function  StatusView({route}: any) {
    const navigation = useNavigation();

    const {users, startIndex} = route.params;
    const[userIndex, setUserIndex] = useState(startIndex);
    const[currentIndex, setCurrentIndex] = useState(0);
    const currentUser = users[userIndex];
    const statuses = currentUser.statuses

    const [volume, setVolume] = useState(1);
    const[showVolumeSlider, setShowVolumeSlider] = useState(false)
    const progress  = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current
    const [isPaused, setIsPaused] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const animationRef = useRef<Animated.CompositeAnimation | null > (null);
    
    const DURATION = 7000;
    const SWIPE_THRESHOLD = 120
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (__, gesture) => {
                const {dx, dy} = gesture;

                return Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10;
            },
            onPanResponderGrant: () => {
                animationRef.current?.stop()
            },

            onPanResponderMove: Animated.event(
                [null, {dy: translateY}],
                {useNativeDriver: false}
            ),

            onPanResponderRelease: (_, gesture) => {
                const{dy} = gesture;

                if(Math.abs(dy) > SWIPE_THRESHOLD) {
                    navigation.goBack();

                }else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: false,
                    }).start(() => {
                        if(!isPaused) {
                            progress.stopAnimation((value: number) => {
                                startAnimation(value)
                            });
                        }
                    });
                }
            },
        })
    ).current

    const progressWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"]
    });

    const startAnimation = (fromValue = 0) => {
        animationRef.current = Animated.timing(progress, {
            toValue: 1,
            duration: DURATION * (1 - fromValue),
            useNativeDriver: false
        });

        animationRef.current.start(({finished}) => {
            if(finished) goNext()
        });
    };

    useEffect(() => {
        progress.setValue(0)
        startAnimation()
    }, [currentIndex, userIndex]);

    const togglePause = () => {
        if(isPaused) {
            progress.stopAnimation((value: number) => {
                startAnimation(value)
            });
          
        } else{
animationRef.current?.stop();
        }
        setIsPaused(!isPaused)
    }
const goNext = () => {
     if(currentIndex < statuses.length - 1) {
        progress.setValue(0);
        setCurrentIndex(i => i +1);
     }else {
        if(userIndex < users.length - 1) {
            setUserIndex(i => i + 1);
            setCurrentIndex(0);
            progress.setValue(0)
        }else {
            navigation.goBack()
        }
     }
}

const goPrev = () => {
    if(currentIndex > 0) {
        progress.setValue(0);
        setCurrentIndex(i => i - 1)
    }
};

useEffect(() =>{
if(!statuses[currentIndex]) return;
statuses[currentIndex] = {
    ...statuses[currentIndex],
    seen: true
}
}, [currentIndex]);

    const handleVolumeChange = (value: number) => {
        setVolume(value)
    }
    const handleSendMessage = (message: string) => {
        console.log("YEs! Message has been send fro the viewe status")
    }

    const handleToggleEmoji = () => {
        console.log("Great! Emoji has been toggled")
    };
    
    const handleUploadFile = (file: any) => {
        console.log("Your file has been uploaded for the viewed status:", file)
    }
    return (
        
<Animated.View style={[
    styles.mainPort, 
    {transform: [{translateY}]}
]}
    {...panResponder.panHandlers} >

    <View style={styles.progressCont}>
{statuses.map((_: any, index: number) => (
<View key={index}  style={styles.progressPort}>
        <Animated.View
        style ={[
            styles.progressBar,
            {width: index < currentIndex
                ? "100%"
                : index === currentIndex
                ? progressWidth
                : "0%"
            }
        ]}  />
    </View>
))}
    </View>
    
<Image  source={{uri: currentUser.statuses[currentIndex].mediaUrl}} style={styles.image}/>

<View style={styles.touches}>
<TouchableOpacity style={{flex: 1}}onPress={goPrev}  />
<TouchableOpacity style={{flex: 1}}onPress={goNext}  />
</View>

<View style={styles.head}>
<View style={styles.userAvatar}>

    <Image  source={{uri: currentUser.avatar}} style={styles.headAvatar}/>

<View style={{flexShrink: 1}}>
<Text style={styles.name}
numberOfLines={1}
ellipsizeMode="tail">
    {currentUser.username}</Text>
<Text style={styles.time}> Today, 8 : 09 AM</Text>
</View>
</View>
<View style={styles.controlIcons}>

    <View style={styles.volAdjust}>
        <TouchableOpacity onPress={() => setShowVolumeSlider(!showVolumeSlider)}>
        <Icon name="volume-high-outline" size={24} color="#fff" />
</TouchableOpacity>
{
    showVolumeSlider && (
      <View style={styles.volume}>
        <Slider  
        style={{width: 100, height: 20}}
        minimumValue={0}
        maximumValue={1}
        value={volume}
        onValueChange={handleVolumeChange}
        minimumTrackTintColor="#fff" 
        maximumTrackTintColor="#999"
        thumbTintColor="#fff"
        />
        </View>
    )
}
    </View>
<TouchableOpacity onPress={togglePause}>
    <Icon name={isPaused ? "play-outline" : "pause-outline"} size={24} color="#fff" />
</TouchableOpacity>
<TouchableOpacity onPress={()  =>navigation.goBack()}>
    <Icon name="close" size={24} color="#fff" />
</TouchableOpacity>
</View>
</View>
<View style={{position: "absolute", bottom : 20, left: 12, right: 12, zIndex: 50, 
}}>
    <MessageInput
    onSend={handleSendMessage}
    onUploadFile={handleUploadFile}
    onToggleEmoji={handleToggleEmoji}
    />

    <TouchableOpacity style={styles.emojiButt}
    onPress={() => setShowEmojiPicker(!showEmojiPicker)} >
       <Text style={styles.emojiReact}>💙</Text>
    </TouchableOpacity>

    {
        showEmojiPicker && (
            <View style={styles.pick}>
                <EmojiSlector   
onEmojiSelected={(emoji) => {
    handleSendMessage(emoji);
    setShowEmojiPicker(false);
}}
showSearchBar={false}
showTabs={false}
columns={8}
                />
                </View>
        )
    }
</View>

</Animated.View>

    )

}
const styles = StyleSheet.create({
    mainPort: {
        flex: 1, backgroundColor: "#000"
    },
    progressCont: {
flexDirection: "row", top: 40, left: 10, right: 10, position: "absolute", gap: 4, zIndex: 20

    },
    volAdjust: {
flexDirection: "row",
alignItems: "center"
    },
    progressBar: {
height: "100%", 
backgroundColor: "#fff"
    },
    image: {
        width: "100%",
        height: "100%",
 resizeMode: "cover",
 zIndex: 0
    },
    head: {
        position: "absolute", 
        top: 60, left: 12, right: 12, justifyContent: "space-between", alignItems: "center",
        flexDirection: "row", zIndex: 40, elevation: 40
    },
    controlIcons:{
flexDirection: "row",
alignItems: "center",
    },
    touches: {
position: "absolute", top: 0, bottom: 0,  left: 0, right: 0, flexDirection: "row"
    },
    volume: {
marginLeft: 6,
paddingHorizontal: 6,
paddingVertical: 2,
borderRadius: 10,
backgroundColor: "rgba(0,0,0,0.6)"

    },
    progressPort: {
        flex: 1, 
        borderRadius: 2, overflow: "hidden",
         height: 3,  backgroundColor: "rgba(255,255,255,0.3)"
    },
    userAvatar: {
        flexDirection: "row",
        alignItems: "center",
        maxWidth: "70%"
    }, 
    time: {
        color: "#ddd", fontSize: 16, marginTop: 3
    },
    name: {
color: "#fff", fontSize: 20, fontWeight: "600"
    },
    headAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
    },
    emojiButt: {
        position: "absolute", bottom: 70,  right: 15, backgroundColor: "white",
        padding: 10, borderRadius: 30, zIndex: 100
    },
    pick: {
        zIndex: 99, backgroundColor: "#777", height: 250, right: 0, left: 0, bottom: 70,
         position: "absolute"
    },
    emojiReact: {
        fontSize: 28
    }
 
})