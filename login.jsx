
import React, { useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  Pressable,
} from "react-native";

const LoginPage = ({login_user, setLogInUser, signUpAction, loginAction}) => {
  
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("./assets/demo.jpg")} /> 
   
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          value= {login_user.login_email}
          placeholder="Email, Username, or Number"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setLogInUser(prevState => ({ ...prevState, login_email: text }))}
        /> 
        { login_user.login_email ? (
            <Pressable style={styles.clearButton}
            onPress={() => setLogInUser(prevState => ({ ...prevState, login_email: "" }))}>
            <Text>x</Text>
            </Pressable>
        ) : null} 
      </View> 
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          value= {login_user.login_password}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(text) => setLogInUser(prevState => ({ ...prevState, login_password: text }))}
        /> 
         {login_user.login_password ? (
            <Pressable style={styles.clearButton}
            onPress={() => setLogInUser(prevState => ({ ...prevState, login_password: "" }))}>
            <Text>x</Text>
            </Pressable>
        ) : null} 
        
      </View> 
      <TouchableOpacity
      onPress={signUpAction}
      >
        <Text style={styles.forgot_button}>Sign up!</Text> 
      </TouchableOpacity> 
      
      <TouchableOpacity style={styles.loginBtn}
        onPress={loginAction}
      >
        <Text style={styles.loginText}>LOGIN</Text> 
      </TouchableOpacity> 
    </View> 
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "100%",
    // width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginBottom: 40,
  },
  inputView: {
    flexDirection: 'row',
    backgroundColor: "#F1EFEF",
    borderWidth: 1,
    borderRadius: 10,
    width: "80%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  loginBtn: {
    width: "80%",
    
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF1493",
  },

  clearButton: {
    padding: 10,
    marginRight: 6,
  }
});

export default LoginPage;