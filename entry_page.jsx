import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const EntryPage = ({ onPress1, onPress2 }) => {
  const styles = StyleSheet.create({
    button: {
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: 'white',
    },
    buttonBlue: {
      backgroundColor: 'blue',
    },
    buttonRed: {
      backgroundColor: 'red',
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to my landing page!</Text>
      <Pressable style={[styles.button, styles.buttonBlue]} onPress={onPress1}>
        <Text style={styles.buttonText}>Pressable 1</Text>
      </Pressable>
      <Pressable style={[styles.button, styles.buttonRed]} onPress={onPress2}>
        <Text style={styles.buttonText}>Pressable 2</Text>
      </Pressable>
    </View>
  );
};

export default EntryPage;