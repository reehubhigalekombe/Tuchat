import React, {useEffect, useRef, useState} from "react";
import { View, Text, StyleSheet, Image, Animated, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Slider from "@react-native-community/slider"
import { useNavigation } from "@react-navigation/native";

export default function  StatusView({route}: any) {
    const navigation = useNavigation();
    const {avatar, username} = route.params
const [volume, setVolume] = useState(1);
const[showVolumeSlider, setShowVolumeSlider] = useState(false)
    const progress  = useRef(new Animated.Value(0)).current;
    const [isPaused, setIsPaused] = useState(false);
    const animationRef = useRef<Animated.CompositeAnimation | null > (null);
    const DURATION = 10000;

    const startAnimation = (fromValue = 0) => {
        animationRef.current = Animated.timing(progress, {
            toValue: 1,
            duration: DURATION * (1 - fromValue),
            useNativeDriver: false
        });
        animationRef.current.start(({finished}) => {
            if(finished) navigation.goBack()
        });
    };

    useEffect(() => {
        startAnimation()
    }, []);


    const progressWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"]

    });
    
    const togglePause = () => {
        if(isPaused) {
            progress.stopAnimation((currentValue: number) => {
                startAnimation(currentValue)
            });
          
        } else{
animationRef.current?.stop();
        }
        setIsPaused(!isPaused)
    }

    const handleVolumeChange = (value: number) => {
        setVolume(value)
    }
    return(
<View style={styles.mainPort}>
    <View style={styles.progressPort}>
        <Animated.View
        style ={[
            styles.progressBar,
            {width: progressWidth}
        ]}  />
    </View>

<Image  source={{uri: avatar}} style={styles.image}/>

<View style={styles.head}>
<Text style={{color: "#fff", fontSize: 18, fontWeight: "500"}}>{username}</Text>

<View style={styles.controlIcons}>

    <View style={styles.volAdjust}>
        <TouchableOpacity onPress={() => setShowVolumeSlider(!showVolumeSlider)}>
        <Icon name="volume-high-outline" size={24} color="#999" />
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
    <Icon name={isPaused ? "play-outline" : "pause-outline"} size={24} color="#999" />
</TouchableOpacity>
<TouchableOpacity onPress={()  =>navigation.goBack()}>
    <Icon name="close" size={24} color="#999" />
</TouchableOpacity>
</View>
</View>
</View>
            


    )
}
const styles = StyleSheet.create({
    mainPort: {
        flex: 1, backgroundColor: "#000"
    },
    volAdjust: {
flexDirection: "row",
alignItems: "center"
    },
    progressBar: {
height: "100%", backgroundColor: "#fff"
    },
    image: {
flex: 1, resizeMode: "contain"
    },
    head: {
        position: "absolute", 
        top: 50, left: 16, right: 16, justifyContent: "space-between", alignItems: "center",
        flexDirection: "row"
    },
    controlIcons:{
flexDirection: "row",
alignItems: "center",


    },
    volume: {
marginLeft: 6,
paddingHorizontal: 6,
paddingVertical: 2,
borderRadius: 10,
backgroundColor: "rgba(0,0,0,0.6)"

    },
    progressPort: {
        zIndex:10,
        borderRadius: 2, overflow: "hidden",
        top: 20, left: 10, right: 10, height: 3, position: "absolute",  backgroundColor: "rgba(255,255,255,0.3)"
    }
})