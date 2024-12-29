import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WelcomeScreen = ({ navigation }) => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");

        if (!hasLaunched) {
          await AsyncStorage.setItem("hasLaunched", "true");
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error("Errore con AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    checkFirstLaunch();
  }, []);

  useEffect(() => {
    if (!loading && isFirstLaunch === false) {
      navigation.replace("HomeScreen");
    }
  }, [loading, isFirstLaunch, navigation]);

  if (loading || isFirstLaunch === null) {
    return (
      <View style={style.container}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={style.loadingText}>Caricamento...</Text>
      </View>
    );
  }

  if (isFirstLaunch) {
    return (
      <View style={style.container}>
        <Text style={style.titolo}>Benvenuto!</Text>
        <Text style={style.sottotitolo}>
          Questa applicazione è stata creata tenendo conto del calcolo delle
          medie con il valore dei voti pratici di un terzo.
        </Text>
        <Text style={style.sottotitoloAllert}>
          Se avevi una versione precedente dell' app prima di aggiungere voti svuota la memoria e riapri l'app
        </Text>
        <TouchableOpacity
          style={style.button}
          onPress={() => navigation.replace("HomeScreen")}
        >
          <Text style={style.buttonText}>Continua</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null; //Mostra nulla
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 20,
  },
  titolo: {
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 30,
    textAlign: "center",
  },
  sottotitolo: {
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center",
  },
  sottotitoloAllert: {
    color: "#ff3b30",
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#333",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    color: "#ffffff",
    marginTop: 10,
    fontSize: 16,
  },
});

export default WelcomeScreen;
