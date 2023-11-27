import React, { useState, useEffect } from "react";
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
import InputField from "./InputField";
import { Button } from "react-native-web";
import axios from "axios";
import back from "./assets/back.png";
// set where the backend is running here

const AccountCreationPage = ({ setChildIdx, storeToken, page }) => {
  const [create_first_name, SetCreateFirstName] = useState("");
  const [create_last_name, SetCreateLastName] = useState("");
  const [create_username, SetCreateUsername] = useState("");
  const [create_email, SetCreateEmail] = useState("");
  const [create_number, SetCreateNumber] = useState("");
  const [isnumber, SetIsNumber] = useState(true);

  const [create_password, SetCreatePassword] = useState("");
  const [create_password_confirm, SetCreatePasswordConfirm] = useState("");
  const [submitError, setSubmitError] = useState("");

  const stateVariables = [
    create_first_name,
    create_last_name,
    create_username,
    create_email,
    create_number,
    create_password,
    create_password_confirm,
  ];

  const data = () => ({
    username: create_username,
    email: create_email,
    password: create_password,
    phone: create_number,
  });

  // console.log("111:", process.env, process.env?.ENVIORNMENT);

  // checks if any of the input fields are incorrect
  function checkStateVariables() {
    for (let variable of stateVariables) {
      // checks if any of the input fields are empty
      if (variable.trim() === "") {
        setSubmitError(true);
        alert("Please fill in all fields.");
        console.log("empty");
        break;
      }
      // checks if phone number is a number
      if ((variable = create_number)) {
        if (isNaN(variable)) {
          setSubmitError(true);
          SetIsNumber(false);
          alert("Please enter a valid phone number.");
          console.log("not a number");
          break;
        }
      }
      // checks if passwords match
      if ((variable = create_password_confirm)) {
        if (variable != create_password) {
          setSubmitError(true);
          alert("Passwords do not match.");
          console.log("passwords dont match");
          break;
        }
      }
    }
  }
  const Reset = () => {
    SetIsNumber(true);
  };

  const backBtnPressed = () => {
    setChildIdx(0);
  };

  const [status, setStatus] = useState({});
  const handleSubmit = async () => {
    checkStateVariables();
    if (submitError) {
      return;
    } else {
      // setChildIdx(2);
      try {
        // getting back { status: 'success', loginToken: {TOKEN} }
        // sends a request to the backend to create an account
        console.log("FUCK", page + "/account/create");
        console.log(data());
        //const response = await axios.post(page + "/account/create", data);
        const response = await axios.post(
          // "http://localhost:3000/account/create",
          page+"/account/create",
          data()
        );
        // the backend will send back a status of success if the account was created
        if (response.data.status === "success") {
          console.log("account successfully created");
          setStatus(response.data.status);
          // storeToken(response.data.loginToken);
          console.log(response.data);
          console.log(response.data.status);
          console.log(response.data.loginToken);
          setChildIdx(2);
        } else {
          {
            console.log("error");
          }
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
  };

  return (
    <ImageBackground
      source={require("./assets/background.png")}
      style={AccountStyles.backgroundImage}
    >
      
      <KeyboardAvoidingView
        style={AccountStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* <View style={AccountStyles.container}> */}
      <TouchableOpacity onPress={backBtnPressed} style = {AccountStyles.backBtnContainer}>
                <Image source={back} style={AccountStyles.backbtn}/>
      </TouchableOpacity>
        <InputField
          label="First Name"
          value={create_first_name}
          onChangeText={SetCreateFirstName}
        />
        <InputField
          label="Last Name"
          value={create_last_name}
          onChangeText={SetCreateLastName}
        />
        <InputField
          label="Username"
          value={create_username}
          onChangeText={SetCreateUsername}
        />
        <InputField
          label="Email"
          value={create_email}
          onChangeText={SetCreateEmail}
        />
        <InputField
          label="Phone Number"
          value={create_number}
          onChangeText={SetCreateNumber}
          extraStyles={!isnumber ? { borderColor: "red" } : null}
        />
        <InputField
          label="Password"
          value={create_password}
          onChangeText={SetCreatePassword}
          secure={true}
        />
        <InputField
          label="Confirm Password"
          value={create_password_confirm}
          onChangeText={SetCreatePasswordConfirm}
          secureTextEntry
          secure={true}
        />
        <TouchableOpacity style={AccountStyles.loginBtn} onPress={handleSubmit}>
          <Text style={AccountStyles.loginText}>Create</Text>
        </TouchableOpacity>

        {submitError ? (
          <Text style={AccountStyles.errorText}>{submitError}</Text>
        ) : null}

        {/* </View> */}
      </KeyboardAvoidingView>
    </ImageBackground>
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
  backBtnContainer:{
    width: "100%",
  },
  backbtn:{
    width: 60,
    height: 50,
    marginBottom: 30,
    marginLeft: 10,
  },
});

export default AccountCreationPage;
