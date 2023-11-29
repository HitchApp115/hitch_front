import React, {useState} from "react";
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
  } from "react-native";
  import back from "./assets/back.png";
import { useScrollToTop } from "@react-navigation/native";

export default PendingRidesPage = ({ setChildIdx }) => {
    const [rides, setRides] = useState([
        {rideId: '1111', startPoint: 'Here', endPoint: 'There', scheduledTime: '5:00 pm', requestingRiders: [{name: 'Josh D', rating: '5.00', distance: '0.5', image: 'https://media.licdn.com/dms/image/D5635AQF0qN5pvl_QNQ/profile-framedphoto-shrink_200_200/0/1699657029720?e=1701842400&v=beta&t=OuNVi58VoOwLRxt-Q6oeK-l9gcQV9ELXyrVkkddMfL8'}]}
    ])


    return  (
    <ImageBackground
        source={require("./assets/background.png")}
        style={AccountStyles.backgroundImage}
    >
    
     <TouchableOpacity onPress={() => setChildIdx(2)} style = {AccountStyles.backBtnContainer}>
        <Image source={back} style={AccountStyles.backbtn}/>
      </TouchableOpacity>

      {rides.map((ride, idx) => {

        return(
            <View
            key={idx}
                style={{backgroundColor: 'white',
                    width: '90%',
                    marginHorizontal: '5%'
                    }}
            >
                <Text>Ride {ride.rideId}</Text>
                <Text>Start Point: {ride.startPoint}</Text>
                <Text>End Point: {ride.endPoint}</Text>
                <Text>Departure Time: {ride.scheduledTime}</Text>
                {ride.requestingRiders.map(
                    (rider, nestedIdx) => {
                        return (
                            <View
                                key={idx+'-'+nestedIdx}
                                style={{
                                    width: '90%',
                                    marginLeft: '10%'
                                }}
                            >
                                <Text>Rider: {rider.name}</Text>
                                <Text>Rating: {rider.rating}</Text>
                                <Text>Distance: {rider.distance}</Text>
                                <Image source={{uri: rider.image}} style={{
                                    width: 100,
                                    height: 100
                                }}/>

                                <View
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 10
                                    }}
                                >
                                    <TouchableOpacity style={{ backgroundColor: 'blue', }}><Text>Accept</Text></TouchableOpacity>
                                    <TouchableOpacity style={{backgroundColor: 'red'}}><Text>Reject</Text></TouchableOpacity>
                                    </View>

                            </View>
                        )
                    }
                )}

            </View>
        )
      })}

        
    </ImageBackground>
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
      marginTop: 50
    },
    backbtn:{
      width: 60,
      height: 50,
      marginBottom: 30,
      marginLeft: 10,

    },
  });