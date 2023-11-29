import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
// import LoginPage from './login';
import AccountCreationPage from "./account_create";
import React, { useEffect, useState } from "react";
import HomePage from "./Home";
import LoginPage from "./Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapWithCurrentLocation from "./post_landing_page";
import PostLandingPage from "./post_landing_page";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Constants from "expo-constants";
import AccountSettings from "./account_setting";
import axios, { Axios } from "axios";
const { expoConfig } = Constants;
// const page = `http://${expoConfig.debuggerHost.split(":").shift()}:3000`;
// import { ScrollView } from 'react-native-web';

const Stack = createStackNavigator();

// where to find the backend
// const page = "http://localhost:3000";
const page = "https://lionfish-app-3pdnm.ondigitalocean.app";
// const page = "http://169.233.224.168"
// const page = `http://${manifest.debuggerHost.split(":").shift()}:3000`;


// const response= await axios.get(page);
// console.log(response);
export default function App() {
  // token used to keep track of whether the user is logged in
  const [token, setToken] = useState(null);
  const [childIdx, setChildIdx] = useState(0);

  // function that stores the token in the device's storage
  const storeToken = async (userToken) => {
    try {
      await AsyncStorage.setItem("userToken", userToken);
      setToken(userToken); // Update the state
    } catch (error) {
      // Handle errors here
      console.log("Error saving data", error);
    }
  };

  // function that retrieves the token from the device's storage to the state
  const getToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken === undefined)
        return
      setToken(userToken); // Update the state
      console.log("got token "+userToken);
      setChildIdx(2);
    } catch (error) {
      // Handle errors here
      console.log("Error retrieving data", error);
    }
  };

  // function that removes the token from the device's storage
  const removeToken = async () => {
    await AsyncStorage.removeItem("userToken");
    try {
      let test = await axios.post(page+"/account/logout", {}, {
        headers: {
          authorization: token
        }
      });
      console.log("test ",test);
      
      setToken(null); // Update the state
    } catch (error) {
      // Handle errors here
      console.log("Error removing data", error);
    }
  };

  // function that retrives the token from the device's storage and sets it into state
  useEffect(() => {
    getToken();
  }, []);

  // if the user is logged in, go to the home page
  // if(token != null) {
  //   setChildIdx(2);
  // }

  const children = [
    <LoginPage setChildIdx={setChildIdx} storeToken={storeToken} page={page} />,
    <AccountCreationPage
      setChildIdx={setChildIdx}
      storeToken={storeToken}
      page={page}
    />,
    <HomePage setChildIdx={setChildIdx} removeToken={removeToken}/>,
    <MapWithCurrentLocation setChildIdx={setChildIdx} />,
    // <PostLandingPage setChildIdx={setChildIdx} />,
    // <GooglePlacesInput />,
  //<TestDirections />
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
