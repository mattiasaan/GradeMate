import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [materie, setMaterie] = useState({});

  useEffect(() => {
    const caricaMaterie = async () => {
      try {
        const materieSalvate = await AsyncStorage.getItem('materie');
        const materieParse = materieSalvate ? JSON.parse(materieSalvate) : {};

        const materieValide = Object.fromEntries(
          Object.entries(materieParse).map(([nome, voti]) => [
            nome,
            Array.isArray(voti) ? voti : [],
          ])
        );

        setMaterie(materieValide);
      } catch (errore) {
        console.error('Errore nel caricamento dei voti:', errore);
        setMaterie({});
      }
    };

    const listenerFocus = navigation.addListener('focus', caricaMaterie);
    return () => navigation.removeListener('focus', caricaMaterie);
  }, [navigation]);

  const calcolaMediaMateria = (voti) => {
    //if (!voti || voti.length === 0) return 'N/A';

    let pesoTotale = 0;
    let sommaPesi = 0;

    voti.forEach(({ voto, tipo }) => {
      const peso = tipo === 'pratico' ? 1 / 3 : 1;
      sommaPesi += voto * peso;
      pesoTotale += peso;
    });

    return (sommaPesi / pesoTotale).toFixed(2);
  };

  const renderMateria = ({ item }) => {
    const nomeMateria = item[0];
    const voti = item[1] || [];

    const ultimiVoti =voti.slice(-3);
    const media = calcolaMediaMateria(voti);

    return (
      <View style={stili.containerMateria}>
        <View style={{ flex: 3 }}>
          <Text style={stili.nomeMateria}>{nomeMateria}</Text>
          <Text style={stili.rigaVoti}>
            {ultimiVoti.map((voto, index) => `${voto.voto} (${voto.tipo})`).join('   ')}
          </Text>
        </View>
        <Text style={stili.media}>{media}</Text>
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <SafeAreaView style={stili.container}>
        <Text style={stili.titolo}>Le tue medie</Text>

        {Object.keys(materie).length === 0 ? (
          <Text style={stili.testoNoVoti}>Non hai ancora inserito voti</Text>
        ) : (
          <FlatList
            data={Object.entries(materie)}
            renderItem={renderMateria}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </SafeAreaView>
    </>
  );
};

const stili = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 30,
    padding: 20,
  },
  titolo: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  containerMateria: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1F1F1F',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderColor: '#333',
    borderWidth: 1,
  },
  nomeMateria: {
    color: '#EAEAEA',
    fontSize: 18,
  },
  rigaVoti: {
    color: '#CCCCCC',
    fontSize: 14,
    marginTop: 5,
  },
  media: {
    color: '#76FF03',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  testoNoVoti: {
    color: '#888',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default HomeScreen;
