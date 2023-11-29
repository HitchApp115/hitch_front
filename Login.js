import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import InputField from "./InputField";
// import Video from 'react-native-video';
import { Video } from "expo-av";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// where to find the backend

function LoginPage({ setChildIdx, storeToken, page }) {
  useEffect(() => {
    console.log("PAGE2:", page)
  })
  const [login, SetLogin] = useState("");
  const [password, SetPassword] = useState("");

  function checkEmpty(login, password) {
    return login.trim() === "" || password.trim() === "";
  }

  const loginData = () => ({
    username: login,
    password: password,
  });

  const handleLogin = async () => {
    // check if any of the fields are empty
    console.log("login pressed");
    console.log(login, password);
    if (typeof login !== "string" || typeof password !== "string") {
      console.log("undefined");
    }
    if (checkEmpty(login, password)) {
      alert("Please fill in all fields.");
      return;
    } else {
      try {
        
        const response = axios.post(page + "/account/login", loginData())
          .then(response => {
            storeToken(response.data.loginToken);
            setChildIdx(2);
          })
          .catch(response => {
            console.log("ERRL:", response)
            alert(response.response.data)
          })

        // if the login is successful, set the token and go to the home page

      } catch (e) {
        console.log(e);
        // e is an object with a response property that has data and status
      }
    }
  };

  return (
    // <ImageBackground source={require('./assets/background.png')} style={styles.backgroundImage}>
    <View style={{ flex: 1 }}>
      <Video
        ref={(ref) => (this.videoRef = ref)}
        source={require("./assets/video_background.mp4")} // Can be a URL or a local file.
        style={styles.backgroundVideo}
        muted={true}
        resizeMode={"cover"}
        rate={1.0}
        ignoreSilentSwitch={"obey"}
        shouldPlay={true}
        isLooping={true}
      ></Video>
      {/* <View style={styles.container}> */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Image
          source={require("./assets/logo.png")}
          style={{ width: "80%", height: "40%", alignSelf: "center" }}
        />
        <InputField
          label="Email, Username, or Number"
          value={login}
          onChangeText={SetLogin}
        />
        <InputField
          label="Password"
          value={password}
          onChangeText={SetPassword}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signupBtn}
          onPress={() => setChildIdx(1)}
        >
          <Text style={styles.forgot_button}>
            Don't have an account yet{" "}
            <Text
              style={{
                textDecorationLine: "underline",
                color: "pink",
                textShadowColor: "black",
                textShadowOffset: { width: 3, height: 3 },
                textShadowRadius: 1,
              }}
            >
              Sign up here!
            </Text>
          </Text>
        </TouchableOpacity>
        {/* </View> */}
      </KeyboardAvoidingView>
    </View>
    // {/* // </ImageBackground> */}
  );
}

const styles = StyleSheet.create({
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: -1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or 'stretch'
  },
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 100,
  },
  signupBtn: {
    // width: '30%',
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10, // Adjust this value if needed to position the button accordingly
    // backgroundColor: '#FFFFFF',
    // borderWidth: 1,  // Optional: Adds a border to the button
    // borderColor: '#FF1493'  // Optional: This will be the color of the border
  },

  forgot_button: {
    fontSize: 13,
    height: 30,
    color: "white",
    textShadowColor: "black",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 1,
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#F9F3CC",
  },
});

export default LoginPage;
