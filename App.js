import axios, { Axios } from "axios";
import AccountCreationPage from "./components/AccountCreatePage";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from 'expo-asset';

import HomePage from "./components/Home";
import LoginPage from "./components/Login";
import DriverPage from "./components/DriverPage";
import PendingRidesPage from "./components/PendingRidesPage";
import RiderPage from "./components/RiderJoinPage";
import ActiveDrivePage from "./components/ActiveDrivePage";
import ActivePassengerPage from "./components/ActivePassengerPage";

import background from './assets/background.png'
import backgroundVideo from './assets/video_background.mp4'


// where to find the backend
const page = "https://dolphin-app-7udnd.ondigitalocean.app";


function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}


export default function App() {
  // token used to keep track of whether the user is logged in
  const [token, setToken] = useState(null);
  const [childIdx, setChildIdx] = useState(0);
  const [activeRides, setActiveRides] = useState([]);
  const [activeDrives, setActiveDrives] = useState({});
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        const imageAssets = cacheImages([
          require('./assets/background.png'),
          require('./assets/video_background.mp4'),
          require('./assets/Hitch.png'),
          require('./assets/logo.png'),
          require('./assets/post.png'),
          require('./assets/activeDrive.png'),
          require('./assets/openCar.png')
        ]);


        await Promise.all([...imageAssets]);
      } catch (e) {
        // You might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      activeDriveCheck();
      activeRideCheck();
    }
  }, [childIdx, token]);

  // function that stores the token in the device's storage
  const storeToken = async (userToken) => {
    await AsyncStorage.setItem("userToken", userToken);
    setToken(userToken);
  };

  // function that retrieves the token from the device's storage to the state
  const getToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    if (userToken === undefined || userToken === null) {
      setToken(userToken);
      setChildIdx(0);
      return userToken;
    }
    axios
      .get(`${page}/account/verifyToken`, {
        headers: {
          Authorization: userToken,
        },
      })
      .then((resp) => {
        setToken(userToken);
        setChildIdx(2);
        return userToken;
      })
      .catch((e) => {
        setToken(null);
        setChildIdx(0);
        return userToken;
      });
  };

  // function that removes the token from the device's storage
  const removeToken = async () => {
    await AsyncStorage.removeItem("userToken");
   axios.post(
        `${page}/account/logout`,
        {},
        {
          headers: {
            authorization: token,
          },
        }
      )
      .then(() => {
        setToken(null)
      })

  };

  // function that retrives the token from the device's storage and sets it into state

  const activeRideCheck = () => {
    axios
      .get(`${page}/account/rideAwaitingPickup`, {
        headers: {
          Authorization: token,
        },
      })
      .then((resp) => setActiveRides(resp.data.rides));
  };

  const activeDriveCheck = () => {
    axios
      .get(`${page}/rides/active`, {
        headers: {
          Authorization: token,
        },
      })
      .then((resp) => {
        if (!resp.data.ride.length) {
          setActiveDrives({});
          return;
        }
        setActiveDrives({
          ride: resp.data.ride,
          riders: resp.data.riders,
        });
      });
  };

  const children = [
    <LoginPage setChildIdx={setChildIdx} storeToken={storeToken} page={page} backgroundVideo={backgroundVideo} />,
    <AccountCreationPage
      setChildIdx={setChildIdx}
      storeToken={storeToken}
      removeToken={removeToken}
      token={token}
      page={page}
      background={background}
    />,
    <HomePage
      setChildIdx={setChildIdx}
      removeToken={removeToken}
      page={page}
      token={token}
      showActivePassenger={!!activeRides.length}
      showActiveDrives={!!Object.keys(activeDrives).length}
      background={background}
    />,
    <DriverPage
      setChildIdx={setChildIdx}
      token={token}
      page={page}
      background={background}
    />,
    <RiderPage setChildIdx={setChildIdx} token={token} page={page} background={background} />,
    <PendingRidesPage setChildIdx={setChildIdx} page={page} token={token}  />,
    <ActiveDrivePage
      setChildIdx={setChildIdx}
      token={token}
      page={page}
      activeDrives={activeDrives}
      background={background}
    />,
    <ActivePassengerPage
      page={page}
      token={token}
      activeRides={activeRides}
      setChildIdx={setChildIdx}
      background={background}
    />,
  ];

  return appIsReady ? children[childIdx] : null;
}

