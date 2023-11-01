import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
// import LoginPage from './login';
import AccountCreationPage from "./account_create";
import { useState } from "react";
import HomePage from "./Home";
import LoginPage from "./Login";
import MapWithCurrentLocation from "./post_landing_page";


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import { ScrollView } from 'react-native-web';

const Stack = createStackNavigator();

/**
 * The main component of the Hitch app.
 * @returns {JSX.Element} The JSX element representing the app.
 */
export default function App() {
  return (
    <NavigationContainer >
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="account_create" component={AccountCreationPage} />
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Home" component={HomePage} />
      {/* <Stack.Screen name="Post" component={PostLandingPage} /> */}
      <Stack.Screen name="Map" component={MapWithCurrentLocation} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}

