import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,

  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import back from "../assets/back.png";


export default PendingRidesPage = ({ setChildIdx, page, token }) => {
  const [rides, setRides] = useState([]);
  const [isDownloadingCreatedRides, setIsDownloadingCreatedRides] =
    useState(false);

  useEffect(() => {
    updatePendingRides();
  }, []);

  const updatePendingRides = () => {
    setIsDownloadingCreatedRides(true);
    axios
      .get(`${page}/rides/pending`, {
        headers: {
          Authorization: token,
        },
      })
      .then((resp) => {
        setIsDownloadingCreatedRides(false);
        setRides(resp.data.pendingRides);
      })
      .catch(() => {
        setIsDownloadingCreatedRides(false);
        alert("Error fetching pending rides");
      });
  };

  const acceptOrRejectRider = (riderId, rideId, isAccepted) => {
    axios
      .post(
        `${page}/rides/resolveRiderRequest`,
        {
          rideId,
          riderId,
          acceptRider: isAccepted ? 1 : 2,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((resp) => {
        updatePendingRides();
      });
  };

  const removeRide = (rideId) => {
    axios
      .delete(`${page}/rides/remove`, {
        data: {
          rideId,
        },
        headers: { Authorization: token },
      })
      .then(() => {
        updatePendingRides();
      });
  };

  const startRide = (rideId) => {
    axios
      .post(
        `${page}/rides/start`,
        {
          rideId,
        },
        {
          headers: { Authorization: token },
        }
      )
      .then((resp) => {
        alert(resp.data.message);
        updatePendingRides();
        // Move to the active ride page
      });
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setChildIdx(2)}
        style={AccountStyles.backBtnContainer}
      >
        <Image source={back} style={AccountStyles.backbtn} />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {isDownloadingCreatedRides ? (
          <View style={{marginTop: 20, backgroundColor: 'white', padding: 20, width: 70, borderRadius: 5, marginLeft: 'auto', marginRight: 'auto' }}>
          <ActivityIndicator size="large" color="#0000ff"  />
          </View>
        ) : (
          rides.map((ride, idx) => {
            return (
              <View
                key={idx}
                style={{
                  backgroundColor: "white",
                  width: "90%",
                  marginHorizontal: "5%",
                  marginTop: 25,
                  padding: 5,
                  borderRadius: 5,
                  borderColor: "black",
                  borderWidth: 2,
                }}
              >
                <Text><Text style={{fontWeight: 'bold'}}>Ride </Text>{ride["ride_id"]}</Text>
                <Text><Text style={{fontWeight: 'bold'}}>Start Point: </Text>{ride["start_point"].split(":")[0]}</Text>
                <Text><Text style={{fontWeight: 'bold'}}>End Point: </Text>{ride["driver_dest"].split(":")[0]}</Text>
                <Text><Text style={{fontWeight: 'bold'}}>Departure Time: </Text>{new Date(ride["ride_start_time"]).toLocaleString()}</Text>
                <Text>
                <Text style={{fontWeight: 'bold'}}>Ride Filled: </Text>
                  {ride["accepted_riders"]} / {ride["maximum_riders"]} Riders
                </Text>
                <TouchableOpacity
                  style={{
                    padding: 5,
                    borderColor: "black",
                    borderWidth: 2,
                    borderRadius: 5,
                    paddingVertical: 10, backgroundColor: '#2cd144'
                  }}
                  onPress={() => startRide(ride["ride_id"])}
                >
                  <Text style={{fontSize: 18, textAlign: 'center'}}>Start Ride</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    padding: 5,
                    borderColor: "black",
                    borderWidth: 2,
                    borderRadius: 5,
                    marginTop: 5,
                    paddingVertical: 10,
                    backgroundColor: '#d14545'
                  }}
                  onPress={() => removeRide(ride["ride_id"])}
                >
                  <Text style={{fontSize: 18, textAlign: 'center'}}>Cancel Ride</Text>
                </TouchableOpacity>
                {ride["requesting_riders"].map((rider, nestedIdx) => {
                  return (
                    <View
                      key={idx + "-" + nestedIdx}
                      style={{
                        width: "90%",
                        marginLeft: "10%",
                      }}
                    >
                      <Text><Text style={{fontWeight: 'bold'}}>Rider: </Text>{rider["first_name"]}</Text>
                      <Text><Text style={{fontWeight: 'bold'}}>Rating: </Text>{rider["average_rating"]}</Text>
                      <Text><Text style={{fontWeight: 'bold'}}>Distance: </Text>{rider["distance"]} Km</Text>

                      {/* <Image source={{uri: rider.image}} style={{
                                    width: 100,
                                    height: 100
                                }}/> */}

                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 10,
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            padding: 5,
                            borderColor: "black",
                            borderWidth: 2,
                            borderRadius: 5,
                            backgroundColor: '#7cf075'
                          }}
                          onPress={() =>
                            acceptOrRejectRider(
                              rider["rider_id"],
                              ride["ride_id"],
                              true
                            )
                          }
                        >
                          <Text>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            padding: 5,
                            borderColor: "black",
                            borderWidth: 2,
                            borderRadius: 5,
                            backgroundColor: '#f07575'
                          }}
                          onPress={() =>
                            acceptOrRejectRider(
                              rider["rider_id"],
                              ride["ride_id"],
                              false
                            )
                          }
                        >
                          <Text>Reject</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })
        )}
        {!isDownloadingCreatedRides && !rides.length ? (
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
              No Created Rides
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </>
  );
};

const AccountStyles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: "white",
  //   alignItems: "center",
  //   // marginTop: 70,
  //   justifyContent: "flex-start",
  // },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or 'stretch'
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // paddingHorizontal: 20,
    marginBottom: "30%",
  },
  styleScrollview: {
    flex: 1,
    // backgroundColor: "blue",
    height: "50%",
    width: "100%",
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 40,
    backgroundColor: "#FF1493",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  backBtnContainer: {
    width: "100%",
    marginVertical: 10,
  },
  backbtn: {
    width: 60,
    height: 50,
    marginLeft: 10,
  },
});
