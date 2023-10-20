import React from "react";
import{
    View,
    Pressable,
    Text,
    StyleSheet
} from "react-native"


export default function HomePage ({navigation}) {
    
    return(
        <View style = {MenuStyle.container}>
            <View style = {MenuStyle.select_box}>
                <Pressable onPress={() => console.log("hitch a ride")}>
                    <Text>Hitch a Ride</Text>        
                </Pressable>
            </View>
            <View style = {MenuStyle.select_box}>
                <Pressable onPress={() => console.log("post a ride")}>
                    <Text>Post a Ride</Text>
                </Pressable>
            </View>
        </View>
    );
}

const MenuStyle = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: "column",
        backgroundColor: "blue",
        alignItems: "center",
        justifyContent: "center",
    },
    select_box: {
        width: "80%",
    }
});