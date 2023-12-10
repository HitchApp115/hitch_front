import React from "react";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import AccountSettings from "./AccountSettingsPage";

export default function HomePage({ setChildIdx, removeToken, token, page, showActivePassenger, showActiveDrives}) {
  
  const handleHitchPress = () => {
    setChildIdx(4);

  };


  handlePendingRidesPress = () => {
    setChildIdx(5)
  }

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={MenuStyle.backgroundImage}
    >
      <AccountSettings setChilDIdx={setChildIdx} removeToken={removeToken} token={token} page={page}/>
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
            onPress={() => setChildIdx(4)}
          >
            <Image
              source={require("../assets/Hitch.png")}
              style={{ width: 50, height: 50 }}
            />
            <Text style={{ color: "white" }}>Hitch a Ride</Text>
          </Pressable>
        </View>
        <View style={MenuStyle.select_box}>
          <Pressable
            onPress={() => setChildIdx(3)}
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
            <Image
              source={require("../assets/post.png")}
              style={{ width: 50, height: 50 }}
            />
            <Text style={{ color: "white" }}>Drivers</Text>
          </Pressable>
        </View>
        {showActiveDrives &&(
          <View style={MenuStyle.select_box}>
          <Pressable
            onPress={()=>{setChildIdx(6)}}
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
            <Image
              source={require("../assets/post.png")}
              style={{ width: 50, height: 50 }}
            />
            <Text style={{ color: "white" }}>Active Drive</Text>
          </Pressable>
        </View>
        )    
        }
        {showActivePassenger &&(
              <View style={MenuStyle.select_box}>
              <Pressable
                onPress={()=>{setChildIdx(7)}}
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
                <Image
                  source={require("../assets/post.png")}
                  style={{ width: 50, height: 50 }}
                />
                <Text style={{ color: "white" }}>Active Passenger</Text>
              </Pressable>
            </View>
        )}

        
        
      </View>
    </ImageBackground>
  );
}

const MenuStyle = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or 'stretch'
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  select_box: {
    height: "25%",
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
