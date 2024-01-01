import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, FlatList } from 'react-native';

import firestore from '@react-native-firebase/firestore';


const handleSavePlan = async () => {
  // Filter exercises to include only those with a defined name
  const validExercises = exercises.filter(exercise => exercise.name);

  if (planName.trim() === '' || validExercises.length === 0) {
    alert('Please provide a plan name and add at least one exercise.');
    return;
  }

  try {
    await firestore().collection('trainingPlans').add({
      planName,
      exercises: validExercises,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    console.log("Plan saved");
    navigation.goBack();
  } catch (error) {
    console.error("Error saving plan:", error);
    alert("Error while saving the plan.");
  }
};





const CreatePlanScreen = ({ navigation, route }) => {
  const [planName, setPlanName] = useState('');
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    console.log('route.params', route.params);
    if (route.params?.selectedExercise && route.params.selectedExercise.name && !exercises.find(e => e.name === route.params.selectedExercise.name)) {
      const newExercise = {
        name: route.params.selectedExercise.name,
        series: [{ reps: '', weight: '' }],
      };
      setExercises([...exercises, newExercise]);
    }
  }, [route.params?.selectedExercise]);
  
  
  

  const addSeries = (exerciseIndex) => {
    const newSeries = { reps: '', weight: '' };
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].series.push(newSeries);
    setExercises(updatedExercises);
  };

  const handleSeriesChange = (exerciseIndex, seriesIndex, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].series[seriesIndex][field] = value;
    setExercises(updatedExercises);
  };

  const renderSeries = (series, exerciseIndex) => {
    return series.map((serie, seriesIndex) => (
      <View key={seriesIndex} style={styles.seriesContainer}>
        <TextInput
          style={[styles.input, styles.repsInput]}
          onChangeText={(value) => handleSeriesChange(exerciseIndex, seriesIndex, 'reps', value)}
          value={serie.reps}
          placeholder="Powtórzenia"
        />
        <TextInput
          style={[styles.input, styles.weightInput]}
          onChangeText={(value) => handleSeriesChange(exerciseIndex, seriesIndex, 'weight', value)}
          value={serie.weight}
          placeholder="Ciężar"
        />
      </View>
    ));
  };
  
  

  const renderExerciseItem = ({ item, index }) => (
    <View style={styles.exerciseItem}>
      <Text style={styles.exerciseName}>{item.name}</Text>
      {renderSeries(item.series, index)}
      <TouchableOpacity style={styles.button} onPress={() => addSeries(index)}>
        <Text style={styles.buttonText}>Dodaj serię</Text>
      </TouchableOpacity>
    </View>
  );
  
  const handleAddExercise = () => {
    navigation.navigate('MuscleGroupSelection');
  };

  const handleSavePlan = async () => {
    if (planName.trim() === '' || exercises.length === 0) {
      alert('Please provide a plan name and add at least one exercise.');
      return;
    }
  
    // Log the data before saving
    console.log("Saving plan with name:", planName);
    console.log("Exercises:", exercises);
  
    try {
      await firestore().collection('trainingPlans').add({
        planName,
        exercises,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log("Plan saved");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving plan:", error);
      alert("Error while saving the plan.");
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nazwa planu:</Text>
      <TextInput
        style={styles.input}
        value={planName}
        onChangeText={setPlanName}
        placeholder="Wpisz nazwę planu"
        placeholderTextColor="#777"
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleAddExercise}
      >
        <Text style={styles.buttonText}>Dodaj ćwiczenie</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSavePlan}
      >
        <Text style={styles.buttonText}>Zapisz plan</Text>
      </TouchableOpacity>
      <FlatList
  data={exercises}
  keyExtractor={(item, index) => 'exercise-' + index}
  renderItem={renderExerciseItem}
  extraData={exercises} // Dodaj to, aby wymusić odświeżenie listy
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0D0D0D',
  },
  label: {
    color: '#E0E0E0',
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    backgroundColor: '#222',
    color: '#FFF',
    width: '100%',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8E44AD',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },

  //..
  seriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  repsInput: {
    flex: 1, // Alokacja miejsca dla pola
    marginRight: 10, // Odstęp między polami
  },
  weightInput: {
    flex: 1, // Alokacja miejsca dla pola
  },
  
});

export default CreatePlanScreen;
