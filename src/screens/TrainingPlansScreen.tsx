import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const TrainingPlansScreen = ({ navigation }) => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('trainingPlans')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const plans = [];
        querySnapshot.forEach(documentSnapshot => {
          plans.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        console.log("Pobrane plany:", plans);
        setPlans(plans);
      });
  
    return () => subscriber();
  }, []);
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plany Treningowe</Text>
      <FlatList
        data={plans}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <View style={styles.planItem}>
          <Text style={styles.planName}>{item.planName}</Text>
          {/* Dodatkowe szczegóły planu */}
        </View>
        )}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CreatePlan')}
      >
        <Text style={styles.buttonText}>Dodaj nowy plan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#0D0D0D', // Ciemne tło
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E0E0E0', // Jasny tekst
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8E44AD', // Fioletowy przycisk
    padding: 15,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginBottom: 20,
    alignSelf: 'stretch', // Rozciągnij przycisk na szerokość kontenera
    marginHorizontal: 16, // Dodaj marginesy poziome
  },
  buttonText: {
    color: '#FFFFFF', // Biały tekst
    fontSize: 18,
    textAlign: 'center', // Wyśrodkuj tekst w przycisku
  },
  planItem: {
    backgroundColor: '#FFFFFF', // Jasne tło dla elementu listy
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    flexDirection: 'row', // Elementy w linii
    alignItems: 'center', // Wyśrodkuj elementy wertykalnie
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // Czarny tekst
  },
  exerciseText: {
    fontSize: 16,
    color: '#000000', // Czarny tekst
  },
});



export default TrainingPlansScreen;
