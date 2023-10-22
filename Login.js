import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet , ImageBackground, Image} from 'react-native';
import InputField from './InputField';




export default function LoginPage({ navigation }) {
  const [login, SetLogin] = useState("");
  const [password, SetPassword] = useState("");

  return (
    <ImageBackground source={require('./assets/background.png')} style={styles.backgroundImage}>
      
      <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={{width: "80%", height: "40%", alignSelf: 'center', }}/>
        <InputField
          label="Email, Username, or Number"
          value={login}
          onChangeText={SetLogin}
        />
        <InputField
          label="Password"
          value={password}
          onChangeText={SetPassword}
        />
       
        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.signupBtn} onPress={() => navigation.navigate('account_create')}>
          <Text style={styles.forgot_button}>Don't have an account yet <Text style={{ textDecorationLine: "underline", color:"pink", textShadowColor: 'black',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 1,}}>Sign up here!</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({

  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
  },
  signupBtn: {
    // width: '30%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,  // Adjust this value if needed to position the button accordingly
    // backgroundColor: '#FFFFFF',
    // borderWidth: 1,  // Optional: Adds a border to the button
    // borderColor: '#FF1493'  // Optional: This will be the color of the border
  
  },

  forgot_button: {
    fontSize: 13,
    height: 30,
    color: "white",
    textShadowColor: 'black',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 1,
  },
  loginBtn: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: '#F9F3CC',
  },
});

