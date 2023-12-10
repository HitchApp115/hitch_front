import React from 'react';
import { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ImageBackground, Image} from 'react-native';
import axios from 'axios';
import background from './assets/background2.png';
import back from './assets/back.png';
const API_URL = 'https://api.example.com';




const ActivePassenger = ({page, token, setChildIdx, activeRides}) => {




  const ConfirmPickup = async (riderId, rideId) => {
    const requestData = {
      rideId,  // replace with actual ride ID
      riderId // replace with actual rider ID
    };


    axios.post(`${page}/rides/pickup`, requestData, {
      headers: {
        Authorization: token
      }
    })
    .then(response => {
      // Handle the response data
      
      setChildIdx(2)
    })
    .catch(error => {
      // Handle errors here
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

      } else if (error.request) {
        // The request was made but no response was received
      } else {
        // Something happened in setting up the request that triggered an Error
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

        {activeRides.map(
          activeRide => <View>
              <View style={styles.container}>
                <Text>Active Ride</Text>
                <Text>Rider ID: {activeRide['rider_id']}</Text>
                <Text>Ride ID: {activeRide['ride_id']}</Text>
                <TouchableOpacity style={styles.select_box} onPress={() => ConfirmPickup(activeRide['rider_id'], activeRide['ride_id'])}>
            <Text>Confirm Pickup</Text>
          </TouchableOpacity>
            </View>
            </View>
        )}
      
      

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
