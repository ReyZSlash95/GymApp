import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import FastImage from 'react-native-fast-image';
import {CheckBox, Image} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {
  setTrainingData,
  updateSeriesData,
  resetTrainingData,
} from '../redux/actions/exerciseActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../img/Ui/LogoGymApp.png';
import logoGym from '../img/Ui/LogoGym.png';

const {width} = Dimensions.get('window');

const Training = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const planIdFromRoute = route.params?.planId;
  const trainingData = useSelector(state => state.exercise.trainingData);

  const [isTrainingActive, setIsTrainingActive] = useState(false);

  useEffect(() => {
    const loadTrainingData = async () => {
      const savedTrainingData = await AsyncStorage.getItem('trainingData');
      if (savedTrainingData) {
        dispatch(setTrainingData(JSON.parse(savedTrainingData)));
      }
    };

    if (planIdFromRoute) {
      getPlan(planIdFromRoute);
    } else {
      loadTrainingData();
    }

    const checkActiveTraining = async () => {
      const savedStartTime = await AsyncStorage.getItem('trainingStartTime');
      setIsTrainingActive(!!savedStartTime);
    };

    checkActiveTraining();
  }, [planIdFromRoute, dispatch]);

  const getPlan = async planId => {
    try {
      const planDocument = await firestore()
        .collection('trainingPlans')
        .doc(planId)
        .get();
      if (planDocument.exists) {
        const planData = planDocument.data();
        console.log('training:', planData);

        // Konwersja daty na timestamp
        const createdAtTimestamp = planData.createdAt
          ? planData.createdAt.seconds * 1000
          : Date.now();
        planData.createdAt = createdAtTimestamp;

        dispatch(setTrainingData(planData));
        await AsyncStorage.setItem('trainingData', JSON.stringify(planData));
      } else {
        Alert.alert('Błąd', 'Nie znaleziono planu treningowego.');
      }
    } catch (error) {
      console.error('Błąd podczas pobierania planu:', error);
    }
  };

  const startTraining = async () => {
    const startTime = Date.now();
    await AsyncStorage.setItem('trainingStartTime', startTime.toString());
    if (planIdFromRoute) {
      await AsyncStorage.setItem('activePlanId', planIdFromRoute.toString());
    }
    setIsTrainingActive(true);
  };

  const endTraining = async () => {
    const duration =
      Date.now() -
      parseInt(await AsyncStorage.getItem('trainingStartTime'), 10);
    saveTrainingHistory(duration);
    await AsyncStorage.removeItem('trainingStartTime');
    await AsyncStorage.removeItem('activePlanId');
    setIsTrainingActive(false); // Dodajemy aktualizację stanu
  };

  const confirmEndTraining = () => {
    Alert.alert(
      'Zakończ trening',
      'Czy na pewno chcesz zakończyć ten trening?',
      [
        {text: 'Nie', style: 'cancel'},
        {text: 'Tak', onPress: endTraining},
      ],
    );
  };

  const saveTrainingHistory = async duration => {
    const savedPlanId = await AsyncStorage.getItem('activePlanId');

    if (!savedPlanId || !trainingData || !trainingData.exercises) {
      console.error('Plan ID or Plan data is missing');
      return;
    }

    const trainingHistoryData = {
      completedDate: firestore.FieldValue.serverTimestamp(),
      planId: savedPlanId,
      exercises: trainingData.exercises,
      duration,
      planName: trainingData.planName,
    };

    try {
      await firestore().collection('trainingHistory').add(trainingHistoryData);
      Alert.alert('Sukces', 'Historia treningu została zapisana.');
      await AsyncStorage.removeItem('trainingData');
      dispatch(resetTrainingData());
      navigation.navigate('TrainingSummary', {plan: null});
    } catch (error) {
      console.error('Błąd podczas zapisywania historii treningu:', error);
      Alert.alert(
        'Błąd',
        'Wystąpił błąd podczas zapisywania historii treningu.',
      );
    }
  };

  const handleSeriesUpdate = async (
    exerciseIndex,
    serieIndex,
    field,
    value,
  ) => {
    dispatch(updateSeriesData(exerciseIndex, serieIndex, field, value));
    const updatedTrainingData = {...trainingData};
    updatedTrainingData.exercises[exerciseIndex].series[serieIndex][field] =
      value;
    await AsyncStorage.setItem(
      'trainingData',
      JSON.stringify(updatedTrainingData),
    );
  };

  const handleSeriesCheck = (exerciseIndex, serieIndex) => {
    const checked =
      !trainingData.exercises[exerciseIndex].series[serieIndex].checked;
    dispatch(updateSeriesData(exerciseIndex, serieIndex, 'checked', checked));
  };

  if (!trainingData || !trainingData.exercises) {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logoGym} style={styles.logo} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Plans')}>
            <Text style={styles.buttonText}>Wybierz plan</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.planNameStyle}>{trainingData.planName}</Text>
      <ScrollView horizontal pagingEnabled style={styles.scrollView}>
        {trainingData.exercises.map((exercise, exerciseIndex) => (
          <View key={exerciseIndex} style={[styles.exerciseContainer, {width}]}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <FastImage source={exercise.image} style={styles.image} />
            <ScrollView
              style={{flexGrow: 0}}
              keyboardShouldPersistTaps="handled">
              {exercise.series.map((serie, serieIndex) => (
                <View key={serieIndex} style={styles.serieContainer}>
                  <Text style={styles.serieNumber}>{`${serieIndex + 1}:`}</Text>
                  <Text>Powt. </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={value =>
                      handleSeriesUpdate(
                        exerciseIndex,
                        serieIndex,
                        'reps',
                        value,
                      )
                    }
                    value={serie.reps.toString()}
                    keyboardType="numeric"
                    placeholder=""
                  />
                  <Text>Kg </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={value =>
                      handleSeriesUpdate(
                        exerciseIndex,
                        serieIndex,
                        'weight',
                        value,
                      )
                    }
                    value={serie.weight.toString()}
                    keyboardType="numeric"
                    placeholder=""
                  />
                  <CheckBox
                    containerStyle={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 10,
                      marginRight: 10,
                      padding: 0,
                      margin: 0,
                      height: 30,
                      width: 30,
                    }}
                    checked={serie.checked}
                    onPress={() => handleSeriesCheck(exerciseIndex, serieIndex)}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        {!isTrainingActive ? (
          <Button title="Rozpocznij Trening" onPress={startTraining} />
        ) : (
          <Button title="Zakończ trening" onPress={confirmEndTraining} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 400,
    height: 400,
  },
  buttonContainer: {
    marginTop: 20, // Dodaje margines na górze, aby oddzielić przycisk od obrazu
    paddingHorizontal: 50, // Dodaje poziomy margines do kontenera przycisku
  },
  button: {
    backgroundColor: '#00B37E', // Kolor tła przycisku
    paddingVertical: 10, // Wewnętrzne marginesy pionowe przycisku
    borderRadius: 5, // Zaokrąglenie krawędzi przycisku
    alignItems: 'center', // Wyśrodkowanie tekstu w przycisku
    marginHorizontal: 90, // Dodaje poziomy margines do przycisku
  },
  buttonText: {
    color: 'white', // Kolor tekstu
    fontSize: 16, // Rozmiar czcionki
    fontWeight: 'bold', // Pogrubienie tekstu
  },
  container: {
    flex: 1,
    backgroundColor: '#121214',
    // Usuń justifyContent jeśli jest ustawione na 'center'
  },
  scrollView: {
    flex: 1,
  },
  planNameStyle: {
    color: '#00B37E',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  exerciseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#121214',
    borderRadius: 10,
    height: 400,
  },
  exerciseName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  serieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#29292E',
    paddingHorizontal: 20,
    height: 35,
    margin: 5,
    borderRadius: 3,
  },
  serieNumber: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 10,
  },
  input: {
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: '#121214',
    borderWidth: 1,
    borderColor: '#00B37E',
    borderRadius: 3,
    padding: 4,
    height: 30,
    width: 50,
    textAlign: 'center',
    marginRight: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 6,
    marginLeft: 6,
    marginTop: 1,
    marginBottom: 20,
    borderRadius: 3,
  },
  buttonContainer: {
    padding: 10,
  },
  // ... (inne style)
});

export default Training;
