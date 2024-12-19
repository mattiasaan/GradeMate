import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = ({ navigation }) => {
  /*
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        const storedUsername = await AsyncStorage.getItem('username');
        const storedPassword = await AsyncStorage.getItem('password');

        if (storedUsername) setUsername(storedUsername);
        if (storedPassword) setPassword(storedPassword);
        if (!hasLaunched || !storedUsername || !storedPassword) {
          await AsyncStorage.setItem('hasLaunched', 'true');
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error('Errore con AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    checkFirstLaunch();
  }, []);

  const saveAndContinue = async () => {
    if (!username || !password) {
      Alert.alert('Errore', 'Per favore, inserisci sia username che password.');
      return;
    }

    try {
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('password', password);

      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Errore', 'Si è verificato un errore durante il salvataggio delle credenziali.');
    }
  };

  if (loading) {
    return (
      <View style={style.container}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={style.loadingText}>Caricamento...</Text>
      </View>
    );
  }

  if (isFirstLaunch === false) {
    navigation.replace('Home');
    return null;
  }

  return (
    <View style={style.container}>
      <Text style={style.titolo}>
        Benvenuto!{"\n"}{"\n"}Inserisci le credenziali di Classeviva
      </Text>
      <TextInput
        style={style.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={style.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={style.button} onPress={saveAndContinue}>
        <Text style={style.buttonText}>Accedi</Text>
      </TouchableOpacity>
    </View>
  );*/
};
/*
const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 20,
  },
  titolo: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 20,
    fontSize: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1F1F1F',
    color: '#ffffff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    width: '100%',
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
  },
});
*/
export default WelcomeScreen;
