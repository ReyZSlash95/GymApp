import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';

// Przykładowe dane z obrazami partii mięśniowych
const muscleGroups = [
  { name: "Klatka piersiowa", image: require('../../src/img/exercises/partieMiesniowe/Klatka.png') },
  { name: "Plecy", image: require('../../src/img/exercises/partieMiesniowe/Plecy.png') },
  { name: "Nogi", image: require('../../src/img/exercises/partieMiesniowe/Nogi.png') },
  { name: "Barki", image: require('../../src/img/exercises/partieMiesniowe/Barki.png') },
  { name: "Biceps", image: require('../../src/img/exercises/partieMiesniowe/Biceps.png') },
  { name: "Triceps", image: require('../../src/img/exercises/partieMiesniowe/Triceps.png') },
];

const MuscleGroupSelectionScreen = ({ navigation }) => {
  const renderMuscleGroupItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => navigation.navigate('Exercises', { muscleGroup: item.name })}
    >
      <Image source={item.image} style={styles.image} />
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );


  return (
    <FlatList
      data={muscleGroups}
      renderItem={renderMuscleGroupItem}
      keyExtractor={(item) => item.name}
      numColumns={3} // Ustawienie trzech kolumn
    />
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D0D0D',
    padding: 10,
    borderRadius: 8,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  text: {
    color: '#FFFFFF',
    marginTop: 5,
  },
});

export default MuscleGroupSelectionScreen;
