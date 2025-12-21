import React, {useEffect, useState, useCallback} from "react";
import { useNavigation } from "@react-navigation/native";
import { Camera, useCameraDevice, useCodeScanner } from "react-native-vision-camera";
import { View, Text, StyleSheet, TouchableOpacity} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"

export default function Link() {
    const navigation = useNavigation();
    const device = useCameraDevice("back");
    const[hasPermission, setHasPermission] = useState(false);
    const[linked, setLinked] = useState(false);
    const[scanData, setScanData] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const permission = await Camera.requestCameraPermission();
            setHasPermission(permission === "granted")
        }) ();
    }, []);
    const onCodeScanned = useCallback((codes: any[]) =>{
        if (codes.length > 0 && !linked) {
            const code = codes[0].value;
            console.log("Scanned:", code);
            setScanData(code);
            setLinked(true)
        }
    }, [linked])
    const codeScanner = useCodeScanner({
        codeTypes: ["qr", "ean-13"],
        onCodeScanned,
    });
    if (device == null) {
        return (
            <View style={styles.qr}>
                <Text style={styles.text}>
                    No camera for scanning has been found on the device
                </Text>
            </View>
        );
    }
    if(!hasPermission) {
        return (
            <View style={styles.qr}>
<Text style={styles.text}>Camera Permisison is requiured, kindly enable from the settings</Text>
<TouchableOpacity onPress={() => Camera.requestCameraPermission()} style={styles.permission}>
</TouchableOpacity>
            </View>
        )
    }
    return(
        <View style={styles.port}>
   <View style={styles.head}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
      <Icon name="chevron-back" size={24}color="green" />
  </TouchableOpacity>
  <Text style={{color: "white", marginLeft: 20, fontSize: 20, fontWeight: "bold"}}> JamboMeet Link</Text>
   </View>

   {
    !linked ? (
        <>
        <Text style={styles.directives}>Kindly Scan the Qr code displayed on your Laptop/Computer to link your JamboMeet Account</Text>
        <View style={styles.cameraPort}>
<Camera style={{flex: 1}}
device={device}
isActive={true}
codeScanner={codeScanner}
/>
        </View>
        </>
    ) : (
        <View style={styles.linkPort}>
              <Icon name="checkmark-circle-outline" size={70}color="blue" />
              <Text style={{color: "white", fontSize: 20, marginTop: 10}}>
                TuChat Account Linked Success!
              </Text>
              <Text style={{color: "gray", marginTop: 5, fontSize: 15}}>
                Scanned Token: {scanData}
              </Text>
            </View>

    )
   }
        </View>
    )
}
const styles = StyleSheet.create({
    port: {
        flex: 1,
        backgroundColor: "#000",
        alignItems: "center",
        paddingTop: 50,
    },
    head: {
flexDirection: "row",
alignItems: "center",
width: "90%",
marginBottom: 20
    },
    permission: {
backgroundColor: "#fff",
marginTop: 10,
padding: 10,
borderRadius: 8
    },
    directives: {
color: "#fff", paddingHorizontal: 20, marginVertical: 10, fontSize: 18, textAlign: "center"
    },
    cameraPort: {
width: 300, height: 300, borderRadius: 10, borderWidth: 1.5, borderColor: "blue"
    },
    qr: {
        flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5"
    },
    text: {
        color: "#fff"
    },
    linkPort: {
        flex: 1, alignItems: "center", justifyContent: "center"
    }
})