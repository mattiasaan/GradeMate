import React, { useState, useEffect } from "react";
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
    let sommaScrittiOrali = 0;
    let countScrittiOrali = 0;
    let sommaPratici = 0;
    let countPratici = 0;

    voti.forEach(({ voto, tipo }) => {
      if (typeof voto === "number" && !isNaN(voto)) {
        if (tipo === "pratico") {
          sommaPratici += voto;
          countPratici++;
        } else {
          sommaScrittiOrali += voto;
          countScrittiOrali++;
        }
      }
    });
  
    if (countScrittiOrali === 0 && countPratici === 0) {
      return "N/A";
    }
  
    if (countScrittiOrali > 0 && countPratici === 0) {
      return (sommaScrittiOrali / countScrittiOrali);
    }
  
    if (countPratici > 0 && countScrittiOrali === 0) {
      return (sommaPratici / countPratici);
    }
  
    const mediaScrittiOrali =
      countScrittiOrali > 0 ? sommaScrittiOrali / countScrittiOrali : 0;
    const mediaPratici =
      countPratici > 0 ? sommaPratici / countPratici : 0;
  
    const mediaPonderata =
      (mediaScrittiOrali * (2 / 3)) + (mediaPratici * (1 / 3));
  
    return mediaPonderata;
  };
  
  
  const [mediaTotale, setMediaTotale] = useState(0);

  const renderMateria = ({ item }) => {
    const nomeMateria = item[0];
    const voti = item[1] || [];

    const ultimiVoti = voti.slice(-3);
    const media = calcolaMediaMateria(voti);

    const mediaDisplay = isNaN(media) ? "N/A" : media.toFixed(2);

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
        <Text style={stili.media}>{mediaDisplay}</Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const totale = Object.entries(materie).reduce((acc, [, voti]) => {
      return acc + calcolaMediaMateria(voti);
    }, 0);
  
    const mediaTot = totale / Object.entries(materie).length;
    setMediaTotale(mediaTot);
  }, [materie]);

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

        <Text style={stili.mediaTot}>La media totale è {mediaTotale.toFixed(2)}</Text>

        {Object.keys(materie).length === 0 ? (
          <Text style={stili.testoNoVoti}>Non hai ancora inserito voti</Text>
        ) : (
          <FlatList
            data={Object.entries(materie)}
            renderItem={renderMateria}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
            <TouchableOpacity style={stili.bottoneSvuota} onPress={svuotaAsyncStorage}>
              <Text style={stili.bottoneTesto}>Svuota Dati</Text>
            </TouchableOpacity>
          
        
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

  mediaTot:{
    color: "#EAEAEA",
    fontSize: 20,
    textAlign: "center",
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
  
  bottoneTesto: {
    color: "#ff3b30",
    fontSize: 16,
  },

  bottoneSvuota: {
    color: "#76FF03",
    textAlign: "center",
    marginTop: 10,
    marginBottom:-10,
    alignItems: "center",
  },
});

export default HomeScreen;
