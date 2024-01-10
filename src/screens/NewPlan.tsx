import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  Button,
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {
  addExercise,
  removeExercise,
  savePlan,
  resetPlan,
  addSeriesToExercise,
  updateExerciseSeries,
  removeLastSeriesFromExercise,
} from '../redux/actions/exerciseActions';
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
  const selectedExercises = useSelector(
    state => state.exercise.selectedExercises,
  );
  console.log(selectedExercises);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Szablon treningu',
      headerRight: () => (
        <View style={styles.saveButtonContainer}>
          <Button title="Zapisz" onPress={handleSave} />
        </View>
      ),
    });
  }, [navigation, dispatch, selectedExercises]);

  const handleAddSeries = exerciseId => {
    dispatch(addSeriesToExercise(exerciseId));
  };

  const updateSeries = (exerciseId, seriesIndex, field, value) => {
    dispatch(updateExerciseSeries(exerciseId, seriesIndex, field, value));
  };

  const handlePlanNameChange = name => {
    setPlanName(name);
  };

  const handleSave = async () => {
    if (!planName.trim() || selectedExercises.length === 0) {
      Alert.alert(
        'Błąd',
        'Proszę wprowadzić nazwę planu i dodać co najmniej jedno ćwiczenie.',
        [{text: 'OK'}],
      );
      return;
    }

    dispatch(savePlan(selectedExercises));

    try {
      await firestore().collection('trainingPlans').add({
        planName,
        exercises: selectedExercises,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert('Sukces', 'Plan został zapisany.');
      // setPlanName(''); // Resetuje pole nazwy treningu
      dispatch(resetPlan());
      navigation.goBack();
    } catch (error) {
      console.error('Error saving plan:', error);
      Alert.alert('Błąd', 'Wystąpił błąd podczas zapisywania planu.');
    }
  };

  const handleRemoveLastSeries = exerciseId => {
    dispatch(removeLastSeriesFromExercise(exerciseId));
  };

  const renderExerciseItem = ({item}) => (
    <View style={styles.exerciseItem}>
      <View style={styles.exerciseInfoContainer}>
        <FastImage source={item.image} style={styles.image} />
        <Text style={styles.exerciseName}>{item.name}</Text>
      </View>
      <TouchableOpacity
        style={styles.addSeriesButton}
        onPress={() => handleAddSeries(item.id)}>
        <Text style={styles.addSeriesButtonText}>+</Text>
      </TouchableOpacity>
      <View style={styles.seriesContainer}>
        {item.series.map((serie, index) => (
          <View key={index} style={styles.serieDetail}>
            <Text style={styles.serieNumber}>{`Seria ${index + 1}:`}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                onChangeText={value =>
                  updateSeries(item.id, index, 'reps', value)
                }
                value={serie.reps}
                keyboardType="numeric"
                placeholder="0"
              />
              <Text style={styles.inputLabel}>Powt.</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                onChangeText={value =>
                  updateSeries(item.id, index, 'weight', value)
                }
                value={serie.weight}
                keyboardType="numeric"
                placeholder="0"
              />
              <Text style={styles.inputLabel}>Kg</Text>
            </View>
          </View>
        ))}
        {item.series.length > 0 && (
          <TouchableOpacity
            style={styles.removeSeriesButton}
            onPress={() => handleRemoveLastSeries(item.id)}>
            <Text style={styles.removeSeriesButtonText}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        caretHidden={true}
        value={planName}
        onChangeText={handlePlanNameChange}
        placeholder="Nazwa planu"
        style={[
          styles.planNameInput,
          {
            backgroundColor: isFocused ? '#488992' : '#202c3d',
            color: isFocused ? '#202c3d' : '#e4b04e',
          },
        ]}
      />
      <FlatList
        data={selectedExercises}
        keyExtractor={item => item.id}
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
    textAlign: 'center',
    height: 35,
    borderColor: '#e4b04e',
    borderWidth: 2,
    borderRadius: 5,
    padding: 4,
    margin: 10,
    fontWeight: 'bold',
  },

  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#202c3d',
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
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 5,
    borderWidth: 1,
    backgroundColor: '#e4b04e',
    borderColor: '#ddd',
    borderRadius: 10,
  },

  removeSeriesButton: {
    padding: 5,
    margin: 5,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },

  removeSeriesButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  exerciseInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#da5151',
    borderRadius: 5,
    width: '100%',
    padding: 0,
    position: 'relative',
  },

  image: {
    width: 54,
    height: 54,
    marginRight: 10,
    borderRadius: 5,
    borderColor: '#e4b04e',
    borderWidth: 2,
  },

  exerciseName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
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
    justifyContent: 'flex-end',
    marginRight: 10,
  },

  input: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    borderWidth: 0,
    borderColor: '#ddd',
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: 75, // Dostosuj szerokość według potrzeb
  },
  inputLabel: {
    fontSize: 12,
    marginLeft: 5,
  },

  addSeriesButton: {
    backgroundColor: '#e7e7e7',
    padding: 10,
    margin: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  //test
  seriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  addSeriesButton: {
    backgroundColor: '#e7e7e7',
    padding: 5,
    margin: 5,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  addSeriesButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default NewPlan;
