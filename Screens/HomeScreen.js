import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
  const [materie, setMaterie] = useState({});
  const [periodo, setPeriodo] = useState("trimestre");

  const caricaMaterie = async () => {
    try {
      const materieSalvate = await AsyncStorage.getItem("materie");
      const materieParse = materieSalvate ? JSON.parse(materieSalvate) : {};

      const materieValide = Object.fromEntries(
        Object.entries(materieParse).map(([nome, voti]) => [
          nome,
          voti[periodo] || [],
        ])
      );

      setMaterie(materieValide);
    } catch (errore) {
      console.error("Errore nel caricamento dei voti:", errore);
      setMaterie({});
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      caricaMaterie();
    }, [periodo]) //Ricarica i dati
  );

  const svuotaAsyncStorage = async () => {
    Alert.alert(
      "Svuotare i dati?",
      "Sei sicuro di voler cancellare tutti i dati?",
      [
        {
          text: "Annulla",
          style: "cancel",
        },
        {
          text: "Conferma",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setMaterie({});
              Alert.alert("Successo", "I dati sono stati cancellati");
            } catch (errore) {
              Alert.alert("Errore", "Impossibile svuotare i dati");
            }
          },
        },
      ]
    );
  };

  const calcolaMediaMateria = (voti) => {
    let pesoTotale = 0;
    let sommaPesi = 0;

    voti.forEach(({ voto, tipo }) => {
      if (typeof voto === "number" && !isNaN(voto)) {
        const peso = tipo === "pratico" ? 1 / 3 : 1;
        sommaPesi += voto * peso;
        pesoTotale += peso;
      }
    });

    return pesoTotale > 0 ? (sommaPesi / pesoTotale).toFixed(2) : "N/A";
  };

  const renderMateria = ({ item }) => {
    const nomeMateria = item[0];
    const voti = item[1] || [];

    const ultimiVoti = voti.slice(-3);
    const media = calcolaMediaMateria(voti);

    return (
      <TouchableOpacity
        style={stili.containerMateria}
        onPress={() =>
          navigation.navigate("DettagliMateria", { nomeMateria, voti })
        }
      >
        <View style={{ flex: 3 }}>
          <Text style={stili.nomeMateria}>{nomeMateria}</Text>
          <Text style={stili.rigaVoti}>
            {ultimiVoti.length === 0
              ? "Nessun voto"
              : ultimiVoti
                  .map((voto, index) => `${voto.voto} (${voto.tipo})`)
                  .join("   ")}
          </Text>
        </View>
        <Text style={stili.media}>{media}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <SafeAreaView style={stili.container}>
        <Text style={stili.titolo}>Le tue medie del {periodo}</Text>

        <TouchableOpacity
          onPress={() =>
            setPeriodo(periodo === "trimestre" ? "pentamestre" : "trimestre")
          }
        >
          <Text style={stili.bottonePeriodo}>
            Visualizza {periodo === "trimestre" ? "Pentamestre" : "Trimestre"}
          </Text>
        </TouchableOpacity>

        {Object.keys(materie).length === 0 ? (
          <Text style={stili.testoNoVoti}>Non hai ancora inserito voti</Text>
        ) : (
          <FlatList
            data={Object.entries(materie)}
            renderItem={renderMateria}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
        {/*
          <TouchableOpacity style={stili.bottoneSvuota} onPress={svuotaAsyncStorage}>
            <Text style={stili.bottoneTesto}>Svuota Dati</Text>
          </TouchableOpacity>
        */}
      </SafeAreaView>
    </>
  );
};

const stili = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 30,
    padding: 20,
  },
  titolo: {
    fontSize: 26,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  containerMateria: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1F1F1F",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderColor: "#333",
    borderWidth: 1,
  },
  nomeMateria: {
    color: "#EAEAEA",
    fontSize: 18,
  },
  rigaVoti: {
    color: "#CCCCCC",
    fontSize: 14,
    marginTop: 5,
  },
  media: {
    color: "#76FF03",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  testoNoVoti: {
    color: "#888",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
  },
  bottonePeriodo: {
    color: "#76FF03",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  bottoneSvuota: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  bottoneTesto: {
    color: "#ffffff",
    fontSize: 18,
  },
});

export default HomeScreen;
