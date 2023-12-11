import { func } from "prop-types";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground
} from "react-native";
import axios from "axios";

import ActiveRideMap from "./ActiveRideMap";
import back from "../assets/back.png";

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

export default function ActiveRide({
  setChildIdx,
  token,
  page,
  activeDrives,
  background
}) {
  const [start, setStart] = useState(":");
  const [destination, setDestination] = useState(":");
  const [waypoints, setWaypoints] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [coords, setCoords] = useState([]);
  const [startCoord, setStartCoord] = useState([]);
  const [endCoord, setEndCoord] = useState([]);
  const [waypointsCoord, setWaypointsCoord] = useState([]);

  const [ride_id, setRide_id] = useState([]);
  const [driver_id, setDriver_id] = useState([]);
  const [ride_start_time, setRide_start_time] = useState([]);
  const [accepted_riders, setAccepted_riders] = useState([]);
  const [cost_per_rider, setCost_per_rider] = useState(0);
  const [maximum_riders, setMaximum_riders] = useState([]);
  const [is_active, setIs_active] = useState([]);
  const [pickup_dist, setPickup_dist] = useState([]);

  const [directionsCalled, setDirectionsCalled] = useState(false);

  useEffect(() => {
    extractRoutePoints(activeDrives);
  }, []);

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

  async function CompletedRides() {
    axios
      .post(
        `${page}/rides/end`,
        {
          rideId: ride_id,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        alert("Ride Completed!");
        setChildIdx(2);
      })
      .catch((error) => {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      });
  }

  return (
    <ImageBackground source={background} style={{flex: 1,
        resizeMode: "cover"}} >
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
          <Text>{showMap ? "Show Pickup Info" : "Show Map"}</Text>
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
      {showMap ? (
        <ActiveRideMap
          polylineCoordinates={coords}
          startMarkerCoord={startCoord}
          endMarkerCoord={endCoord}
          waypointsCoord={waypointsCoord}
        extraStyle={{
            width:'100%',
            marginTop: 10
        }}
        />
      ) : (
        <ScrollView style={{padding: 10}}>
          <View style={styles.miniContainer}>
            <Text><Text style={styles.bold}>Ride ID: </Text>{ride_id}</Text>
            <Text><Text style={styles.bold}>Ride Start Time: </Text>{new Date(ride_start_time).toLocaleString()}</Text>
            <Text><Text style={styles.bold}>Ride Filled: </Text>{accepted_riders}/{maximum_riders} Riders</Text>
            <Text><Text style={styles.bold}>Cost Per Rider: </Text>${cost_per_rider.toFixed(2)}</Text>
            <Text><Text style={styles.bold}>Amount Made for trip: </Text>${(accepted_riders * cost_per_rider).toFixed(2)}</Text>
            <Text><Text style={styles.bold}>Pickup Distance: </Text>{pickup_dist} Km</Text>
          </View>
        <View style={styles.miniContainer}>
            <View style={styles.rideInfo}>
                <Text style={styles.rideInfoTitle}>Pickup Information</Text>
            </View>
            <View style={styles.rideInfo}>
                <Text style={styles.rideInfoText}>Drive Start: </Text>
                <Text style={styles.rideInfoTextSmall}>{start.split(":")[0]}</Text>
            </View>
            <View style={styles.rideInfo}>
                <Text style={styles.rideInfoText}>Pickup Spots: </Text>
                {waypoints.concat(waypoints).map((item, index) => (
                <Text style={styles.rideInfoTextSmall} key={index}>
                    {item.split(':')[0]}
                </Text>
                ))}
            </View>
            <View style={styles.rideInfo}>
                <Text style={styles.rideInfoText}>Drive End: </Text>
                <Text style={styles.rideInfoTextSmall }>{destination.split(":")[0]}</Text>
            </View>
        </View>
        </ScrollView>
      )}
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    //backgroundColor: "#fff",
    // padding: 10,
  },
  miniContainer: {
    marginTop: 50,
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5
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
    borderRadius: 5
  },
  btn: {
    height: 50,
    marginTop: 5,
    backgroundColor: "#E5D4FF",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  btnContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center"
  },
  rideInfo: {
    width: "100%",
    marginBottom: 30,
  },
  rideInfoText: {
    fontFamily: "Helvetica",
    fontSize: 18,
  },
  rideInfoTextSmall: {
    fontFamily: "Helvetica",
    fontSize: 14,
    marginTop: 5
  },
  rideInfoTitle: {
    fontFamily: "Helvetica",
    fontSize: 24,
  },
  bold: {
    fontWeight: 'bold'
  }
  // container: {
  //   padding: 20,
  // },
});
