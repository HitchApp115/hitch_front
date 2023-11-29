import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  TextInput,
  ScrollView,
} from "react-native";
import MapView, {
  Marker,
  Circle,
  PROVIDER_GOOGLE,
  Polyline,
} from "react-native-maps";

// import Polyline from '@mapbox/polyline';

import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import stickman from "./assets/stickman.png";
import back from "./assets/back.png";
import endLocationPin from "./assets/post_ride_end.png";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import AccountSettings from "./account_setting";
import axios from "axios";
/* 
MapView: displays the actual maps
Polyline: used to draw the route between the two points
Marker: used to mark the start and end points
Circle: used to draw the circle around the start and end points
// UseIsFocused: used to keep track of whether the user is on the page or not if it is will update the location
*/

import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import InputField from "./InputField";
import { NavigationContainer } from "@react-navigation/native";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { ImageBackground } from "react-native-web";

// displays the stickman indicating the user's location
function BlackDotMarker() {
  return <Image source={stickman} style={{ width: 75, height: 75 }} />;
}

function EndPointMarker() {
  return <Image source={endLocationPin} style={{ width: 75, height: 75 }} />;
}

const coordinates = [
  {
    latitude: 37.79879,
    longitude: -122.442753,
  },
  {
    latitude: 37.790651,
    longitude: -122.422497,
  },
];
// displays the map with the user's location will only update when the user is on the page

function decodePolyline(encoded) {
  if (!encoded) {
    return [];
  }
  const poly = [];
  let index = 0,
    len = encoded.length;
  let lat = 0,
    lng = 0;
  while (index < len) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;
    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;
    poly.push([lat / 1e5, lng / 1e5]);
  }
  return poly;
}

