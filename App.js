import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
// import LoginPage from './login';
import AccountCreationPage from "./account_create";
import React, { useEffect, useState } from "react";
import HomePage from "./Home";
import LoginPage from "./Login";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapWithCurrentLocation from "./post_landing_page";


import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import { ScrollView } from 'react-native-web';

const Stack = createStackNavigator();

// where to find the backend
const page = "http://localhost:3000";



export default function App() {
  // token used to keep track of whether the user is logged in
  const [token, setToken] = useState(null);
  const [childIdx, setChildIdx] = useState(3);


  // function that stores the token in the device's storage
  const storeToken = async (userToken) => {
    try {
      await AsyncStorage.setItem('userToken', userToken);
      setToken(userToken); // Update the state
    } catch (error) {
      // Handle errors here
      console.log('Error saving data', error);
    }
  };

  // function that retrieves the token from the device's storage to the state
  const getToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      setToken(userToken); // Update the state
    } catch (error) {
      // Handle errors here
      console.log('Error retrieving data', error);
    }
  };

  // function that removes the token from the device's storage
  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setToken(null); // Update the state
    } catch (error) {
      // Handle errors here
      console.log('Error removing data', error);
    }
  };

  // function that retrives the token from the device's storage and sets it into state
  // useEffect(() => {
  //   getToken();
  // }, []);

  // if the user is logged in, go to the home page
  // if(token != null) {
  //   setChildIdx(2);
  // }

  const children = [
    <LoginPage {...{setChildIdx, storeToken, page}} />,
    <AccountCreationPage {...{setChildIdx, storeToken, page}} />,
    <HomePage setChildIdx={setChildIdx} />,
    <MapWithCurrentLocation setChildIdx={setChildIdx} />,
  ];

  return children[childIdx];
}

/**
 * The main component of the Hitch app.
 * @returns {JSX.Element} The JSX element representing the app.
 */
// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login">
//         <Stack.Screen
//           name="account_create"
//           token={token}
//           component={AccountCreationPage}
//         />
//         <Stack.Screen name="Login" component={LoginPage} />
//         <Stack.Screen name="Home" component={HomePage} />
//         {/* <Stack.Screen name="Post" component={PostLandingPage} /> */}
//         <Stack.Screen name="Map" component={MapWithCurrentLocation} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
