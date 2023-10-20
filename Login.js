import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import InputField from './InputField';

export default function LoginPage({navigation}) {
  const [login, SetLogin] = useState("");
  const [password, SetPassword] = useState("");
  
  return (
    <View style={styles.container}>
      <InputField
        label="Email, Username, or Number"
        value={login}
        onChangeText = {SetLogin}
      />
      <InputField
        label="Password"
        value={password}
        onChangeText = {SetPassword}
      />
      <TouchableOpacity onPress={() => navigation.navigate('account_create')}>
        <Text style={styles.forgot_button}>Sign up!</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  loginBtn: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#FF1493',
  },
});

