import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DettagliMateriaScreen = ({ route }) => {
  const { nomeMateria, voti: inizialiVoti } = route.params;
  const [voti, setVoti] = useState(inizialiVoti);

  const salvaVoti = async (nuoviVoti) => {
    try {
      const materieSalvate = await AsyncStorage.getItem('materie');
      const materie = materieSalvate ? JSON.parse(materieSalvate) : {};
      materie[nomeMateria] = nuoviVoti;
      await AsyncStorage.setItem('materie', JSON.stringify(materie));
    } catch (errore) {
      console.log('Errore nel salvataggio dei voti:', errore);
    }
  };

  const eliminaVoto = async (index) => {
    Alert.alert(
      'Vuoi eliminare il voto',
      '',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          onPress: () => {
            const nuoviVoti = voti.filter((_, i) => i !== index);
            setVoti(nuoviVoti);
            salvaVoti(nuoviVoti);
          },
        },
      ]
    );
  };

  const mostraVoti = ({ item, index }) => (
    <View style={style.votoContainer}>
      <View style={style.votoTextContainer}>
        <Text style={style.voto}>
          {item.voto} ({item.tipo})
        </Text>
      </View>
      <Pressable style={style.bottone} onPress={() => eliminaVoto(index)}>
        <Text style={style.bottoneTesto}>Elimina</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={style.container}>
      <Text style={style.titolo}>{nomeMateria}</Text>
      <FlatList
        data={voti}
        renderItem={mostraVoti}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  titolo: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  votoContainer: {
    flexDirection: 'row',
    backgroundColor: '#1F1F1F',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  votoTextContainer: {
    flex: 1,
  },
  voto: {
    color: '#EAEAEA',
    fontSize: 18,
  },
  bottone: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  bottoneTesto: {
    color: '#ff0303',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    
  },
});

export default DettagliMateriaScreen;
