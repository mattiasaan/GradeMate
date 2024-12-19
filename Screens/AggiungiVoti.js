import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const listaMaterie = [
  'tpsit', 'telecomunicazioni', 'informatica', 'reti e sistemi', 'italiano', 
  'storia', 'religione', 'tedesco', 'inglese', 'matematica', 'scienze motorie'
];
const tipiVoto = ['scritto', 'orale', 'pratico'];

const AggiungiVoti = ({ navigation }) => {
  const [materia, setMateria] = useState(listaMaterie[0]);
  const [tipoVoto, setTipoVoto] = useState(tipiVoto[0]);
  const [voto, setVoto] = useState('');

  const gestisciInvio = async () => {
    if (!voto) {
      Alert.alert('Errore', 'Per favore, inserisci un voto.');
      return;
    }

    const votoParse = parseFloat(voto);
    if (isNaN(votoParse) || votoParse < 1 || votoParse > 10) {
      Alert.alert('Errore', 'Il voto deve essere un numero tra 1 e 10.');
      return;
    }

    try {
      const materieEsistenti = await AsyncStorage.getItem('materie');
      const materie = materieEsistenti ? JSON.parse(materieEsistenti) : {};

      const votiAggiornati = materie[materia] ? [...materie[materia]] : [];
      votiAggiornati.push({ voto: votoParse, tipo: tipoVoto });

      const materieAggiornate = { ...materie, [materia]: votiAggiornati };

      await AsyncStorage.setItem('materie', JSON.stringify(materieAggiornate));

      navigation.navigate('Home');
    } catch (errore) {
      console.error('Errore nel salvataggio dei voti:', errore);
    }
  };

  const svuotaStorage = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Memoria Svuotata', 'Tutti i dati sono stati eliminati.');
    } catch (errore) {
      console.error('Errore durante lo svuotamento di AsyncStorage:', errore);
    }
  };

  return (
    <ScrollView style={stili.container} contentContainerStyle={stili.scrollContainer}>
      <Text style={stili.titolo}>Aggiungi Voto</Text>

      <View style={stili.pickerContainer}>
        <Text style={stili.label}>Materia</Text>
        <Picker
          selectedValue={materia}
          onValueChange={(itemValue) => setMateria(itemValue)}
          style={stili.picker}
        >
          {listaMaterie.map((materia, index) => (
            <Picker.Item key={index} label={materia} value={materia} />
          ))}
        </Picker>
      </View>

      <View style={stili.pickerContainer}>
        <Text style={stili.label}>Tipo di Voto</Text>
        <Picker
          selectedValue={tipoVoto}
          onValueChange={(itemValue) => setTipoVoto(itemValue)}
          style={stili.picker}
        >
          {tipiVoto.map((tipo, index) => (
            <Picker.Item key={index} label={tipo} value={tipo} />
          ))}
        </Picker>
      </View>

      <TextInput
        style={stili.input}
        placeholder="Voto (1-10)"
        placeholderTextColor="#888"
        value={voto}
        onChangeText={setVoto}
        keyboardType="numeric"
      />

      <Text style={stili.bottoneAggiungi} onPress={gestisciInvio}>
        Aggiungi Voto
      </Text>

      <Text style={stili.bottoneSvuota} onPress={svuotaStorage}>
        Svuota Memoria
      </Text>
    </ScrollView>
  );
};

const stili = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
  },
  scrollContainer: {
    paddingTop: 30, 
    paddingBottom: 20,
  },
  titolo: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 20,
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    borderColor: '#333',
    borderWidth: 1,
  },
  label: {
    color: '#EAEAEA',
    fontSize: 16,
    marginLeft: 15,
    marginBottom: 5,
    fontWeight: '600',
  },
  picker: {
    backgroundColor: '#1F1F1F',
    color: '#ffffff',
    padding: 10,
    borderRadius: 8,
    height: 50,
  },
  input: {
    backgroundColor: '#1F1F1F',
    color: '#ffffff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  bottoneAggiungi: {
    color: '#76FF03',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  bottoneSvuota: {
    color: '#FF6347',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default AggiungiVoti;
