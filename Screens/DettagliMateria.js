import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DettagliMateriaScreen = ({ route }) => {
  const { nomeMateria, updateMaterie } = route.params; // Ora passiamo anche updateMaterie
  const [voti, setVoti] = useState({});

  //recupera i voti da AsyncStorage
  const fetchVoti = async () => {
    try {
      const materieSalvate = await AsyncStorage.getItem("materie");
      const materie = materieSalvate ? JSON.parse(materieSalvate) : {};
      if (materie[nomeMateria]) {
        setVoti(materie[nomeMateria]);
      }
    } catch (errore) {
      console.log("Errore nel recupero dei voti:", errore);
    }
  };

  const salvaVoti = async (nuoviVoti) => {
    try {
      const materieSalvate = await AsyncStorage.getItem("materie");
      const materie = materieSalvate ? JSON.parse(materieSalvate) : {};
      materie[nomeMateria] = nuoviVoti;
      await AsyncStorage.setItem("materie", JSON.stringify(materie));
      updateMaterie(nomeMateria, nuoviVoti); // Passiamo l'aggiornamento a HomeScreen
    } catch (errore) {
      console.log("Errore nel salvataggio dei voti:", errore);
    }
  };

  const eliminaVoto = (periodo, index) => {
    Alert.alert("Vuoi eliminare il voto?", "", [
      { text: "Annulla", style: "cancel" },
      {
        text: "Elimina",
        onPress: () => {
          const nuoviVoti = {
            ...voti,
            [periodo]: voti[periodo].filter((_, i) => i !== index),
          };
          setVoti(nuoviVoti);
          salvaVoti(nuoviVoti);
        },
      },
    ]);
  };

  const mostraVoti = (periodo) => {
    if (!voti[periodo] || voti[periodo].length === 0) {
      return <Text style={style.noVoti}>Nessun voto nel {periodo}</Text>;
    }

    return (
      <FlatList
        data={voti[periodo]}
        renderItem={({ item, index }) => (
          <View style={style.votoContainer}>
            <View style={style.votoTextContainer}>
              <Text style={style.voto}>
                {item.voto} ({item.tipo})
              </Text>
            </View>
            <Pressable
              style={style.bottone}
              onPress={() => eliminaVoto(periodo, index)}
            >
              <Text style={style.bottoneTesto}>Elimina</Text>
            </Pressable>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };


  useEffect(() => {
    fetchVoti();
  }, []);

  return (
    <View style={style.container}>
      <Text style={style.titolo}>{nomeMateria}</Text>

      <Text style={style.subTitolo}>Trimestre</Text>
      {mostraVoti("trimestre")}

      <Text style={style.subTitolo}>Pentamestre</Text>
      {mostraVoti("pentamestre")}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  titolo: {
    fontSize: 28,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  subTitolo: {
    fontSize: 22,
    color: "#ffffff",
    fontWeight: "bold",
    marginTop: 20,
  },
  votoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1F1F1F",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderColor: "#333",
    borderWidth: 1,
  },
  votoTextContainer: {
    flex: 3,
  },
  voto: {
    color: "#EAEAEA",
    fontSize: 16,
  },
  bottone: {
    backgroundColor: "#FF3B30",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  bottoneTesto: {
    color: "#ffffff",
    fontSize: 14,
  },
  noVoti: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
});

export default DettagliMateriaScreen;

