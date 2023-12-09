import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
// import LoginPage from './login';
import AccountCreationPage from "./account_create";
import React, { useEffect, useState } from "react";
import HomePage from "./Home";
import LoginPage from "./Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapWithCurrentLocation from "./post_landing_page";
import PendingRidesPage from './PendingRidesPage'
import HitchLandingPageContainer from "./HitchLandingPage";
import PostLandingPage from "./post_landing_page";
import { createStackNavigator } from "@react-navigation/stack";
import Constants from "expo-constants";
import axios, { Axios } from "axios";
import ActiveRide from "./ActiveRide";
import ActivePassenger from "./ActivePassenger";

const { expoConfig } = Constants;



// const page = `http://${expoConfig.debuggerHost.split(":").shift()}:3000`;
// import { ScrollView } from 'react-native-web';

const Stack = createStackNavigator();

// where to find the backend
const page = "https://dolphin-app-7udnd.ondigitalocean.app";
// const page =  "http://10.0.0.157:3000";


// const response= await axios.get(page);
// console.log(response);
export default function App() {
  // token used to keep track of whether the user is logged in
  const [token, setToken] = useState(null);
  const [childIdx, setChildIdx] = useState(0);
  const [showActivePassenger, setShowActivePassenger] = useState(false);
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
      if (userToken === undefined || userToken === null){
        console.log("INVALID TOKEN")
        setToken(userToken)
        setChildIdx(0);
        return userToken
      }
      console.log("VALID TOKEN")

         axios.get(`${page}/account/verifyToken`, {
          headers: {
            Authorization: userToken
          }
        })
          .then(resp => {

            setToken(userToken); // Update the state
            setChildIdx(2);
            return userToken
          })
          .catch((e) => {
            console.log('bad Token')
          setToken(null)
          setChildIdx(0);
          return userToken
          })
    } catch (error) {
      // Handle errors here
      console.log("Error retrieving data", error);
    }
  };

  // function that removes the token from the device's storage
  const removeToken = async () => {
    await AsyncStorage.removeItem("userToken");
    try {
      let test = await axios.post(`${page}/account/logout`, {}, {
        headers: {
          authorization: token
        }
      });    
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



  async function checkRidesActive() {
    console.log("token", token);
    try {
      const response = await axios.get(`${page}/account/rideAwaitingPickup`, {
        headers: {
          Authorization: token
        }
      });
      console.log(response.data);
      if (response.data.rideId != null) {
        // setChildIdx(7);
        setShowActivePassenger(true);
      }
      // Handle the API response here
    } catch (error) {
      console.error(error);
      // Handle the error here
    }

  }


  const penisFunc = () => {
    console.log("PENIS FUNCTION")
    axios.get(`${page}/account/rideAwaitingPickup`, {
        headers: {
          Authorization: token
        }})
        .then(resp => console.log("AAAAA:", resp))
        .catch(resp => console.log("AAAAAL:", resp))
  }

  useEffect(() => {
    penisFunc()
}, [childIdx]);

  // if the user is logged in, go to the home page
  // if(token != null) {
  //   setChildIdx(2);
  // }

  const children = [
    <LoginPage setChildIdx={setChildIdx} storeToken={storeToken} page={page} />,
    <AccountCreationPage
      setChildIdx={setChildIdx}
      storeToken={storeToken}
      removeToken={removeToken}
      token={token}
      page={page}
    />,
    <HomePage setChildIdx={setChildIdx} removeToken={removeToken} page={page} token={token} showActivePassenger={showActivePassenger}/>,
    <MapWithCurrentLocation setChildIdx={setChildIdx} token={token} page={page} />,
    <HitchLandingPageContainer setChildIdx={setChildIdx} token={token} page={page} />,
    <PendingRidesPage  setChildIdx={setChildIdx} page={page} token={token} />,
    <ActiveRide setChildIdx={setChildIdx} token={token} page={page}/>,
    <ActivePassenger showActivePassenger={showActivePassenger}/>,
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
