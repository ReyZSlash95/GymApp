import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';


// Możesz umieścić to na zewnątrz komponentu
const exercisesData = {
  'Klatka piersiowa': [
    { name: 'Wyciskanie sztangi leżąc', image: require('../../src/img/exercises/WyciskanieSztangiLezac.png') },
    { name: 'Wyciskanie sztangi leżąc1', image: require('../../src/img/exercises/WyciskanieSztangiLezac.png') },

  
    // ...
  ],
  'Plecy': [
    { name: 'Podciaganie na drazku', image: require('../../src/img/exercises/PodciaganieNaDrazku.png') },
    { name: 'Przyciaganie linki wyciagu dolnego siedzac', image: require('../../src/img/exercises/PrzyciaganieLinkiWyciaguDolnegoSiedzac.png') },
    { name: 'Podciaganie na drazku', image: require('../../src/img/exercises/PodciaganieNaDrazku.png') },
    { name: 'Podciaganie na drazku', image: require('../../src/img/exercises/PodciaganieNaDrazku.png') },
    { name: 'Podciaganie na drazku', image: require('../../src/img/exercises/PodciaganieNaDrazku.png') },
    { name: 'Podciaganie na drazku', image: require('../../src/img/exercises/PodciaganieNaDrazku.png') },
    { name: 'Przyciaganie linki wyciagu dolnego siedzac', image: require('../../src/img/exercises/PrzyciaganieLinkiWyciaguDolnegoSiedzac.png') },



  
    // ...
  ],
  // ...
};



const ExercisesScreen = ({ route, navigation }) => {
  const { muscleGroup } = route.params;

 
  const handleAddExercise = (exercise) => {
    navigation.navigate('CreatePlan', { selectedExercise: exercise });
  };
  
  

  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.exerciseButton} 
      onPress={() => handleAddExercise(item)}
    >
      <Image source={item.image} style={styles.exerciseImage} />
      <Text style={styles.exerciseText}>{item.name}</Text>
    </TouchableOpacity>
  );
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ćwiczenia na: {muscleGroup}</Text>
      <FlatList
        data={exercisesData[muscleGroup]}
        keyExtractor={(item) => item.name}
        renderItem={renderExerciseItem}
      />
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  exerciseButton: {
    padding: 10,
    marginTop: 10,
    backgroundColor: '#eaeaea',
    // Dodaj tutaj dodatkowe style dla przycisków
  },
  exerciseText: {
    fontSize: 16,
  },
  exerciseImage: {
    width: 100, // Ustaw odpowiednią szerokość
    height: 100, // Ustaw odpowiednią wysokość
    resizeMode: 'contain', // Dopasuj obraz do rozmiaru kontenera
  },
});

export default ExercisesScreen;
