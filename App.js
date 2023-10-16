import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import LoginPage from './login';
import Account_creation_page from './account_creation_page';
import { useState } from 'react';
// import { ScrollView } from 'react-native-web';



export default function App() {
  const [login_email, SetLoginEmail] = useState("bob");
  const [login_password, SetLoginPassword] = useState("1234");
 
  const[login_user, setLogInUser] = useState({
    login_email:'',
    login_password:'',
  });

  const [createUser, setCreateUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  return (

    <View style = {mainStyles}>
    
      <LoginPage login_user={login_user} setLogInUser={setLogInUser}/>
      {/* <Account_creation_page createUser={createUser} setCreateUser={setCreateUser}/> */}
    
    </View>
    

  );

}

const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  }
});

