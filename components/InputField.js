
import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet,Image } from 'react-native';



const InputField = ({ label, value, onChangeText, secure, extraStyles }) => {
    const [showClearButton, setShowClearButton] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleTextChange = (text) => {
      onChangeText(text);
      setShowClearButton(text.length > 0);
    };
  
    const handleClearButtonPress = () => {
      onChangeText("");
      setShowClearButton(false);
    };
    
    return (
      <View style={[inputStyles.inputView, isFocused && inputStyles.focusedTextInput, extraStyles]}>
        <TextInput
          style={[inputStyles.TextInput,]}
          onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          value={value}
          placeholder={label}
          placeholderTextColor="#003f5c"
          onChangeText={handleTextChange}
          secureTextEntry = {secure}
        />
        {showClearButton && (
          <Pressable
            style={inputStyles.clearButton}
            onPress={handleClearButtonPress}
          >
            <Image style={inputStyles.clearIcon} source={require('../assets/remove.png')} />
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
    focusedTextInput: {
    //   borderColor: 'blue',
      backgroundColor: 'lightgrey',
      borderWidth: 4,
    },
    clearIcon: {
      marginLeft: 19,
      width: 20,
      height: 20,
    },
  });
  


  export default InputField;

