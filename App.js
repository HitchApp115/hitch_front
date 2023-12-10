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
import axios, { Axios } from "axios";
import ActiveRide from "./ActiveRide";
import ActivePassenger from "./ActivePassenger";



// where to find the backend
const page = "https://dolphin-app-7udnd.ondigitalocean.app";


// const response= await axios.get(page);
export default function App() {
  // token used to keep track of whether the user is logged in
  const [token, setToken] = useState(null);
  const [childIdx, setChildIdx] = useState(0);
  const [activeRides, setActiveRides] = useState([])
  const [activeDrives, setActiveDrives] = useState({})


  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (token){
      activeDriveCheck()
      activeRideCheck()
    }
      
}, [childIdx, token]);

  // function that stores the token in the device's storage
  const storeToken = async (userToken) => {
    try {
      await AsyncStorage.setItem("userToken", userToken);
      setToken(userToken); // Update the state
    } catch (error) {
      // Handle errors here
    }
  };

  // function that retrieves the token from the device's storage to the state
  const getToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken === undefined || userToken === null){
        setToken(userToken)
        setChildIdx(0);
        return userToken
      }
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
              setToken(null)
              setChildIdx(0);
              return userToken
            })
    } catch (error) {
      // Handle errors here
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
    }
  };

  // function that retrives the token from the device's storage and sets it into state


  const activeRideCheck = () => {
    axios.get(`${page}/account/rideAwaitingPickup`, {
        headers: {
          Authorization: token
        }})
        .then(resp => setActiveRides(resp.data.rides))
  }

  const activeDriveCheck = () => {
    axios.get(`${page}/rides/active`, {
        headers: {
          Authorization: token
        }})
        .then(resp => {
          if (!resp.data.ride.length) {
            setActiveDrives({})
            return
          }
          setActiveDrives({
            ride: resp.data.ride,
            riders: resp.data.riders
          })
        })
  }

  const children = [
    <LoginPage setChildIdx={setChildIdx} storeToken={storeToken} page={page} />,
    <AccountCreationPage
      setChildIdx={setChildIdx}
      storeToken={storeToken}
      removeToken={removeToken}
      token={token}
      page={page}
    />,
    <HomePage 
      setChildIdx={setChildIdx} 
      removeToken={removeToken} 
      page={page} token={token} 
      showActivePassenger={!!activeRides.length} 
      showActiveDrives={!!Object.keys(activeDrives).length}
    />,
    <MapWithCurrentLocation setChildIdx={setChildIdx} token={token} page={page} />,
    <HitchLandingPageContainer setChildIdx={setChildIdx} token={token} page={page} />,
    <PendingRidesPage  setChildIdx={setChildIdx} page={page} token={token} />,
    <ActiveRide setChildIdx={setChildIdx} token={token} page={page} activeDrives={activeDrives} />,
    <ActivePassenger page={page} token={token} activeRides={activeRides} setChildIdx={setChildIdx}/>,
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
