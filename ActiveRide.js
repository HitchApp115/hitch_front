import { func } from "prop-types";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import back from "./assets/back.png";
import axios from "axios";

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

function extractDataBeforeColon(inputString) {
  const parts = inputString.split(":");
  return parts[0]; // returns the part of the string before the colon
}

function extractDataAfterColon(inputString) {
  const parts = inputString.split(":");
  return parts[1]; // returns the part of the string after the colon
}

const parseCoordinates = (coordString) => {
  const parts = coordString.split(",");
  return {
    latitude: parseFloat(parts[0]),
    longitude: parseFloat(parts[1]),
  };
};

export default function ActiveRide({ setChildIdx, removeToken, token, page }) {
  const [start, setStart] = useState([]);
  const [destination, setDestination] = useState([]);
  const [waypoints, setWaypoints] = useState([]);
  const [showMap, setShowMap] = useState(false);
  // the function below is used to extract the pickup spots from the data
  const [coords, setCoords] = useState([]);
  // below is the coords for the markers of the map
  const [startCoord, setStartCoord] = useState([]);
  const [endCoord, setEndCoord] = useState([]);
  const [waypointsCoord, setWaypointsCoord] = useState([]);

  const [ride_id, setRide_id] = useState([]);
  const [driver_id, setDriver_id] = useState([]);
  const [ride_start_time, setRide_start_time] = useState([]);
  const [accepted_riders, setAccepted_riders] = useState([]);
  const [cost_per_rider, setCost_per_rider] = useState([]);
  const [maximum_riders, setMaximum_riders] = useState([]);
  const [is_active, setIs_active] = useState([]);
  const [pickup_dist, setPickup_dist] = useState([]);

  const [directionsCalled, setDirectionsCalled] = useState(false);


  function testing(startLocation, endLocation, waypoints) {
    const startPoint = extractDataBeforeColon(startLocation);
    const driverDest = extractDataBeforeColon(endLocation);
    const pickupSpots = waypoints.map((waypoint) =>
      extractDataBeforeColon(waypoint)
    );
    console.log("testing the input");
    console.log(
      "start",
      startPoint,
      "\nwaypoints",
      pickupSpots,
      "\nend",
      driverDest
    );
  }

  const getDirections = async (startLocation, endLocation, waypoints) => {
    //convert the input to a format that the API can understand y extracting value before colon
    const startPoint = extractDataBeforeColon(startLocation);
    const driverDest = extractDataBeforeColon(endLocation);
    const pickupSpots = waypoints.map((waypoint) =>
      extractDataBeforeColon(waypoint)
    );

    const baseUrl = "https://maps.googleapis.com/maps/api/directions/json";
    const waypointInput = `optimize:true|${pickupSpots.join("|")}`;

    // Use an environment variable or some secure method to store and retrieve your API key
    const YOUR_API_KEY = "AIzaSyAzaxnuhcqrHyhCKGPsekHS-VC8lGqG7GY"; // Replace with a secure method to retrieve your API key

    try {
      const response = await axios.get(
        `${baseUrl}?origin=${encodeURIComponent(
          startPoint
        )}&destination=${encodeURIComponent(
          driverDest
        )}&waypoints=${encodeURIComponent(waypointInput)}&key=${YOUR_API_KEY}`
      );
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
      console.error("Error fetching directions:", error);
      return null;
    }
  };

  function extractRoutePoints(data) {
    // Check if the necessary fields are present
    if (
      !data ||
      !data.ride ||
      !data.riders ||
      !Array.isArray(data.ride) ||
      !Array.isArray(data.riders)
    ) {
      return;
    }

    // Extracting the start point from the first element of the 'ride' array
    const startPoint = data.ride[0].start_point;
    // const startPoint = extractDataBeforeColon(data.ride[0].start_point);
    setStart(startPoint);
    // Extracting the driver destination from the first element of the 'ride' array
    const driverDest = data.ride[0].driver_dest;
    // const driverDest = extractDataBeforeColon(data.ride[0].driver_dest);
    setDestination(driverDest);
    // Map through the 'riders' array and extract the 'pickup_spot' value from each element
    const pickupSpots = data.riders.map((rider) => rider.pickup_spot);
    // const pickupSpots = data.riders.map(rider => extractDataBeforeColon(rider.pickup_spot));
    setWaypoints(pickupSpots);
    setRide_id(data.ride[0].ride_id);
    setDriver_id(data.ride[0].driver_id);
    setRide_start_time(data.ride[0].ride_start_time);
    setAccepted_riders(data.ride[0].accepted_riders);
    setCost_per_rider(data.ride[0].cost_per_rider);
    setMaximum_riders(data.ride[0].maximum_riders);
    setIs_active(data.ride[0].is_active);
    setPickup_dist(data.ride[0].pickup_dist);

    const startCoordUnparsed = extractDataAfterColon(startPoint);
    const endCoordUnparsed = extractDataAfterColon(driverDest);
    const waypointsCoordUnparsed = pickupSpots.map((pickupSpots) =>
      extractDataAfterColon(pickupSpots)
    );

    setStartCoord(parseCoordinates(startCoordUnparsed));
    setEndCoord(parseCoordinates(endCoordUnparsed));
    setWaypointsCoord(
      waypointsCoordUnparsed.map((pickupSpots) => parseCoordinates(pickupSpots))
    );

    // Combine the points into a single flat array
  }

  async function getActiveRide() {
    axios
      .get(`${page}/rides/active`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        // console.log('Status:', response.status);
        // console.log('Data:', response.data);
        const data = response.data;
        console.log("data", data);
        extractRoutePoints(data);
      })
      .catch((error) => {
        if (error.response) {
          // Request made and server responded
          // console.log('Error data:', error.response.data);
          // console.log('Error status:', error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          console.log("Error request:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error message:", error.message);
        }
      });
  }
  useEffect(() => {
    getActiveRide();
    // console.log("Pickup corrdinates",pickupCoordinates);
    // console.log(startCoord, endCoord, waypointsCoord);
    console.log("start", start, "\nwaypoints", waypoints, "\nend", destination);
  }, []);

  // console.log("start", start, "\nwaypoints", waypoints, "\nend", destination);

  const startText = "start\n" + start + "\n";
  const ArrayToTextWithLineBreaks = ({ items }) => {
    return (
      <View>
        <Text style={styles.rideInfoText}>Pickup Spots</Text>
        {items.map((item, index) => (
          <Text style={styles.rideInfoText} key={index}>
            {item}
            {index < items.length - 1 ? "\n" : ""}
          </Text>
        ))}
      </View>
    );
  };

  const endText = "end\n" + destination;

  
  async function CompletedRides() {
    const config = {
      headers: {
          'Authorization': token
      }
  };
  
  // Data to be sent in the body of the POST request
  const data = {
      rideId: ride_id
  };
  
  // Making the POST request
  axios.post(`${page}/rides/end`, data, config)
      .then(response => {
          console.log('Success:', response.data);
      })
      .catch(error => {
          console.error('Error:', error.response ? error.response.data : error.message);
      });
    }
  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => setChildIdx(2)}>
          <Image source={back} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {

            if (!directionsCalled) {
              getDirections(start, destination, waypoints);
              setDirectionsCalled(true);
              // prevents from calling the function again
            }
            setShowMap((showMap) => !showMap);
          }}
        >
          {showMap && <Text>Show pickup Info</Text>}
          {!showMap && <Text>show map</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            // alert("Ride Completed!");
            CompletedRides();
          }}
        >
          <Text>Completed Ride!</Text>
        </TouchableOpacity>
      </View>
      {showMap && (
        <MapWithPolyline
          polylineCoordinates={coords}
          startMarkerCoord={startCoord}
          endMarkerCoord={endCoord}
          waypointsCoord={waypointsCoord}
        />
       )}
      {!showMap && (
        <ScrollView>
          <View style={styles.container}>
            <Text>Ride ID: {ride_id}</Text>
            <Text>Driver ID: {driver_id}</Text>
            <Text>Ride Start Time: {ride_start_time}</Text>
            <Text>Accepted Riders: {accepted_riders}</Text>
            <Text>Cost Per Rider: {cost_per_rider}</Text>
            <Text>Maximum Riders: {maximum_riders}</Text>
            <Text>Is Active: {is_active}</Text>
            <Text>Pickup Distance: {pickup_dist}</Text>
          </View>
          <View style={styles.rideInfo}>
            <Text style={styles.rideInfoText}>Pickup Information</Text>
          </View>
          <View style={styles.rideInfo}>
            <Text style={styles.rideInfoText}>{startText}</Text>
          </View>
          <ArrayToTextWithLineBreaks items={waypoints} />
          <View style={styles.rideInfo}>
            <Text style={styles.rideInfoText}>{endText}</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
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
  },
  btn: {
    height: 50,
    width: "50%",
    marginTop: 5,
    backgroundColor: "#E5D4FF",
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 10,
  },
  btnContainer: {
    flexDirection: "row",
  },
  rideInfo: {
    // height: 40,
    width: "100%",
    marginTop: 30,
    // backgroundColor: "#E5D4FF",
    borderRadius: 10,
  },
  rideInfoText: {
    fontFamily: "Helvetica",
    fontSize: 20,
  },
  // container: {
  //   padding: 20,
  // },
});
