import { func } from "prop-types";
import React, {useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import back from "./assets/back.png";
import axios from "axios";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import MapWithPolyline from "./Active_ride_map";



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



// export default getDirections;

// const getDirections = async (startLocation, endLocation, waypoints) => {
//   // const apiKey = 'YOUR_API_KEY'; // Replace with your API Key
//   const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';

//   const waypointInput = `optimize:true|${waypoints.join('|')}`
  
//   const YOUR_API_KEY = "AIzaSyAzaxnuhcqrHyhCKGPsekHS-VC8lGqG7GY";
//   try {
//     const response = await axios.get(
//       `https://maps.googleapis.com/maps/api/directions/json?origin=${startLocation}&destination=${endLocation}&waypoints=${waypointInput}&key=${YOUR_API_KEY}`
//     );

//     return response.data;
//   } catch (error) {
//     console.error('Error fetching directions:', error);
//     return null;
//   }
// };

function extractDataBeforeColon(inputString) {
  const parts = inputString.split(':');
  return parts[0]; // returns the part of the string before the colon
}



export default function ActiveRide({ setChildIdx, removeToken, token, page}) {


    const [start, setStart] = useState([]);
    const [destination, setDestination] = useState([]);
    const [waypoints, setWaypoints] = useState([]);
    const [showMap, setShowMap] = useState(false);
    // the function below is used to extract the pickup spots from the data
    const [coords, setCoords] = useState([]);

    const getDirections = async (startLocation, endLocation, waypoints) => {
      const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';
      const waypointInput = `optimize:true|${waypoints.join('|')}`;
    
      // Use an environment variable or some secure method to store and retrieve your API key
      const YOUR_API_KEY = "AIzaSyAzaxnuhcqrHyhCKGPsekHS-VC8lGqG7GY"; // Replace with a secure method to retrieve your API key
    
      try {
        const response = await axios.get(`${baseUrl}?origin=${encodeURIComponent(startLocation)}&destination=${encodeURIComponent(endLocation)}&waypoints=${encodeURIComponent(waypointInput)}&key=${YOUR_API_KEY}`);
        // console.log("response", response.data);
        console.log("response", response.status);
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
        return response.data;
      } catch (error) {
        console.error('Error fetching directions:', error);
        return null;
      }
    };

    function extractRoutePoints(data) {
      // Check if the necessary fields are present
      if (!data || !data.ride || !data.riders || !Array.isArray(data.ride) || !Array.isArray(data.riders)) {
          return [];
      }
  
      // Extracting the start point from the first element of the 'ride' array
      // const startPoint = data.ride[0].start_point;
      const startPoint = extractDataBeforeColon(data.ride[0].start_point);
      setStart(startPoint);
      // Extracting the driver destination from the first element of the 'ride' array
      // const driverDest = data.ride[0].driver_dest;
      const driverDest = extractDataBeforeColon(data.ride[0].driver_dest);
      setDestination(driverDest);
      // Map through the 'riders' array and extract the 'pickup_spot' value from each element
      // const pickupSpots = data.riders.map(rider => rider.pickup_spot);
      const pickupSpots = data.riders.map(rider => extractDataBeforeColon(rider.pickup_spot));

      setWaypoints(pickupSpots);
      // Combine the points into a single flat array
  }

    

    async function getActiveRide() {
        axios.get(`${page}/rides/active`, {
            headers: {
              'Authorization': token
            }
          })
          .then(response => {
            // console.log('Status:', response.status);
            // console.log('Data:', response.data);
            const data = response.data;
            extractRoutePoints(data);
          })
          .catch(error => {
            if (error.response) {
              // Request made and server responded
              // console.log('Error data:', error.response.data);
              // console.log('Error status:', error.response.status);
            } else if (error.request) {
              // The request was made but no response was received
              console.log('Error request:', error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error message:', error.message);
            }
          });
          
    }
    useEffect(() => {
        getActiveRide();
        // console.log("Pickup corrdinates",pickupCoordinates);
    }, []);

    console.log("start", start, "waypoints", waypoints, "end", destination);


  return (
    <View style={styles.container}>
        <View>
            <TouchableOpacity onPress={() => setChildIdx(2)}>
                <Image source={back} />
            </TouchableOpacity>
        </View>
        <View style={styles.displayInfo}>
            <Text>Ride:{"Rider Id goes here"}</Text>
        </View>
        <View style={styles.displayInfo}>
            <Text>from:{" start position goes here"}</Text>
        </View >
        <View style={styles.displayInfo}>
            <Text>to:{" destination goes here"}</Text>
        </View>
        <View>
            <TouchableOpacity onPress={()=>
            {
              getDirections(start, destination, waypoints);
              setShowMap(true)
            }
              }>
                <Image source={back} />
            </TouchableOpacity>
        </View>
        {showMap && <MapWithPolyline polylineCoordinates={coords} />}
        
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        flex: 1,
        backgroundColor: "#fff",
        padding: 20
    },
    displayInfo: {
        height: 50,
        width: "100%",
        marginTop: 2,
        backgroundColor: "#E5D4FF",
        justifyContent: "center",
        // alignItems: "center",
        borderWidth: 3,
        borderColor: "#000000",
        borderRadius: 10,
    },
    Gps: {
        height: 40,
        width: "100%",
        marginTop: 5,
        backgroundColor: "#E5D4FF",
        borderRadius: 10,
    }

});



