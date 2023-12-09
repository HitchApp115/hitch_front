import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';

const API_URL = 'https://api.example.com';

const sendRequest = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log(response.data);
    // Handle the API response here
  } catch (error) {
    console.error(error);
    // Handle the error here
  }
};

const ActivePassenger = () => {
  return (
    <View>
      <TouchableOpacity onPress={sendRequest}>
        
        <Text>Send Request</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActivePassenger;
