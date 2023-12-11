import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Icon } from "react-native-elements"; // You might need to install react-native-elements
import account_icon from "../assets/account_icon.png";
import x_fill from "../assets/x_fill.png";
import axios from "axios";

const AccountSettings = ({ setChilDIdx, removeToken, token, page }) => {
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [username, setUsername] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");
  const [phone, setPhone] = useState("Loading...");

  const [shouldDisplayCompletedRides, setShouldDisplayCompletedRides] =
    useState(false);
  const [isLoadingCompletedRides, setIsLoadingCompletedRides] = useState(false);
  const [completedRides, setCompletedRides] = useState([]);
  const [completedDrives, setCompletedDrives] = useState([]);

  useEffect(() => {
    if (!showAccountInfo) {
      return;
    }
    downloadProfileData();
  }, [token, showAccountInfo]);

  useEffect(() => {
    if (!shouldDisplayCompletedRides) return;
    setIsLoadingCompletedRides(true);
    setCompletedDrives([]);
    downloadCompletedRides();
  }, [shouldDisplayCompletedRides]);

  const downloadCompletedRides = () => {
    setCompletedRides([]);
    setCompletedDrives([]);
    axios
      .get(`${page}/rides/completedByRider`, {
        headers: {
          Authorization: token,
        },
      })
      .then((resp) => {
        setIsLoadingCompletedRides(false);
        setCompletedRides(resp.data.rides);
      });

    axios
      .get(`${page}/rides/completedByDriver`, {
        headers: {
          Authorization: token,
        },
      })
      .then((resp) => {
        setIsLoadingCompletedRides(false);
        setCompletedDrives(resp.data.rides);
      });
  };

  const downloadProfileData = () => {
    axios
      .get(`${page}/account/info`, {
        headers: {
          authorization: token,
        },
      })
      .then((resp) => {
        let accountInfo = resp.data.accountInfo[0];
        setUsername(accountInfo.username);
        setEmail(accountInfo.email);
        setPhone(accountInfo["phone_num"]);
      });
  };

  const toggleAccountInfo = () => {
    setShowAccountInfo(!showAccountInfo);
  };

  const handleLogout = () => {
    // Handle logout logic here
    setChilDIdx(0);
    removeToken();
    setShouldDisplayCompletedRides(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleAccountInfo}
        style={[
          styles.icon,
          !showAccountInfo && { borderWidth: 3, borderColor: "black" },
        ]}
      >
        {showAccountInfo ? (
          <Image source={x_fill} />
        ) : (
          <Image source={account_icon} />
        )}
      </TouchableOpacity>

      {showAccountInfo &&
        (shouldDisplayCompletedRides ? (
          <View style={{ ...styles.accountInfo }}>
            <View>
              <Text style={[styles.accountInfoTitle]}>Completed Rides</Text>
            </View>

            {isLoadingCompletedRides ? (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                style={{ marginTop: 20 }}
              />
            ) : (
              <View
                style={{
                  marginTop: 50,
                  height: "75%",
                  flexDirection: "column",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.accountInfoText]}>Rides Taken</Text>
                  <ScrollView>
                    {!completedRides.length ? (
                      <Text
                        style={{
                          ...styles.rideDataTitle,
                          fontSize: 16,
                          textAlign: "center",
                          marginTop: 20,
                        }}
                      >
                        No Rides Taken Yet
                      </Text>
                    ) : null}
                    {completedRides.map((ride, idx) => (
                      <View key={idx} style={styles.completedRideBox}>
                        <Text style={styles.rideInfoText}>
                          <Text style={styles.rideDataTitle}>Ride Id: </Text>
                          {ride["ride_id"]}
                        </Text>
                        <Text style={styles.rideInfoText}>
                          <Text style={styles.rideDataTitle}>
                            Start Point:{" "}
                          </Text>
                          {ride["start_point"].split(":")[0]}
                        </Text>
                        <Text style={styles.rideInfoText}>
                          <Text style={styles.rideDataTitle}>End Point: </Text>
                          {ride["destination"].split(":")[0]}
                        </Text>
                        <Text style={styles.rideInfoText}>
                          <Text style={styles.rideDataTitle}>Ride Cost: </Text>$
                          {ride["rider_cost"]}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...styles.accountInfoText }}>Drives Made</Text>
                  <ScrollView>
                    {!completedDrives.length ? (
                      <Text
                        style={{
                          ...styles.rideDataTitle,
                          fontSize: 16,
                          textAlign: "center",
                          marginTop: 20,
                        }}
                      >
                        No Drives Taken Yet
                      </Text>
                    ) : null}

                    {completedDrives.map((ride, idx) => (
                      <View key={idx} style={styles.completedRideBox}>
                        <Text style={styles.rideInfoText}>
                          <Text style={styles.rideDataTitle}>Ride Id: </Text>
                          {ride["ride_id"]}
                        </Text>
                        <Text style={styles.rideInfoText}>
                          <Text style={styles.rideDataTitle}>
                            Start Point:{" "}
                          </Text>
                          {ride["start_point"].split(":")[0]}
                        </Text>
                        <Text style={styles.rideInfoText}>
                          <Text style={styles.rideDataTitle}>End Point: </Text>
                          {ride["destination"].split(":")[0]}
                        </Text>
                        <Text style={styles.rideInfoText}>
                          <Text style={styles.rideDataTitle}>
                            Amount Made:{" "}
                          </Text>
                          ${ride["driver_earnings"]}
                        </Text>
                        <Text style={styles.rideInfoText}>
                          <Text style={styles.rideDataTitle}>Time Taken: </Text>
                          {ride["duration"]}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}
            <View>
              <TouchableOpacity
                onPress={() => setShouldDisplayCompletedRides(false)}
                style={{ ...styles.completedRidesButton, marginTop: 20 }}
              >
                <Text>Show Account Info</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.accountInfo}>
            <View style={styles.account_container}>
              <View>
                <Text style={[styles.accountInfoTitle]}>
                  Account Information
                </Text>
              </View>
              <View style={styles.info_container}>
                <Text style={styles.header}>Username</Text>
                <Text>{username}</Text>
              </View>
              <View style={styles.info_container}>
                <Text style={styles.header}>Email</Text>
                <Text>{email}</Text>
              </View>
              <View style={styles.info_container}>
                <Text style={styles.header}>Phone Number</Text>
                <Text>{phone}</Text>
              </View>

              {/* Display account information here */}
              <TouchableOpacity
                onPress={handleLogout}
                style={styles.logoutButton}
              >
                <Text>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShouldDisplayCompletedRides(true)}
                style={styles.completedRidesButton}
              >
                <Text>Show Completed Rides</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // top: 100,
    // height: "100%",
    // backgroundColor: "transparent",
    // backgroundColor: "yellow",
    zIndex: 1000,
  },
  account_container: {
    display: "flex",
    flexDirection: "column",
    height: "60%",
  },
  info_container: {
    // height: "20%",
    marginTop: 40,
  },
  icon: {
    backgroundColor: "white",

    borderRadius: 20,
    position: "absolute",
    zIndex: 3000,
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    top: 100,
    right: 20,
  },
  accountInfoText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
  },
  accountInfoTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
  },
  accountInfo: {
    top: 0,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    height: "100%",
    width: "100%",
    // position: "absolute",
    zIndex: 2000,
    paddingTop: 70,

    // Add more styling for the account info section
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 100,
    backgroundColor: "#FFC5C5",
    padding: 10,
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  completedRidesButton: {
    marginTop: 20,
    backgroundColor: "#FFC5C5",
    padding: 10,
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  completedRideBox: {
    marginTop: 10,
    padding: 10,
    borderWidth: 2,
    borderRadius: 5,
  },
  rideDataTitle: {
    fontWeight: "bold",
  },
  rideInfoText: {
    marginBottom: 2,
  },
});

export default AccountSettings;
