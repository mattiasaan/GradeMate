import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Screens/HomeScreen';
import AggiungiVotiScreen from './Screens/AggiungiVoti';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#121212',
    text: '#ffffff',
    card: '#1F1F1F',
    border: '#333',
  },
};

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: {
            backgroundColor: '#121212',
            borderTopColor: '#333',
          },
          tabBarActiveTintColor: '#76FF03',
          tabBarInactiveTintColor: '#888',
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Aggiungi Voti') {
              iconName = 'add-circle';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Aggiungi Voti" component={AggiungiVotiScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

/*
 __  __       _   _   _                       
|  \/  | __ _| |_| |_(_) __ _ ___  __ _ _ __  
| |\/| |/ _` | __| __| |/ _` / __|/ _` | '_ \ 
| |  | | (_| | |_| |_| | (_| \__ \ (_| | | | |
|_|  |_|\__,_|\__|\__|_|\__,_|___/\__,_|_| |_|
*/