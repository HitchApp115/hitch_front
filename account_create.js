import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import InputField from './InputField';

// const AccountCreationPage = ({ navigation }) => {
//   const [create_first_name, SetCreateFirstName] = useState("");
//   const [create_last_name, SetCreateLastName] = useState("");
//   const [create_email, SetCreateEmail] = useState("");
//   const [create_number, SetCreateNumber] = useState("");
//   const [create_password, SetCreatePassword] = useState("");
//   const [create_password_confirm, SetCreatePasswordConfirm] = useState("");

//   return (
//     <View style={AccountStyles.container}>
//       <InputField
//         label="First Name"
//         value={create_first_name}
//         onChangeText = {SetCreateFirstName}
//       />
//       <InputField
//         label="Last Name"
//         value={create_last_name}
//         onChangeText = {SetCreateLastName}
//       />
//       <InputField
//         label="Email"
//         value={create_email}
//         onChangeText = {SetCreateEmail}
//       />
//       <InputField
//         label="Phone Number"
//         value={create_number}
//         onChangeText = {SetCreateNumber}
//       />
//       <InputField
//         label="Password"
//         value={create_password}
//         onChangeText = {SetCreatePassword}
//       />
//       <InputField
//         label="Confirm Password"
//         value={create_password_confirm}
//         onChangeText = {SetCreatePasswordConfirm}
//       />

//       <TouchableOpacity style={AccountStyles.loginBtn} onPress={console.log("make it ")}>
//         <Text style={AccountStyles.loginText}>Create</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const AccountStyles = StyleSheet.create({
//   container: {
//     flex: 1,
    
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   forgot_button: {
//     height: 30,
//     marginBottom: 30,
//   },
//   loginBtn: {
//     width: '80%',
//     borderRadius: 25,
//     height: 50,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 40,
//     backgroundColor: '#FF1493',
//   },
// });

const AccountCreationPage = ({ navigation }) => {
  const [create_first_name, SetCreateFirstName] = useState("");
  const [create_last_name, SetCreateLastName] = useState("");
  const [create_email, SetCreateEmail] = useState("");
  const [create_number, SetCreateNumber] = useState("");
  const [create_password, SetCreatePassword] = useState("");
  const [create_password_confirm, SetCreatePasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = () => {
    // Add validation here
    setIsLoading(true);
    setSubmitError("");

    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      setSubmitError("An error occurred while submitting the form.");
    }, 2000);
  };

  return (
    <View style={AccountStyles.container}>
      <ScrollView style = {AccountStyles.styleScrollview}>
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
      />
      <InputField
        label="Password"
        value={create_password}
        onChangeText={SetCreatePassword}
        secureTextEntry
      />
      <InputField
        label="Confirm Password"
        value={create_password_confirm}
        onChangeText={SetCreatePasswordConfirm}
        secureTextEntry
      />
           <TouchableOpacity
        style={AccountStyles.loginBtn}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={AccountStyles.loginText}>Create</Text>
        )}
      </TouchableOpacity>

      {submitError ? (
        <Text style={AccountStyles.errorText}>{submitError}</Text>
      ) : null}
      </ScrollView>


 
    </View>
  );
};

const AccountStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    // marginTop: 70,
    justifyContent: "flex-start",
  },
  styleScrollview:{
    flex: 1,
    backgroundColor: "blue",
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
