import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  TextInput,
  ImageBackground,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, {
  Marker,
  Circle,
  PROVIDER_GOOGLE,
  Polyline,
} from "react-native-maps";

// import Polyline from '@mapbox/polyline';

import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import car from "../assets/post.png";
import back from "../assets/back.png";
import endLocationPin from "../assets/post_ride_end.png";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import AccountSettings from "./AccountSettingsPage";
import axios from "axios";
import PendingRidesPage from "./PendingRidesPage";
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

// displays the stickman indicating the user's location
function BlackDotMarker() {
  return <Image source={car} style={{ width: 75, height: 75 }} />;
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

function MapWithCurrentLocation({ setChildIdx, token, page, background }) {
  const domain = "https://dolphin-app-7udnd.ondigitalocean.app";

  const [showscreen, setShowScreen] = useState(0);
  const [startId, setStartId] = useState("");
  const [endId, setEndId] = useState("");
  const [buttonPressed, setButtonPressed] = useState(0);
  const [getDirectionsPressed, setGetDirectionsPressed] = useState(false);
  const [riders, setRiders] = useState(0);
  const [costPerRider, setCostPerRider] = useState(0);
  const [maxDistance, setMaxDistance] = useState(0);
  const [startTime, setStartTime] = useState(new Date());
  const [region, setRegion] = useState(null); // the user's location also the start location
  const [startRegion, setStartRegion] = useState(null); // the user's start location
  const [endingRegion, setEndingRegion] = useState(null); // the user's end location
  const [coords1, setCoords] = useState([]);
  const [shouldDisplayPage, setShouldDisplayPage] = useState(false);

  const startref = useRef();
  const endref = useRef();

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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setStartId(startref.current?.getAddressText());
    setEndId(endref.current?.getAddressText());

    if (
      startref.current?.getAddressText() &&
      endref.current?.getAddressText()
    ) {
      setGetDirectionsPressed(true);
    } else {
      setGetDirectionsPressed(false);
    }
  }, [startRegion, endingRegion]);

  useEffect(() => {
    // getDirections(startId, endId);
    //the start and end id are the names of the locations
    //intial mount will have the startId and the endId as null
    if (startId != "" && endId != "") {
      if (getDirectionsPressed == true) {
        getDirections(startId, endId);
        setShowScreen(1);
      }
    } else {
      if (getDirectionsPressed == true) {
        setShowScreen(0);
        alert("Please enter a valid start and end location");
      }
    }
    setGetDirectionsPressed(false);
  }, [getDirectionsPressed]);

  const backBtnPressed = () => {
    setChildIdx(2);
  };

  const handleDirections = () => {
    setButtonPressed(buttonPressed + 1);
    setShowScreen(1);
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    const getLocationAsync = async () => {
      const { granted } = await requestForegroundPermissionsAsync();
      if (!granted) {
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

  const submitRoute = () => {
    axios
      .post(
        page + "/rides/create",
        {
          startPointName: startId,
          endPointName: endId,
          startPoint: startRegion,
          destination: endingRegion,
          riders,
          costPerRider,
          pickUpDistance: maxDistance,
          rideStartTime: startTime.toString(),
        },
        {
          headers: {
            authorization: token,
          },
        }
      )
      .then((response) => {
        alert("Ride Created Successfully");
        setShouldDisplayPage(true);
      })
      .catch((response) => {
        alert(response.response.data.message);
      });
  };

  if (shouldDisplayPage) {
    return (
      <ImageBackground
        source={background}
        style={{ flex: 1, resizeMode: "cover" }}
      >
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              setShouldDisplayPage(false);
            }}
            style={{
              ...styles.SelectionButton,
              flexGrow: 0,
              borderRadius: 5,
              backgroundColor: "#A7D0F1",
              height: 40,
              width: "80%",
              marginLeft: "10%",
              marginTop: 65,
            }}
          >
            <Text style={{ fontSize: 16, textAlign: "center", marginTop: 10 }}>
              Create a Ride
            </Text>
          </TouchableOpacity>

          <View
            style={{
              padding: 5,
              borderRadius: 5,
              fontSize: 30,
              textAlign: "center",
              backgroundColor: "white",
              width: "70%",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 5,
            }}
          >
            <Text
              style={{
                fontSize: 30,
                textAlign: "center",
              }}
            >
              Created Rides
            </Text>
          </View>

          <PendingRidesPage
            setChildIdx={setChildIdx}
            token={token}
            page={page}
          />
        </View>
      </ImageBackground>
    );
  }

  return (
    <View style={styles.container}>
      {/* //below is the input field for the start and end location */}

      <View style={{ ...googleStyles.test, marginTop: 20 }}>
        <TouchableOpacity
          onPress={() => {
            setShouldDisplayPage(true);
          }}
          style={{
            ...styles.SelectionButton,
            borderRadius: 5,
            backgroundColor: "#A7D0F1",
            height: 40,
            width: "80%",
            marginLeft: "10%",
            marginTop: 10,
          }}
        >
          <Text style={{ fontSize: 16, textAlign: "center", marginTop: 10 }}>
            View Created Rides
          </Text>
        </TouchableOpacity>

        <Text style={{ textAlign: "center", fontSize: 30, marginTop: 10 }}>Create a Ride</Text>

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

        {!showscreen ? (
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

              {/* <TouchableOpacity
                style={[styles.displayBtn, styles.dislayPostBtn]}
                onPress={switchToPost}
              >
                <Text style={styles.loginText}>Post</Text>
              </TouchableOpacity> */}
            </View>
          </>
        ) : (
          <View style={styles.adjustingRideCreationContainer}>
            <TextInput
              style={styles.postInputTextInputs}
              placeholder="Maximum Rider Count"
              onChangeText={(text) => setRiders(Number(text))}
              keyboardType="numeric"
            ></TextInput>
            <TextInput
              style={styles.postInputTextInputs}
              placeholder="Cost Per Rider"
              onChangeText={(text) => setCostPerRider(Number(text))}
              keyboardType="numeric"
            ></TextInput>
            <TextInput
              style={styles.postInputTextInputs}
              placeholder="Max Distance from Pickup Location"
              onChangeText={(text) => setMaxDistance(Number(text))}
              keyboardType="numeric"
            ></TextInput>
            <DateTimePicker
              value={startTime}
              onChange={(e, date) => setStartTime(date)}
              mode="datetime"
              style={{
                marginRight: "auto",
                marginLeft: "auto",
                marginVertical: 5,
              }}
            />
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
                onPress={submitRoute}
              >
                <Text style={styles.loginText}>Submit Your Route!</Text>
              </TouchableOpacity>
            </View>
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
  SelectionButton: {
    borderColor: "black",
    borderWidth: 2,
    height: 50,
    flexGrow: 1,
  },
  SelectionMenu: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
  },

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
    width: "80%",
    height: 33,
    backgroundColor: "white",
    fontFamily: "Helvetica",
    fontSize: 20,
    borderWidth: 3,
    marginTop: 2,
    borderColor: "black",
    marginLeft: "10%",
    padding: 5,
    borderRadius: 5,
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
});

export default function PostLandingPage({
  setChildIdx,
  token,
  page,
  background,
}) {
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        {/* <AccountSettings /> */}
        <MapWithCurrentLocation
          setChildIdx={setChildIdx}
          token={token}
          page={page}
          background={background}
        />
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
});
