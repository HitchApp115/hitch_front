import React, {useState, useEffect} from "react";
import axios from "axios";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    ImageBackground,
    Image,
    ScrollView
  } from "react-native";
  import back from "./assets/back.png"
  import background from './assets/background.png';
import { useScrollToTop } from "@react-navigation/native";

export default PendingRidesPage = ({ setChildIdx, page, token }) => {
    const [rides, setRides] = useState([
    ])

    useEffect(() => {
      updatePendingRides()
    }, [])

    const updatePendingRides = () => {
      axios.get(`${page}/rides/pending`, {
        headers: {
          Authorization: token
        }
      })
        .then((resp) => {
          setRides(resp.data.pendingRides)
        })
        .catch(() => {
          alert("Error fetching pending rides")
        })
    }

    const acceptOrRejectRider = (riderId, rideId, isAccepted) => {
      axios.post(`${page}/rides/resolveRiderRequest`, {
        rideId,
        riderId,
        acceptRider: isAccepted ? 1 : 2
      }, {
        headers: {
          Authorization: token
        }
      })
        .then(resp => {
          updatePendingRides()
        })
    }

    const removeRide = (rideId) => {
      axios.delete(`${page}/rides/remove`, {
        data: {
          rideId
        },
        headers: { Authorization: token}
      })
        .then(() => {
          updatePendingRides()
        })
    }

    const startRide = (rideId) => {
      axios.post(`${page}/rides/start`, {
        rideId
      }, {
        headers: { Authorization: token}
      })
        .then((resp) => {
          alert(resp.data.message)
          updatePendingRides()
          // Move to the active ride page
        })

    }


return (
    
    <>
     <TouchableOpacity onPress={() => setChildIdx(2)} style = {AccountStyles.backBtnContainer}>
        <Image source={back} style={AccountStyles.backbtn}/>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{paddingBottom: 50}}>
      {rides.map((ride, idx) => {

        return(
            <View
            key={idx}
                style={{backgroundColor: 'white',
                    width: '90%',
                    marginHorizontal: '5%',
                    marginTop: 25,
                    padding: 5,
                    borderRadius: 5,
                    borderColor: 'black',
                    borderWidth: 2
                    }}
            >
                <Text>Ride {ride['ride_id']}</Text>
                <Text>Start Point: {ride['start_point'].split(':')[0]}</Text>
                <Text>End Point: {ride['driver_dest'].split(':')[0]}</Text>
                <Text>Departure Time: {ride['ride_start_time']}</Text>
                <Text>{ride['accepted_riders']} / {ride['maximum_riders']} Riders</Text>
                <TouchableOpacity style={
                  { padding: 5,
                      borderColor: 'black', 
                      borderWidth: 2 ,
                    borderRadius: 5}
                  }
                    onPress={() => startRide(ride['ride_id'])}
                  >
                  <Text>Start Ride</Text>
                </TouchableOpacity>
                <TouchableOpacity style={
                    { padding: 5,
                        borderColor: 'black', 
                        borderWidth: 2 ,
                      borderRadius: 5}
                    }
                    
                    onPress={() => removeRide(ride['ride_id'])}
                    >
                  <Text>Cancel Ride</Text>
                </TouchableOpacity>
                {ride['requesting_riders'].map(
                    (rider, nestedIdx) => {
                        return (
                            <View
                                key={idx+'-'+nestedIdx}
                                style={{
                                    width: '90%',
                                    marginLeft: '10%'
                                }}
                            >
                                <Text>Rider: {rider['first_name']}</Text>
                                <Text>Rating: {rider['average_rating']}</Text>
                                <Text>Distance: {rider['distance']}</Text>
                
                                {/* <Image source={{uri: rider.image}} style={{
                                    width: 100,
                                    height: 100
                                }}/> */}

                                <View
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 10
                                    }}
                                >
                                    <TouchableOpacity style={
                                      { padding: 5,
                                         borderColor: 'black', 
                                         borderWidth: 2 ,
                                        borderRadius: 5}
                                      }
                                        onPress={() => acceptOrRejectRider(rider['rider_id'], ride['ride_id'], true)}
                                      >
                                      <Text>Accept</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={
                                      { padding: 5,
                                         borderColor: 'black', 
                                         borderWidth: 2 ,
                                        borderRadius: 5}
                                      }
                                      onPress={() => acceptOrRejectRider(rider['rider_id'], ride['ride_id'], false)}
                                      >
                                      <Text>Reject</Text>
                                    </TouchableOpacity>
                                    </View>

                            </View>
                        )
                    }
                )}

            </View>
        )
      })}
      </ScrollView>
</>
        
    )
}

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
    backBtnContainer:{
      width: "100%",
      marginVertical: 10
    },
    backbtn:{
      width: 60,
      height: 50,
      marginLeft: 10,

    },
  });