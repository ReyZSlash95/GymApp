import React, { useEffect, useState,  } from 'react';
import { Button, View, StyleSheet, Text, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { addExercise, removeExercise, savePlan, addSeriesToExercise, updateExerciseSeries } from '../redux/actions/exerciseActions';
import firestore from '@react-native-firebase/firestore';

type Serie = {
  reps: string;
  weight: string;
};

type Exercise = {
  id: string;
  name: string;
  series: Serie[];
  image: ImageSourcePropType; // Upewnij się, że typ jest poprawny
};



const NewPlan = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [planName, setPlanName] = useState('');
  const selectedExercises = useSelector((state) => state.exercise.selectedExercises);
  console.log(selectedExercises);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Szablon treningu',
      headerRight: () => (
        <View style={styles.saveButtonContainer}>
          <Button
            onPress={() => {
              dispatch(savePlan(selectedExercises));
            }}
            title="Zapisz"
            onPress={handleSave}
          />
        </View>
      ),
    });
  }, [navigation, dispatch, selectedExercises]);

  const handleAddSeries = (exerciseId) => {
    dispatch(addSeriesToExercise(exerciseId));
  };
  
  const updateSeries = (exerciseId, seriesIndex, field, value) => {
    dispatch(updateExerciseSeries(exerciseId, seriesIndex, field, value));
  };


  const handlePlanNameChange = (name) => {
    setPlanName(name);
  };

  const handleSave = async () => {
    if (!planName.trim() || selectedExercises.length === 0) {
      Alert.alert(
        'Błąd',
        'Proszę wprowadzić nazwę planu i dodać co najmniej jedno ćwiczenie.',
        [{text: 'OK'}]
      );
      return;
    }

    try {
      await firestore().collection('trainingPlans').add({
        planName,
        exercises: selectedExercises,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert("Sukces", "Plan został zapisany.");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving plan:", error);
      Alert.alert("Błąd", "Wystąpił błąd podczas zapisywania planu.");
    }
  };
  

  const renderExerciseItem = ({ item }) => (
    <View style={styles.exerciseItem}>
      <View style={styles.exerciseInfoContainer}>
        <FastImage source={item.image} style={styles.image} />
        <Text style={styles.exerciseName}>{item.name}</Text>
      </View>
      {item.series.map((serie, index) => (
        <View key={index} style={styles.serieDetail}>
          <Text style={styles.serieNumber}>{`Seria ${index + 1}:`}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(value) => updateSeries(item.id, index, 'reps', value)}
              value={serie.reps}
              keyboardType="numeric"
              placeholder="0"
            />
            <Text style={styles.inputLabel}>Powt.</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(value) => updateSeries(item.id, index, 'weight', value)}
              value={serie.weight}
              keyboardType="numeric"
              placeholder="0"
            />
            <Text style={styles.inputLabel}>Kg</Text>
          </View>
        </View>
      ))}
      <TouchableOpacity 
        style={styles.addSeriesButton} 
        onPress={() => handleAddSeries(item.id)}
      >
        <Text style={styles.addSeriesButtonText}>Dodaj serię</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <TextInput
        value={planName}
        onChangeText={handlePlanNameChange}
        placeholder="Nazwa planu"
        style={styles.planNameInput}
      />
      <FlatList
        data={selectedExercises}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseItem}
      />
      <Button
        title="Dodaj ćwiczenie"
        onPress={() => navigation.navigate('BodyParts')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  planNameInput: {
    height: 35,
    borderColor: 'gold',
    borderWidth:  1,
    padding: 4,
    margin: 1,
  },

  container: {
    flex: 1,
    padding: 10,
  },

  exerciseText: {
    fontSize: 16,
    marginVertical: 5,
  },

  addButtonContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },

  saveButtonContainer: {
    marginRight: 10,
  },

  exerciseItem: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 5,
  },

  exerciseInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },

  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  exerciseDetail: {
    fontSize: 16,
    color: '#666',
  },

  serieDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
  },

  serieNumber: {
    marginRight: 5,
    fontWeight: 'bold',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  input: {
    borderWidth: 0,
    borderColor: '#ddd',
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: 50, // Dostosuj szerokość według potrzeb
  },
  inputLabel: {
    marginLeft: 5,
  },

  addSeriesButton: {
    backgroundColor: '#e7e7e7',
    padding: 10,
    margin: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  addSeriesButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  
});

export default NewPlan;