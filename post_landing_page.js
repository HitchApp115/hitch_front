import React, { useState, useEffect } from "react";
import { Image, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import stickman from "./assets/stickman.png";

import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import InputField from "./InputField";

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
      <TouchableOpacity onPress={handlePostRide}>
        <Text>Post Your Ride</Text>
      </TouchableOpacity>
    </View>
  );
}
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

const MapWithCurrentLocation = () => {
  const [region, setRegion] = useState(null);
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
  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={styles.map}
          region={region}
          // showsUserLocation={true}
        >
          <View label="person who is getting ride">
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
          </View>
          <View label="person who is giving ride">
            <Circle
              center={{
                latitude: 36.9809503330377,
                longitude: -122.05049376286459,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
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
          </View>
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

export default function PostLandingPage() {
  return (
    <View style={{ flex: 1 }}>
      <MapWithCurrentLocation />
      {/* <Inputs /> */}
    </View>
  );
}
