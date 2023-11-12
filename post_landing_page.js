import React, { useState, useEffect } from "react";
import { Image, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import stickman from "./assets/stickman.png";
import * as Location from "expo-location";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// ^^^^ this is the google places autocomplete api might be too costly to use but it is a good idea to use it
import {MapViewDirections} from "react-native-maps-directions";
// import { GOOGLE_MAPS_APIKEY } from "./config.js";
import { TextInput } from "react-native-gesture-handler";



// UseIsFocused: used to keep track of whether the user is on the page or not if it is will update the location

/* 
MapView: displays the actual maps
Polyline: used to draw the route between the two points
Marker: used to mark the start and end points
Circle: used to draw the circle around the start and end points

*/

import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import InputField from "./InputField";
import { NavigationContainer } from "@react-navigation/native";

function Inputs() {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const navigation = useNavigation();

  const handlePostRide = () => {
    // handle posting the ride
    navigation.navigate("RideDetails", { start, destination });
  };

  return (
    <View>
      <InputField label="Start" value={start} onChangeText={setStart} />
      <InputField
        label="Destination"
        value={destination}
        onChangeText={setDestination}
        secureTextEntry={true}
      />
      <TouchableOpacity>
        <Text>Post Your Ride</Text>
      </TouchableOpacity>
    </View>
  );
}

// displays the stickman indicating the user's location
function BlackDotMarker() {
  return (
    <View>
      <Image source={stickman} style={{ width: 50, height: 50 }} />
    </View>
    // <View

    // style={{
    //   width: 15,
    //   height: 15,
    //   borderRadius: 10,
    //   backgroundColor: "black",
    //   // border: "5 solid white",
    //   padding: 10,
    //   borderWidth: 5,
    //   borderColor: 'blue'
    // />
  );
}

// displays the map with the user's location will only update when the user is on the page
const MapWithCurrentLocation = () => {
  const [region, setRegion] = useState(null); // the user's location

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
        // latitudeDelta: 0.0922,
        // longitudeDelta: 0.0421,
      });
    };

    if (isFocused) {
      getLocationAsync();
    }
  }, [isFocused]);
  // console.log(region);
  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={styles.map}
          region={region}
          // showsUserLocation={true}
        >
          {/* displays who is taking the ride witha a red circle around them */}
          {/* <View label="person who is getting ride">
            <Circle
              center={region}
              radius={100} // in meters
              strokeWidth={1}
              strokeColor="black"
              fillColor="rgba(236, 100, 99, 0.41)"
            />
            <Marker
              style={{ position: "absolute", zIndex: 100 }}
              coordinate={region}
              draggable
              onDragEnd={(e) => {
                setMarkerCoordinate(e.nativeEvent.coordinate);
              }}
            >
              <BlackDotMarker />
            </Marker>
          </View> */}

          <MapViewDirections
            origin={region}
            destination={endingRegion}
            apikey={"AIzaSyAzaxnuhcqrHyhCKGPsekHS-VC8lGqG7GY"}
            strokeWidth={3}
            strokeColor="hotpink"
            onError={(errorMessage) => {
              console.log('GOT AN ERROR');
            }}
            />


          {/* displays this destination */}
          {/* <View label="person who is giving ride">
            <Circle
              center={
               endingRegion
              }
              radius={100} // in meters
              strokeWidth={1}
              strokeColor="black"
              fillColor="rgba(236, 100, 99, 0.41)"
            />
            {/* <Marker
            style={{position:"absolute", zIndex: 100}}
            coordinate={region}
            draggable
            onDragEnd={(e) => {
              setMarkerCoordinate(e.nativeEvent.coordinate);
            }}
          >
          </Marker> */}
          {/* </View> */} */}
        </MapView>
      )}
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
