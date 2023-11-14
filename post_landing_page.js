import React, { useState, useEffect } from "react";
import { Image, View, StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView } from "react-native";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import stickman from "./assets/stickman.png";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {MapViewDirections} from "react-native-maps-directions";



// navigator.geolocation = require(GEOLOCATION_PACKAGE)

import * as Location from "expo-location";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// ^^^^ this is the google places autocomplete api might be too costly to use but it is a good idea to use it

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


const coordinates = [
  {
    latitude: 37.798790,
    longitude: -122.442753,
  },
  {
    latitude: 37.790651,
    longitude: -122.422497,
  },
];
// displays the map with the user's location will only update when the user is on the page
const MapWithCurrentLocation = () => {
  const [region, setRegion] = useState(null); // the user's location

  const [endingRegion, setEndingRegion] = useState({
    latitude: 36.9809503330377,
    longitude: -122.05049376286459,
    // latitudeDelta: 0.0922,
    // longitudeDelta: 0.0421,
  }); // the user's end location


  // origin={{"36.98074554301649", "-122.04774522978157"}}
  // destination={{"36.98123050527197", "-122.04822546245168"}}

  const origin = {latitude: 36.98074554301649, longitude: -122.04774522978157};
const destination = {latitude: 36.98123050527197, longitude: -122.04822546245168};

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
    };

    if (isFocused) {
      getLocationAsync();
    }
  }, [isFocused]);
  // console.log(region);
  console.log(coordinates[0]);
  console.log(coordinates[1]);
  return (
    <View style={styles.container}>
      {region && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          // region={region}
          initialRegion={region}
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

            
            origin={{latitude: 37.79065, longitude: -122.422497  }}
            destination={{latitude: 37.79879, longitude: -122.442753}}
            apikey= 'AIzaSyAzaxnuhcqrHyhCKGPsekHS-VC8lGqG7GY'
          
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
            <Marker
            style={{position:"absolute", zIndex: 100}}
            coordinate={region}
            draggable
            onDragEnd={(e) => {
              setMarkerCoordinate(e.nativeEvent.coordinate);
            }}
          >
          </Marker> 
          </View>  */}
        </MapView>
      )}
      {/* <View style ={googleStyles.test} >
        <GooglePlacesAutocomplete
      // styles={googleStyles.test}
      placeholder='Start'
      currentLocation={true}
      fetchDetails={true}
      // when turned on fetchDetails will return the details of the location that is selected
      // data is the name of the location which is all the details that are returned
      // contains lat and long
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: 'AIzaSyAzaxnuhcqrHyhCKGPsekHS-VC8lGqG7GY',
        language: 'en',
      }}
      onFail={(error) => console.error(error)}
    />
     </View> */}
    {/* <GooglePlacesAutocomplete
      // styles={googleStyles.test}
      placeholder='Destination'
      fetchDetails={true}
      // when turned on fetchDetails will return the details of the location that is selected
      // data is the name of the location which is all the details that are returned
      // contains lat and long
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: 'AIzaSyAzaxnuhcqrHyhCKGPsekHS-VC8lGqG7GY',
        language: 'en',
      }}
      onFail={(error) => console.error(error)}
    /> */}
   
      {/* <KeyboardAvoidingView
      style={styles.input_container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Text>Post Your Ride</Text>
        <InputField label="Start" />
        <InputField
          label="Destination"/>
        <TouchableOpacity 
        style={styles.loginBtn}
        >
        <Text>Post Your Ride</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView> */}
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
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    // height: '30%',
    top: 50,
    width: '100%',
    backgroundColor: 'white',
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

// export default function PostLandingPage(setChildIdx) {
//   return (
//     <NavigationContainer>
//       <View style={{ flex: 1 }}>
//         <MapWithCurrentLocation />
//         {/* <Inputs /> */}
//       </View>
//     </NavigationContainer>
//   );
// }



const GooglePlacesInput = () => {
  return (
    <View style ={googleStyles.test} >
        <GooglePlacesAutocomplete
      // styles={googleStyles.test}
      placeholder='Search'
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: 'AIzaSyAzaxnuhcqrHyhCKGPsekHS-VC8lGqG7GY',
        language: 'en',
      }}
      onFail={(error) => console.error(error)}
      currentLocation={true}
      currentLocationLabel='Current location'
    />
    </View>
  
  );
};


const googleStyles = StyleSheet.create({  
  test : {
  top: 50,
  zIndex: 100,
  position: 'absolute',
  height: '100%',
  width: '100%',
 
  // backgroundColor: 'black',
  }
});






// export default GooglePlacesInput;


const TestDirections = () => {
  const [coordinates] = useState([
    { latitude: 37.78825, longitude: -122.4324 },
    { latitude: 37.78925, longitude: -122.4354 }
  ]);

  return (
    <View style={directions.container}>
      <MapView
        style={directions.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={coordinates[0]} />
        <Marker coordinate={coordinates[1]} />

        <MapViewDirections
          origin={coordinates[0]}
          destination={coordinates[1]}
          apikey="AIzaSyAzaxnuhcqrHyhCKGPsekHS-VC8lGqG7GY" // Replace this with your Google API Key
          strokeWidth={3}
          strokeColor="blue"
          onError={(errorMessage) => {
            // Handle the error
            console.error(errorMessage);
          }}
        />
      </MapView>
    </View>
  );
};

const directions = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default TestDirections;
