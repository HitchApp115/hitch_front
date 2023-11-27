import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Icon } from "react-native-elements"; // You might need to install react-native-elements
import account_icon from "./assets/account_icon.png";
import x_fill from "./assets/x_fill.png";


const AccountSettings = ({ UserName, Email, PhoneNumber, setChilDIdx }) => {
  const [showAccountInfo, setShowAccountInfo] = useState(false);

  if (!UserName) {
    UserName = "Loading...";
  }

  if (!Email) {
    Email = "Loading...";
  }
  if (!PhoneNumber) {
    PhoneNumber = "Loading...";
  }
  const toggleAccountInfo = () => {
    setShowAccountInfo(!showAccountInfo);
  };

  const handleLogout = () => {
    // Handle logout logic here
    setChilDIdx(0);
    console.log("Logged out");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleAccountInfo} style = {[styles.icon, !showAccountInfo && { borderWidth: 3, borderColor: "black" }]}>
        {!showAccountInfo &&   <Image source={account_icon} />}
        {showAccountInfo && <Image source={x_fill} />}

      </TouchableOpacity>

      {showAccountInfo && (
        <View style={styles.accountInfo}>
          <View style={styles.account_container}>
            <View>
              <Text style={[styles.Account_info, ]}>
                Account Information
              </Text>
            </View>
            <View style={styles.info_container}>
              <Text style={styles.header}>Username</Text>
              <Text>{UserName}</Text>
            </View>
            <View style={styles.info_container}>
              <Text style={styles.header}>Email</Text>
              <Text >{Email}</Text>
            </View>
            <View style={styles.info_container}>
              <Text style={styles.header}>Phone Number</Text>
              <Text >{PhoneNumber}</Text>
            </View>

            {/* Display account information here */}
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    top: "20%",
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
  Account_info: {
    fontSize: 20,
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
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AccountSettings;