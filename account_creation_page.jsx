import { StatusBar } from "expo-status-bar";
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


const Account_creation_page = ({
  createUser, setCreateUser, buttonAction
}) => {

  return (
    <View style = {accountStyles.container}>
      <View style={accountStyles.inputView}>
        <TextInput
          style={accountStyles.TextInput}
          value={createUser.firstName}
          placeholder="First Name"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setCreateUser(prevState => ({ ...prevState, firstName: text }))}
        />
        {createUser.firstName ? (
          <Pressable
            style={accountStyles.clearButton}
            onPress={() => setCreateUser(prevState => ({...prevState, firstName: ""}))}
          >
            <Text>x</Text>
          </Pressable>
        ) : null}
      </View>

      
      <View style={accountStyles.inputView}>
        <TextInput
          style={accountStyles.TextInput}
          value={createUser.lastName}
          placeholder="Last Name"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setCreateUser(prevState => ({ ...prevState, lastName: text }))}
        />
        {createUser.lastName ? (
          <Pressable
            style={accountStyles.clearButton}
            onPress={() => setCreateUser(prevState => ({...prevState, lastName: ""}))}
          >
            <Text>x</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={accountStyles.inputView}>
        <TextInput
          style={accountStyles.TextInput}
          value={createUser.email}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setCreateUser(prevState => ({ ...prevState, email: text }))}
        />
        {createUser.email ? (
          <Pressable
            style={accountStyles.clearButton}
            onPress={() => setCreateUser(prevState => ({...prevState, email: ""}))}
          >
            <Text>x</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={accountStyles.inputView}>
        <TextInput
          style={accountStyles.TextInput}
          value={createUser.phoneNumber}
          placeholder="Number"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setCreateUser(prevState => ({ ...prevState, phoneNumber: text }))}
        />
        {createUser.phoneNumber ? (
          <Pressable
            style={accountStyles.clearButton}
            onPress={() => setCreateUser(prevState => ({...prevState, phoneNumber: ""}))}
          >
            <Text>x</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={accountStyles.inputView}>
        <TextInput
          style={accountStyles.TextInput}
          value={createUser.password}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setCreateUser(prevState => ({ ...prevState, password: text }))}
        />
        {createUser.password ? (
          <Pressable
            style={accountStyles.clearButton}
            onPress={() => setCreateUser(prevState => ({...prevState, password: ""}))}
          >
            <Text>x</Text>
          </Pressable>
        ) : null}
      </View>
      <TouchableOpacity style={accountStyles.createBtn}
      onPress = {buttonAction} >
        <Text style={accountStyles.TextInput}>Create Account</Text> 
        
      </TouchableOpacity> 
    </View>
    
  );
};
 

const accountStyles = StyleSheet.create({
  container: {
    marginTop: "100%",
    flex: 1,
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
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
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
  createBtn: {
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


export default Account_creation_page;
