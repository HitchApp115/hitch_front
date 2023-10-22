import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
// import LoginPage from './login';
import AccountCreationPage from "./account_create";
import { useState } from "react";
import HomePage from "./Home";
import LoginPage from "./Login";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import { ScrollView } from 'react-native-web';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer >
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="account_create" component={AccountCreationPage} />
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Home" component={HomePage} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}

