import React from "react";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

export default function HomePage({ navigation }) {
    const handleHitchPress = () => {
      console.log("hitch a ride");
    };
  
    const handlePostPress = () => {
      console.log("post a ride");
    };
  
    return (
      <View style={MenuStyle.container}>
        <View style={MenuStyle.select_box}>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "lightskyblue" : "royalblue",
                borderRadius: 10,
                padding: 10,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
  
                elevation: 5,
              },
              MenuStyle.Btn,
            ]}
            onPress={handleHitchPress}
          >
            <Image source={require('./assets/Hitch.png')} style={{width: 50, height: 50}}/>
            <Text style={{ color: "white" }}>Hitch a Ride</Text>
          </Pressable>
        </View>
        <View style={MenuStyle.select_box}>
          <Pressable
            onPress={handlePostPress}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "lightskyblue" : "royalblue",
                borderRadius: 10,
                padding: 10,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
  
                elevation: 5,
              },
              MenuStyle.Btn,
            ]}
          > 
            <Image source={require('./assets/post.png')} style={{width: 50, height: 50}}/>
            <Text style={{ color: "white" }}>Post a Ride</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  
  const MenuStyle = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    select_box: {
      height: 100,
      backgroundColor: "lightblue",
      margin: 10,
      borderRadius: 10,
      width: "80%",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
  
      elevation: 5,
    },
    Btn: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });