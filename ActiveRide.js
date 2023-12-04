import { func } from "prop-types";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import back from "./assets/back.png";
import axios from "axios";

export default function ActiveRide({ setChildIdx, removeToken, token, page}) {



    async function getActiveRide() {
        axios.get(`${page}/rides/active`, {
            headers: {
              'Authorization': token
            }
          })
          .then(response => {
            console.log('Status:', response.status);
            console.log('Data:', response.data);
          })
          .catch(error => {
            if (error.response) {
              // Request made and server responded
              console.log('Error data:', error.response.data);
              console.log('Error status:', error.response.status);
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
    }, []);


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

        <ScrollView style={styles.Gps}>
            <View>
                <TouchableOpacity>
                    <Text>Gps</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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