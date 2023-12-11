import React from "react";
import { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import axios from "axios";
import background from "../assets/background2.png";
import back from "../assets/back.png";

const ActivePassenger = ({ page, token, setChildIdx, activeRides }) => {
  const ConfirmPickup = async (riderId, rideId) => {
    const requestData = {
      rideId, // replace with actual ride ID
      riderId, // replace with actual rider ID
    };

    axios
      .post(`${page}/rides/pickup`, requestData, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        // Handle the response data
        alert("Thank you for using Hitch! Enjoy your ride!")
        setChildIdx(2);
      })
      .catch((error) => {
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
  };

  return (
    <ImageBackground source={background} style={styles.backgroundImage}>
      <View style={{ flex: 1, width: "100%", height: "100%", marginTop: 50 }}>
        <View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.containerForButtons}>
              <TouchableOpacity onPress={() => setChildIdx(2)}>
                <Image source={back} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                padding: 5,
                borderRadius: 5,
                fontSize: 30,
                textAlign: "center",
                backgroundColor: "white",
                width: "70%",
                marginLeft: "4%",
                marginRight: "auto",
                marginTop: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  textAlign: "center",
                }}
              >
                Active Rides
              </Text>
            </View>
          </View>

          <View style={{ marginTop:150, backgroundColor: 'white', width: '80%', borderRadius: 5, marginLeft: '10%'}}>
          <View style={
            {
              backgroundColor: '#d8dbc8',
              padding: 10,
              width: '80%',
              marginLeft: '10%',
             marginTop: 10,
              borderRadius: 5,
            }}>
            <Text style={{fontSize: 20}}>Awaiting Pickup. Confirm pickup once driver has arrived.</Text>

            <Text style={{fontSize: 15, marginTop: 5}}> <Text style={{fontWeight: 'bold'}}>Pickup Location: </Text>{activeRides[0]['pickup_spot'].split(':')[0]}</Text>
          </View>

          <TouchableOpacity
            style={styles.select_box}
            onPress={() =>
              {
                ConfirmPickup(activeRides[0]["rider_id"], activeRides[0]["ride_id"])
              
              }
            }
          >
            <Text style={{fontSize: 18}}>Confirm Pickup</Text>
          </TouchableOpacity>

          </View>

          
        </View>
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
    backgroundColor: "lightblue",
    margin: 10,
    borderRadius: 5,
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
    marginTop: 50,
    width: '50%',
    marginLeft: '25%',
    padding: 10,
    borderWidth: 2

  },
});

export default ActivePassenger;