function HitchLandingPage({ setChildIdx }) {
  const [showscreen, setShowScreen] = useState(0);

  const [region, setRegion] = useState(null); // the user's location also the start location
  const [startRegion, setStartRegion] = useState(null); // the user's start location
  const [endingRegion, setEndingRegion] = useState({
    latitude: 36.9809503330377,
    longitude: -122.05049376286459,
    // latitudeDelta: 0.0922,
    // longitudeDelta: 0.0421,
  }); // the user's end location

  const [coords1, setCoords] = useState([]);

  const getDirections = async (startLoc, destinationLoc) => {
    const YOUR_API_KEY = "AIzaSyAzaxnuhcqrHyhCKGPsekHS-VC8lGqG7GY";

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${YOUR_API_KEY}`
      );
      const points = decodePolyline(
        response.data.routes[0].overview_polyline.points
      );
      const array_cords = points.map((point) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      setCoords(array_cords);

      console.log("directions was called");
    } catch (error) {
      console.error(error);
    }
  };

  const startref = useRef();
  const endref = useRef();

  const [startId, setStartId] = useState("");
  const [endId, setEndId] = useState("");
  const [buttonPressed, setButtonPressed] = useState(0);
  const [getDirectionsPressed, setGetDirectionsPressed] = useState(false);

  useEffect(() => {
    setStartId(startref.current?.getAddressText());
    setEndId(endref.current?.getAddressText());
    setGetDirectionsPressed(true);
  }, [buttonPressed]);

  useEffect(() => {
    // getDirections(startId, endId);
    //the start and end id are the names of the locations
    //intial mount will have the startId and the endId as null 
    if (startId!="" && endId!="") {
      if (getDirectionsPressed == true){ 
      getDirections(startId, endId);
      setShowScreen(1);
    }
    }
    else{
        if (getDirectionsPressed == true){
            setShowScreen(0);
            alert("Please enter a start and end location");
        }
       
    }
    setGetDirectionsPressed(false);
  }, [getDirectionsPressed]);

  const backBtnPressed = () => {
    setChildIdx(2);
  };

  const handleDirections = () => {
    setButtonPressed(buttonPressed + 1);
    // setShowScreen(1);
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    const getLocationAsync = async () => {
      const { granted } = await requestForegroundPermissionsAsync();
      if (!granted) {
        console.log("Permission to access location was denied");
        return;
      }

      const { coords } = await getCurrentPositionAsync({});
      const { latitude, longitude } = coords;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setStartRegion({
        latitude,
        longitude,
        // latitudeDelta: 0.0922,
        // longitudeDelta: 0.0421,
      });
    };

    if (isFocused) {
      getLocationAsync();
    }
  }, [isFocused]);
  //gets the current location of the user and sets it to the state on mount

  function updateRegion(details) {
    setStartRegion({
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }

  function updateEndingRegion(details) {
    setEndingRegion({
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }

  async function moveToLocation(latitude, longitude) {
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }

  function handleSubmit() {
    setShowScreen(2);
    alert(setShowScreen);
    console.log("submit pressed");
    console.log(showscreen);
  }

  const data = [
    { key: "cost" },
    { key: "cost" },
    { key: "cost" },
    { key: "cost" },
    { key: "cost" },
    { key: "cost" },

    // ... more items
  ];

  return (
    <View style={styles.container}>
      {/* //below is the input field for the start and end location */}

      <View style={googleStyles.test}>
        <View style={[showscreen < 2 ? styles:googleStyles.container]}>
          <GooglePlacesAutocomplete
            ref={startref}
            placeholder="Start"
            fetchDetails={true}
            // when turned on fetchDetails will return the details of the location that is selected
            // data is the name of the location which is all the details that are returned
            // contains lat and long
            getCurrentPositionAsync={true}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              // console.log("start ->" + JSON.stringify(details.geometry.location));

              moveToLocation(
                details?.geometry?.location.lat,
                details?.geometry?.location.lng
              );
              updateRegion(details);
            }}
            query={{
              key: "AIzaSyAzaxnuhcqrHyhCKGPsekHS-VC8lGqG7GY",
              language: "en",
            }}
            get
            onFail={(error) => console.error(error)}
          />
          <GooglePlacesAutocomplete
            ref={endref}
            styles={{ flex: 1 }}
            placeholder="Destination"
            fetchDetails={true}
            // when turned on fetchDetails will return the details of the location that is selected
            // data is the name of the location which is all the details that are returned
            // contains lat and long
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              // console.log(data, details);
              // console.log("end ->" + JSON.stringify(details?.geometry?.location));

              moveToLocation(
                details?.geometry?.location.lat,
                details?.geometry?.location.lng
              );
              updateEndingRegion(details);
            }}
            query={{
              key: "AIzaSyAzaxnuhcqrHyhCKGPsekHS-VC8lGqG7GY",
              language: "en",
            }}
            onFail={(error) => console.error(error)}
          />
        </View>

        {showscreen == 0 && (
          <>
            <View style={styles.containerForButtons}>
              <TouchableOpacity onPress={backBtnPressed} style={styles.backBtn}>
                <Image source={back} style={styles.backBtnImage} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.displayBtn, styles.displayRouteBtn]}
                onPress={handleDirections}
              >
                <Text style={styles.loginText}>Confirm Route</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {showscreen === 1 && (
          <View style={styles.adjustingRideCreationContainer}>
            <TextInput
              style={styles.postInputTextInputs}
              placeholder="Budget"
            ></TextInput>

            <View style={styles.containerForButtons}>
              <TouchableOpacity
                onPress={() => {
                  setShowScreen(0);
                }}
                style={styles.backBtn}
              >
                <Image source={back} style={styles.backBtnImage} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.displayBtn, styles.dislayPostBtn]}
                onPress={() => {
                  setShowScreen(2);
                }}
              >
                <Text style={styles.loginText}>Find Your Ride</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {showscreen === 2 && (
          <View style={styles.ridesContainer}>
             <View style={styles.containerForButtons}>
              <TouchableOpacity
                onPress={() => {
                  setShowScreen(1);
                }}
                style={styles.backBtn}
              >
                <Image source={back} style={styles.backBtnImage} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.displayBtn, styles.dislayPostBtn]}
                onPress={() => {
                  setShowScreen(2);
                }}
              >
                <Text style={styles.loginText}>Refresh</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.ridesContainer}>
              {data.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 10,
                  }}
                >
                  <Text>ride {index} </Text>
                  <TouchableOpacity
                    title="Press me"
                    onPress={() => alert("Button pressed!")}
                  >
                    <Text>Join</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* //input for start and stop location ends here */}

      <MapView
        // ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 36.99126994890912,
          longitude: -122.05864519201934,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        region={region}
      >
        {startRegion && (
          <Marker coordinate={startRegion} title={"Start"}>
            <BlackDotMarker />
          </Marker>
        )}
        {endingRegion && (
          <Marker coordinate={endingRegion} title={"End"}>
            <EndPointMarker />
          </Marker>
        )}
        {coords1 && (
          <Polyline
            coordinates={coords1}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={["#F11A7B", "#6528F7"]}
            strokeWidth={6}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  input_container: {
    flex: 1,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    // height: '30%',
    top: 50,
    width: "100%",
    // backgroundColor: "white",
    margin: 0,
  },

  containerForButtons: {
    flexDirection: "row",
    // alignItems: "center",
    height: 50,
    margin: 0,
    padding: 0,
    // borderWidth: 3,
    borderColor: "red",
  },

  backBtn: {
    // height: 50,
    padding: 0,
    margin: 0,
    // flex: 1,
    maxWidth: "20%",
    // height: 50,
  },
  backBtnImage: {
    flex: 1,
    margin: 0,
    height: 55,
    width: 55,
    // height: "100%",
    // width: "100%",
  },

  displayBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 10,
    // backgroundColor: "#F9F3CC",
  },
  displayRouteBtn: {
    backgroundColor: "#F58484",
  },
  dislayPostBtn: {
    backgroundColor: "red",
  },

  adjustingRideCreationContainer: {
    width: "100%",
    // height: 320,
  },
  postInputTextInputs: {
    width: "100%",
    height: 33,
    backgroundColor: "white",
    fontFamily: "Helvetica",
    fontSize: 20,
    borderWidth: 3,
    marginTop: 2,
    borderColor: "black",
  },
  screen1: {
    // position: "absolute",
    zIndex: 3,
    width: "100%",
  },
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },

  ridesContainer: {
    height: 150,
    width: "100%",
  },
});

export default function HitchLandingPageContainer({ setChildIdx }) {
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        {/* <AccountSettings /> */}
        <HitchLandingPage setChildIdx={setChildIdx} />
        {/* <Inputs /> */}
      </View>
    </NavigationContainer>
  );
}

const googleStyles = StyleSheet.create({
  test: {
    top: 35,
    position: "absolute",
    backgroundColor: "white",
    zIndex: 1,
    flex: 1,
    width: "100%",
  },
  container: {
    height:  0,
    opacity: 0, // Makes the component fully transparent
    pointerEvents: 'none', // The component will not receive touch events
  },
});
