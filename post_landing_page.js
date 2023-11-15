import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import stickman from "./assets/stickman.png";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { MapViewDirections } from "react-native-maps-directions";

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

// function Inputs() {
//   const [start, setStart] = useState("");
//   const [destination, setDestination] = useState("");
//   const navigation = useNavigation();

//   const handlePostRide = () => {
//     // handle posting the ride
//     navigation.navigate("RideDetails", { start, destination });
//   };

//   return (
//     <View>
//       <InputField label="Start" value={start} onChangeText={setStart} />
//       <InputField
//         label="Destination"
//         value={destination}
//         onChangeText={setDestination}
//         secureTextEntry={true}
//       />
//       <TouchableOpacity>
//         <Text>Post Your Ride</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// displays the stickman indicating the user's location
function BlackDotMarker() {
  return <Image source={stickman} style={{ width: 50, height: 50 }} />;
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
const MapWithCurrentLocation = () => {
  const [region, setRegion] = useState(null); // the user's location also the start location

  const [startRegion, setStartRegion] = useState(null); // the user's start location
  const [endingRegion, setEndingRegion] = useState({
    latitude: 36.9809503330377,
    longitude: -122.05049376286459,
    // latitudeDelta: 0.0922,
    // longitudeDelta: 0.0421,
  }); // the user's end location



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

  async function getRoute() {
    try {
      let response = await fetch(
        "https://maps.googleapis.com/maps/api/directions/json?origin=" +
          origin.latitude +
          "," +
          origin.longitude +
          "&destination=" +
          destination.latitude +
          "," +
          destination.longitude +
          "&key=" +
          "AIzaSyB-7JG8VX4E2H5KXzKqZgjJ9v9UcYxXwKs"
      );
      let json = await response.json();
      console.log(json);
      return json;
    } catch (error) {
      console.error(error);
    }
  }

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
    // mapRef.current.animateToRegion(
    //   {
    //     latitude,
    //     longitude,
    //     latitudeDelta: 0.0922,
    //     longitudeDelta: 0.0421,
    //   },
    //   2000
    // );

    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }

  // console.log(region);
  // console.log(coordinates[0]);
  // console.log(coordinates[1]);
  return (
    <View style={styles.container}>
      <View style={googleStyles.test}>
        <GooglePlacesAutocomplete
          placeholder="Start"
          // currentLocation={true}
          fetchDetails={true}
          // when turned on fetchDetails will return the details of the location that is selected
          // data is the name of the location which is all the details that are returned
          // contains lat and long
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log("start ->" + JSON.stringify(details.geometry.location));

            let startCoordinates = {
              latitude: details?.geometry?.location.lat,
              longitude: details?.geometry?.location.lng,
            };
            // setRegion(startCoordinates);
            // moveToLocation(startCoordinates);

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
          onFail={(error) => console.error(error)}
        />
        <GooglePlacesAutocomplete
          styles={{ flex: 1 }}
          placeholder="Destination"
          fetchDetails={true}
          // when turned on fetchDetails will return the details of the location that is selected
          // data is the name of the location which is all the details that are returned
          // contains lat and long
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            // console.log(data, details);
            console.log("end ->" + JSON.stringify(details?.geometry?.location));

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
      <MapView
        // ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        // onRegionChangeComplete={setRegion}
      >
      {startRegion && (
       <Marker coordinate={startRegion} title={"Start"} />
      )}
      {endingRegion && (
       <Marker coordinate={endingRegion} title={"End"} />
      )}
      </MapView>
    </View>
  );
};

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
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#F9F3CC",
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#F9F3CC",
  },
});

export default function PostLandingPage(setChildIdx) {
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <MapWithCurrentLocation />
        {/* <Inputs /> */}
      </View>
    </NavigationContainer>
  );
}

const GooglePlacesInput = () => {
  return (
    <View style={googleStyles.test}>
      <GooglePlacesAutocomplete
        // styles={googleStyles.test}
        placeholder="Search"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          // console.log(data, details);
        }}
        query={{
          key: "AIzaSyAzaxnuhcqrHyhCKGPsekHS-VC8lGqG7GY",
          language: "en",
        }}
        onFail={(error) => console.error(error)}
        currentLocation={true}
        currentLocationLabel="Current location"
      />
    </View>
  );
};

const googleStyles = StyleSheet.create({
  test: {
    top: 50,
    position: "absolute",
    zIndex: 1,
    flex: 1,
    width: "100%",
  },
});
