import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ImageBackground,
} from "react-native";
import InputField from "./InputField";
import { Button } from "react-native-web";
import axios from "axios";

const AccountCreationPage = ({ navigation }) => {
  const [create_first_name, SetCreateFirstName] = useState("");
  const [create_last_name, SetCreateLastName] = useState("");
  const [create_email, SetCreateEmail] = useState("");
  const [create_number, SetCreateNumber] = useState("");
  const [isnumber, SetIsNumber] = useState(true);

  const [create_password, SetCreatePassword] = useState("");
  const [create_password_confirm, SetCreatePasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const stateVariables = [
    create_first_name,
    create_last_name,
    create_email,
    create_number,
    create_password,
    create_password_confirm,
  ];

  console.log("111:", process.env, process.env?.ENVIORNMENT);

  function notEmpty() {
    for (let variable of stateVariables) {
      if (variable.trim() === "") {
        setSubmitError(true);
        console.log("empty");
      }
      if ((variable = create_number)) {
        if (isNaN(variable)) {
          setSubmitError(true);
          SetIsNumber(false);
          console.log("not a number");
        }
      }
    }
  }
  const Reset = () => {
    SetIsNumber(true);
  };

  const handleSubmit = async () => {
    Reset();
    console.log("submitted account creation");
    notEmpty();
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
});

export default AccountCreationPage;
