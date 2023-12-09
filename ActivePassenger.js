import React from 'react';
import { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ImageBackground, Image} from 'react-native';
import axios from 'axios';
import background from './assets/background2.png';
import back from './assets/back.png';
const API_URL = 'https://api.example.com';




const ActivePassenger = ({page, token, setChildIdx}) => {

  const [showActiveRide, setShowActiveRide] = useState(false);
  const [rider_id, setRiderId] = useState("");
  const [rideId, setRideId] = useState("" );

  async function rideAwaitingPickup() {
    console.log("token", token, page);
    axios.get(`${page}/account/rideAwaitingPickup`, {
      headers: {
        Authorization: token
      }
    })
    .then(response => {
      // Handle the response data
      console.log('Rides Awaiting Pickup:', response.data);
      if (response.data.rides.length > 0) {
        // setChildIdx(7);
        setShowActiveRide(true);
      }
      else {
        return;
      }
      // setShowActiveRide(true);
      setRiderId(response.data.rides[0].rider_id);
      setRideId(response.data.rides[0].ride_id);
      // setShowActiveRide(true);
    })
    .catch(error => {
      // Handle errors here
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    });
}

async function ConfirmPickup() {
  const requestData = {
    rideId: rideId,  // replace with actual ride ID
    riderId: rider_id // replace with actual rider ID
  };


  axios.post(`${page}/rides/pickup`, requestData, {
    headers: {
      Authorization: token
    }
  })
  .then(response => {
    // Handle the response data
    console.log('Response:', response.data);
  })
  .catch(error => {
    // Handle errors here
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log('Error Response:', error.response.data);
      console.log('Status:', error.response.status);
      console.log('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.log('Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error Message:', error.message);
    }
  });
}


  return (


    <ImageBackground source={background} style={styles.backgroundImage}>
      <View >
      <View>
        <TouchableOpacity onPress={() => setChildIdx(2)}>
          <Image source={back} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style ={styles.select_box} onPress={()=>{rideAwaitingPickup()}}>
        <Text>Check For active Rides</Text>
      </TouchableOpacity>
      {showActiveRide && 
        <View >
          <View style={styles.container}>
          <Text>Active Ride</Text>
          <Text>Rider ID: {rider_id}</Text>
          <Text>Ride ID: {rideId}</Text>
        </View>
        <TouchableOpacity style={styles.select_box} onPress={ConfirmPickup}>
            <Text>Confirm Pickup</Text>
          </TouchableOpacity>
        </View>
      
      

      } 
    </View>
    </ImageBackground>
    
  );
};


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or 'stretch'
    justifyContent: "center",
    alignItems: "center",
  },
  container: {

    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  select_box: {
    // height: "25%",
    height: 100,
    backgroundColor: "lightblue",
    margin: 10,
    borderRadius: 10,
    // width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});


export default ActivePassenger;
