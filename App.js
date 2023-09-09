import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
import HomeScreen from './screens/HomeScreen';
import Signup from './screens/SignUp';
import ChatDetails from './screens/ChatDetails';

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="Welcome" component={AuthStack} />
        <Stack.Screen name="Home" component={HomeScreen} ></Stack.Screen>
        <Stack.Screen name='ChatDetails' component={ChatDetails}>
        </Stack.Screen>
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}