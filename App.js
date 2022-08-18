import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/containers/Home'
import ForwardingScreen from './src/containers/Forwarding'
import BangkokTrackingScreen from './src/containers/BangkokTracking'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Forwarding" component={ForwardingScreen} />
        <Stack.Screen name="BangkokTracking" component={BangkokTrackingScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}