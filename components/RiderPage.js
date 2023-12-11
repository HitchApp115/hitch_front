import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import background from "../assets/background.png";

// import Polyline from '@mapbox/polyline';

import { useIsFocused } from "@react-navigation/native";
import stickman from "../assets/stickman.png";
import back from "../assets/back.png";
import endLocationPin from "../assets/post_ride_end.png";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
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

// displays the stickman indicating the user's location
function BlackDotMarker() {
  return <Image source={stickman} style={{ width: 75, height: 75 }} />;
}

function EndPointMarker() {
  return <Image source={endLocationPin} style={{ width: 75, height: 75 }} />;
}
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

function HitchLandingPage({ setChildIdx, token, page }) {
  const [showscreen, setShowScreen] = useState(0); // 0 = start and end location input, 1 = route display, 2 = ride joining
  const [region, setRegion] = useState(null); // the user's location also the start location
  const [startRegion, setStartRegion] = useState(null); // the user's start location
  const [endingRegion, setEndingRegion] = useState({
    latitude: 36.9809503330377,
    longitude: -122.05049376286459,
  });
  const [coords1, setCoords] = useState([]);
  const [startId, setStartId] = useState("");
  const [endId, setEndId] = useState("");
  const [buttonPressed, setButtonPressed] = useState(0);
  const [getDirectionsPressed, setGetDirectionsPressed] = useState(false);
  const [shouldDisplayPendingRides, setShouldDisplayPendingRides] =
    useState(false);
  const [isDownloadingPendingRides, setIsDownloadingPendingRides] =
    useState(false);
  const [isDownloadingJoinableRides, setIsDownloadingJoinableRides] =
    useState(false);

  const startref = useRef();
  const endref = useRef();

  useEffect(() => {
    setStartId(startref.current?.getAddressText());
    setEndId(endref.current?.getAddressText());
    setGetDirectionsPressed(true);
  }, [buttonPressed]);

  useEffect(() => {
    // getDirections(startId, endId);
    //the start and end id are the names of the locations
    //intial mount will have the startId and the endId as null
    if (startId != "" && endId != "") {
      if (getDirectionsPressed == true) {
        getDirections(startId, endId);
        setShowScreen(1);
      }
    }
    // will check to see if the start and end id are not null this will alret the user to enter a start and end location
    else {
      if (getDirectionsPressed == true) {
        setShowScreen(0);
        alert("Please enter a start and end location");
      }
    }
    setGetDirectionsPressed(false);
  }, [getDirectionsPressed]);

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
  }

  // maxPrice must be a float value
  const [maxPrice, setMaxPrice] = useState("");
  const [rides, setRides] = useState([]);
  const [pendingRides, setPendingRides] = useState([]);
  const [showChild, setShowChild] = useState(0);

  async function ViewOpenRides() {
    setIsDownloadingJoinableRides(true);
    const floatNumber = parseFloat(maxPrice);

    const params = {
      startPoint: `${startId}:${startRegion.latitude},${startRegion.longitude}`,
      maxPrice: floatNumber,
    };
    axios
      .get(`${page}/rides/view`, { params })
      .then((response) => {
        setIsDownloadingJoinableRides(false);
        if (response.data.rides.length == 0) {
        } else {
          setRides(response.data.rides);
        }
      })
      .catch((error) => {
        console.error("Error during request:", error);
      });
  }

  //currently this function is not working because the backend is not working
  async function JoinRide(index, ride_id) {
    axios
      .post(
        `${page}/rides/sendRiderRequest`,
        {
          riderStartPoint: `${startId}:${startRegion.latitude},${startRegion.longitude}`,
          rideId: ride_id,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        alert("Ride Successfully Requested");
      })
      .catch((error) => {
        throw error;
      });
  }
  // this part is going to show rides that are available
  async function ViewPendingRides() {
    setIsDownloadingPendingRides(true);
    setPendingRides([]);
    // Make the POST request
    axios
      .post(
        `${page}/rides/approved`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        setIsDownloadingPendingRides(false);
        setPendingRides(response.data["message"]);
      })
      .catch((error) => {
        setIsDownloadingPendingRides(false);
        alert("Failed to download pending rides");
      });
  }

  async function RemoveRequest(token, ride_id) {
    try {
      const response = await axios.post(
        `${page}/rides/riderRequestRemoval`,
        { rideId: ride_id },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  }

  const ViewRidesParent = () => {
    const children = [<ViewRidesContainer />, <ViewPendingRidesContainer />];
    return (
      <>
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
                // setShowScreen(2);
                ViewOpenRides();
                ViewPendingRides();
              }}
            >
              <Text style={styles.loginText}>Refresh</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.containerForButtons}>
            <TouchableOpacity
              onPress={() => {
                setShowChild(0);
              }}
              style={styles.viewRidesBtn}
            >
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 15,
                  fontSize: 16,
                }}
              >
                Rides To Join
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewPendingBtn]}
              onPress={() => {
                setShowChild(1);
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 15,
                  fontSize: 16,
                }}
              >
                Pending
              </Text>
            </TouchableOpacity>
          </View>
          {children[showChild]}
        </View>
      </>
    );
  };
  const ViewRidesContainer = () => {
    return (
      <>
        <ScrollView style={styles.viewRidesContainer}>
          {isDownloadingJoinableRides ? (
            <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 20}} />
          ) : (
            rides.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                  borderColor: "black",
                  borderBottomWidth: 1,
                }}
              >
                <View style={{ maxWidth: "80%" }}>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>
                      Ride {index + 1}:{" "}
                    </Text>
                    ${item.cost_per_rider}
                  </Text>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>Destination: </Text>{" "}
                    {item["driver_dest"].split(":")[0]}
                  </Text>
                </View>

                <TouchableOpacity
                  title="Press me"
                  onPress={() => {
                    JoinRide(index, (ride_id = item.ride_id));
                    ViewPendingRides();
                  }}
                  style={{
                    marginLeft: "auto",
                    marginTop: 20,
                    borderColor: "black",
                    borderWidth: 2,
                    padding: 10,
                    borderRadius: 5,
                  }}
                >
                  <Text>Join</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </>
    );
  };

  const ViewPendingRidesContainer = () => {
    // usedfor refrencing the viewpending rides request
    const [rideRequestkey, setRideRequestKey] = useState(0);
    return (
      <View>
        {shouldDisplayPendingRides && (
           <View style={{
            padding: 5,
            borderRadius: 5,
            fontSize: 30, 
            textAlign: 'center', 
            backgroundColor: 'white',
            width: '70%',
            marginLeft: 'auto', 
            marginRight: 'auto',
            marginTop: 5
        }}>
        <Text style={{
            fontSize: 30,
            textAlign: 'center'
              }}>Pending Rides</Text>
        </View>       
        )}

        {shouldDisplayPendingRides && (
          <View style={styles.containerForButtons}>
            <TouchableOpacity
              onPress={() => {
                setChildIdx(2);
              }}
              style={styles.backBtn}
            >
              <Image source={back} style={styles.backBtnImage} />
            </TouchableOpacity>
          </View>
        )}

        {shouldDisplayPendingRides && (
          <TouchableOpacity
            onPress={ViewPendingRides}
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 20,
              borderColor: "black",
              borderWidth: 2,
              padding: 10,
              borderRadius: 5,
              backgroundColor: "#7cf075",
            }}
          >
            <Text>Refresh Status</Text>
          </TouchableOpacity>
        )}
        <ScrollView key={rideRequestkey} style={{width: '100%'}}>
          {isDownloadingPendingRides ? (
            <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 20}} />
          ) : (
            <View style={{ marginTop: 20 }}>
              {pendingRides.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 10,
                    backgroundColor: "white",
                    width: '90%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: 20,
                    borderRadius: 5,
                    borderWidth: 2,
                  }}
                >
                  <View style={{ maxWidth: "50%" }}>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>
                        Ride {index + 1}:{" "}
                      </Text>
                      ${item.cost_per_rider}
                    </Text>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>
                        Pickup Spot: 
                      </Text>{" "}
                      {item["pickup_spot"].split(":")[0]}
                    </Text>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>Destination: </Text>{" "}
                      {item["driver_dest"].split(":")[0]}
                    </Text>
                  </View>
                  <View style={{ marginLeft: "auto" }}>
                    <Text>{item.accepted == 0 ? "Pending" : "Accepted"}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      RemoveRequest(token, item.ride_id).then(() =>
                        ViewPendingRides()
                      );
                      setRideRequestKey(rideRequestkey + 1);
                    }}
                    style={{
                      borderColor: "black",
                      borderWidth: 2,
                      padding: 5,
                      borderRadius: 5,
                      marginLeft: "auto",
                      backgroundColor: '#f07575'
                    }}
                  >
                    <Text> Cancel</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {!pendingRides.length && !isDownloadingPendingRides ? (
            <View
              style={{
                width: "80%",
                backgroundColor: "white",
                marginLeft: "10%",
                padding: 10,
                borderRadius: 5,
                marginTop: 20,
                borderWidth: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                No Pending Rides
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
    );
  };

  if (shouldDisplayPendingRides) {
    return (
      <ImageBackground
        source={background}
        style={{ flex: 1, resizeMode: "cover" }}
      >
        <View style={{ ...googleStyles.test2, marginTop: 20 }}>
          <View
            style={{
              ...styles.SelectionMenu,
              marginTop: 0,
              width: "80%",
              borderRadius: 5,
              marginHorizontal: "10%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setShouldDisplayPendingRides(false);
              }}
              style={{
                ...styles.SelectionButton,
                borderRadius: 5,
                backgroundColor: "#A7D0F1",
                height: 40,
                marginTop: 10,
              }}
            >
              <Text
                style={{ fontSize: 16, textAlign: "center", marginTop: 10 }}
              >
                Find New Rides
              </Text>
            </TouchableOpacity>
          </View>
          <ViewPendingRidesContainer />
        </View>
      </ImageBackground>
    );
  }

  return (
    <View style={styles.container}>
      {/* //below is the input field for the start and end location */}

      <View style={{ ...googleStyles.test, marginTop: 20 }}>
        <View style={[showscreen < 2 ? styles : googleStyles.container]}>
          <View
            style={{
              ...styles.SelectionMenu,
              marginTop: 10,
              width: "80%",
              borderRadius: 5,
              marginHorizontal: "10%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setShouldDisplayPendingRides(true);
                ViewPendingRides();
              }}
              style={{
                ...styles.SelectionButton,
                borderRadius: 5,
                backgroundColor: "#A7D0F1",
                height: 40,
              }}
            >
              <Text
                style={{ fontSize: 16, textAlign: "center", marginTop: 10 }}
              >
                View Pending Rides
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={{ textAlign: "center", fontSize: 30 }}>Find a Ride</Text>

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
              value={maxPrice}
              style={styles.postInputTextInputs}
              placeholder="Enter maximum price"
              // onChangeText={(val) => setMaxPrice(parseFloat(val))}
              onChangeText={(val) => setMaxPrice(val)}
              keyboardType="numeric" // This ensures a numeric keyboard is shown
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
                  ViewOpenRides();

                  setShowScreen(2);
                }}
              >
                <Text style={styles.loginText}>Find Your Ride</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {showscreen === 2 && (
          <>
            <ViewRidesParent />
          </>
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
    // backgroundColor: "white",
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
    marginLeft: "10%",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    height: 33,
    backgroundColor: "white",
    fontFamily: "Helvetica",
    fontSize: 20,
    borderWidth: 3,
    marginVertical: 5,
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
    height: 250,
    width: "100%",
    // backgroundColor: "grey",
  },
  viewRidesBtn: {
    backgroundColor: "#F3EEEA",
    flex: 1,
    width: "50%",
  },
  viewPendingBtn: {
    backgroundColor: "white",
    flex: 1,
    width: "50%",
  },
  viewRidesContainer: {
    height: 250,
    width: "100%",
    backgroundColor: "#F3EEEA",
  },
});

export default function HitchLandingPageContainer({
  setChildIdx,
  token,
  page,
}) {
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        {/* <AccountSettings /> */}
        <HitchLandingPage setChildIdx={setChildIdx} token={token} page={page} />
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
  test2: {
    top: 35,
    position: "absolute",
    zIndex: 1,
    flex: 1,
    width: "100%",
  },
  container: {
    height: 0,
    opacity: 0, // Makes the component fully transparent
    pointerEvents: "none", // The component will not receive touch events
  },
});
