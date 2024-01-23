import React, {useEffect, useState} from 'react';
import {
  Button,
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  BackHandler,
} from 'react-native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {IconButton} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';

import DropDown from '../screens/newPlanScreen/DropDown';

import {
  faList,
  faCalendar,
  faDumbbell,
  faEllipsisVertical,
  faTractor,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {
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

const data = [
  {label: 'Item 1', value: '1'},
  {label: 'Item 2', value: '2'},
  // ... reszta Twoich danych ...
];

const NewPlan = () => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(null);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

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
      headerLeft: () => (
        <Button
          title="Wstecz"
          onPress={() => {
            Alert.alert(
              'Potwierdzenie',
              'Czy na pewno chcesz wyjść? Wszystkie zmiany zostaną utracone.',
              [
                {text: 'Nie'},
                {
                  text: 'Tak',
                  onPress: () => {
                    dispatch(resetPlan());
                    navigation.goBack();
                  },
                },
              ],
            );
          }}
        />
      ),
    });
  }, [navigation, dispatch, selectedExercises]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Potwierdzenie',
          'Czy na pewno chcesz wyjść? Wszystkie zmiany zostaną utracone.',
          [
            {text: 'Nie'},
            {
              text: 'Tak',
              onPress: () => {
                dispatch(resetPlan());
                navigation.goBack();
              },
            },
          ],
        );
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation, dispatch]),
  );

  const handleAddSeries = exerciseId => {
    dispatch(addSeriesToExercise(exerciseId));
  };

  const handleRemoveExercise = exerciseId => {
    dispatch(removeExercise(exerciseId));
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

    // Pobieranie aktualnej liczby planów dla określenia nowej wartości 'order'
    const plansCount = await firestore()
      .collection('trainingPlans')
      .get()
      .then(querySnapshot => querySnapshot.size);

    firestore()
      .collection('trainingPlans')
      .add({
        planName,
        exercises: selectedExercises,
        order: plansCount, // Dodanie pola 'order'
        createdAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert('Sukces', 'Plan został zapisany.');
      })
      .catch(error => {
        console.error('Error saving plan:', error);
        Alert.alert('Błąd', 'Wystąpił błąd podczas zapisywania planu.');
      });

    // setPlanName(''); // Resetuje pole nazwy treningu
    Alert.alert('Sukces', 'Plan został zapisany.');
    dispatch(resetPlan());
    navigation.goBack();
  };

  const handleRemoveLastSeries = exerciseId => {
    dispatch(removeLastSeriesFromExercise(exerciseId));
  };

  const renderExerciseItem = ({item, index}) => (
    <View style={styles.exerciseItem}>
      {/* Wyświetlanie numeracji */}
      <Text>Ćwiczenie: {index + 1}</Text>
      {/* Reszta kodu do wyświetlania ćwiczenia */}
      <View style={styles.exerciseInfoContainer}>
        <FastImage source={item.image} style={styles.image} />
        <Text style={styles.exerciseName}>{item.name}</Text>
        {/* Dropdown Menu */}
        <View style={styles.menuButton}>
          <DropDown
            data={data}
            onRemoveExercise={() => handleRemoveExercise(item.id)}
            exerciseIndex={index}
          />
        </View>
      </View>
      {/* Add Series Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addSeriesButton}
          onPress={() => handleAddSeries(item.id)}>
          <Text style={styles.addSeriesButtonText}>DODAJ</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.seriesContainer}>
        {/* {item.series && Array.isArray(item.series) && item.series.map((serie, index) => (
        <View key={index} style={styles.serieDetail}> */}
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
            <FontAwesomeIcon icon={faTrash} size={18} color="#7C7C8A" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        caretHidden={true}
        value={planName}
        underlineColorAndroid={'transparent'}
        onChangeText={handlePlanNameChange}
        placeholder="Podaj nazwe planu"
        placeholderTextColor="#C4C4CC"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[
          styles.planNameInput,
          {
            backgroundColor: isFocused ? '#29292E' : '#121214',
            color: isFocused ? '#FFFFFF' : '#00B37E',
            borderWidth: isFocused ? 2 : 1,
          },
        ]}
      />

      <FlatList
        data={selectedExercises}
        keyExtractor={item => item.id}
        renderItem={renderExerciseItem}
      />
      <TouchableOpacity
        style={styles.addExerciseButton}
        onPress={() => navigation.navigate('BodyParts')}>
        <Text style={styles.addExerciseText}>Dodaj ćwiczenie</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  planNameInput: {
    textAlign: 'center',
    height: 35,
    borderColor: '#00B37E',
    borderWidth: 1,
    borderRadius: 3,
    padding: 4,
    margin: 10,
    fontWeight: 'bold',
  },

  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#121214',
  },

  saveButtonContainer: {
    marginRight: 10,
  },

  exerciseItem: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // padding: 10,

    borderBottomWidth: 3,
    marginBottom: 5,
    // borderWidth: 1,
    backgroundColor: '#e4b04e',
    borderRadius: 6,
  },

  removeSeriesButton: {
    // padding: 5,
    marginRight: 14,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },

  exerciseInfoContainer: {
    backgroundColor: '#29292E',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    borderRadius: 5,
    width: '100%',
    padding: 0,
    position: 'relative',
  },

  image: {
    width: 54,
    height: 54,
    marginRight: 6,
    marginLeft: 6,
    marginTop: 6,
    marginBottom: 6,
    borderRadius: 3,
    // borderColor: '#e4b04e',
    // borderWidth: 2,
  },

  exerciseName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    // textAlign: 'center',
    // position: 'absolute',
    left: 10,
  },

  exerciseDetail: {
    fontSize: 16,
    color: '#666',
  },

  serieDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
  },

  serieNumber: {
    marginRight: 25,
    marginLeft: 10,
    fontWeight: 'bold',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  input: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    borderWidth: 0,
    borderColor: '#ddd',
    paddingVertical: 2,
    paddingHorizontal: 8,
    width: 75, // Dostosuj szerokość według potrzeb
  },
  inputLabel: {
    fontSize: 12,
    marginLeft: 5,
  },

  //test
  seriesContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    margin: '10',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },

  addSeriesButton: {
    backgroundColor: '#202024',
    padding: 3,
    margin: 3,

    borderRadius: 5,
  },
  addSeriesButtonText: {
    color: '#00B37E',
    fontWeight: 'bold',
  },

  //test
  addExerciseButton: {
    backgroundColor: '#202024',
    padding: 10,
    margin: 10,
    alignItems: 'center',
    borderRadius: 5,
  },

  addExerciseText: {
    color: '#00B37E',
    fontWeight: 'bold',
  },

  menuButton: {
    position: 'absolute',
    right: 0,
    padding: 10,
  },

  // test dropdown

  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default NewPlan;
