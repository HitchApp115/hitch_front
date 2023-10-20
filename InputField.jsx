
import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet } from 'react-native';



const InputField = ({ label, value, onChangeText }) => {
    const [showClearButton, setShowClearButton] = useState(false);
  
    const handleTextChange = (text) => {
      onChangeText(text);
      setShowClearButton(text.length > 0);
    };
  
    const handleClearButtonPress = () => {
      onChangeText("");
      setShowClearButton(false);
    };
  
    return (
      <View style={inputStyles.inputView}>
        <TextInput
          style={inputStyles.TextInput}
          value={value}
          placeholder={label}
          placeholderTextColor="#003f5c"
          onChangeText={handleTextChange}
        />
        {showClearButton && (
          <Pressable
            style={inputStyles.clearButton}
            onPress={handleClearButtonPress}
          >
            <Text>x</Text>
          </Pressable>
        )}
      </View>
    );
  };

  const inputStyles = StyleSheet.create({
    inputView: {
      flexDirection: 'row',
      backgroundColor: 'white',
      borderRadius: 10,
      borderWidth: 2,
      width: '80%',
      height: 55,
      marginBottom: 10,
      alignItems: 'center',
    },
    TextInput: {
      height: 50,
      flex: 1,
      padding: 10,
      marginLeft: 20,
    },
    clearButton: {
      padding: 10,
      marginRight: 6,
    },
  });
  


  export default InputField;

