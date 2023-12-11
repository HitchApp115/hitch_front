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
import axios from "axios";
import back from "../assets/back.png";
// set where the backend is running here

const AccountCreationPage = ({ setChildIdx, storeToken, page, background }) => {
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


  // checks if any of the input fields are incorrect
  function checkStateVariables() {
    for (let variable of stateVariables) {
      // checks if any of the input fields are empty
      if (variable.trim() === "") {
        setSubmitError(true);
        alert("Please fill in all fields.");
        break;
      }
      // checks if phone number is a number
      if ((variable = create_number)) {
        if (isNaN(variable)) {
          setSubmitError(true);
          SetIsNumber(false);
          alert("Please enter a valid phone number.");
          break;
        }
      }
      // checks if passwords match
      if ((variable = create_password_confirm)) {
        if (variable != create_password) {
          setSubmitError(true);
          alert("Passwords do not match.");
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
        const response =  await axios.post(
          `${page}/account/create`, {
            first_name: create_first_name,
            last_name: create_last_name,
            username: create_username,
            email: create_email,
            password: create_password,
            phone: create_number,
          })
          .then(response => {
            setChildIdx(2)
          })
          .catch(response => {
            alert(response.response.data.message)
          })
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
  };

  return (
    <ImageBackground
      source={background}
      style={AccountStyles.backgroundImage}
    >
      
      <KeyboardAvoidingView
        style={AccountStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
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

      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const AccountStyles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or 'stretch'
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "30%",
  },
  styleScrollview: {
    flex: 1,
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
