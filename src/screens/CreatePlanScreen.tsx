import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, FlatList } from 'react-native';

const CreatePlanScreen = ({ navigation, route }) => {
  const [planName, setPlanName] = useState('');
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    if (route.params?.selectedExercise && !exercises.find(e => e.name === route.params.selectedExercise.name)) {
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
      <View key={seriesIndex}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleSeriesChange(exerciseIndex, seriesIndex, 'reps', value)}
          value={serie.reps}
          placeholder="Liczba powtórzeń"
        />
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleSeriesChange(exerciseIndex, seriesIndex, 'weight', value)}
          value={serie.weight}
          placeholder="Ciężar (kg)"
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

  const handleSavePlan = () => {
    console.log("Zapisano plan:", planName);
    // Tutaj logika zapisywania planu
    navigation.goBack();
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
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderExerciseItem}
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
});

export default CreatePlanScreen;
