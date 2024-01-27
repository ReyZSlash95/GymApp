import React, {useEffect, useState, useCallback} from 'react';
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
  resetPlanId,
} from '../redux/actions/exerciseActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../img/Ui/LogoGymApp.png';
import logoGym from '../img/Ui/LogoGym.png';

const {width} = Dimensions.get('window');

const Training = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const planIdFromRedux = useSelector(state => state.exercise.planId);
  const planIdSourceFromRedux = useSelector(
    state => state.exercise.planIdSource,
  );

  const trainingData = useSelector(state => state.exercise.trainingData);

  const [isTrainingActive, setIsTrainingActive] = useState(false);
  const [trainingStartTime, setTrainingStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  // test
  const loadTrainingData = async () => {
    console.log(planIdFromRedux, planIdSourceFromRedux);
    if (planIdSourceFromRedux === 'History') {
      try {
        const trainingHistoryDoc = await firestore()
          .collection('trainingHistory')
          .doc(planIdFromRedux)
          .get();

        if (trainingHistoryDoc.exists) {
          let trainingHistoryData = trainingHistoryDoc.data();

          // Przekształć 'completedDate' na timestamp
          if (trainingHistoryData.completedDate) {
            trainingHistoryData = {
              ...trainingHistoryData,
              completedDate: trainingHistoryData.completedDate.toMillis(),
            };
          }

          dispatch(setTrainingData(trainingHistoryData));

          // Zapisz dane historii treningu w AsyncStorage
          await AsyncStorage.setItem(
            'trainingData',
            JSON.stringify(trainingHistoryData),
          );
        } else {
          console.log('Brak danych historii treningu dla tego ID');
        }
      } catch (error) {
        console.error('Błąd podczas ładowania historii treningu:', error);
      }
    } else if (planIdSourceFromRedux === 'Plans') {
      try {
        const planDoc = await firestore()
          .collection('trainingPlans')
          .doc(planIdFromRedux)
          .get();

        if (planDoc.exists) {
          const planData = planDoc.data();
          const createdAtTimestamp = planData.createdAt
            ? planData.createdAt.toMillis()
            : Date.now();
          dispatch(
            setTrainingData({...planData, createdAt: createdAtTimestamp}),
          );
          await AsyncStorage.setItem('trainingData', JSON.stringify(planData));
        } else {
          console.log('Brak danych planu treningowego dla tego ID');
        }
      } catch (error) {
        console.error('Błąd podczas ładowania planu treningowego:', error);
      }
    } else {
      const savedTrainingData = await AsyncStorage.getItem('trainingData');
      if (savedTrainingData) {
        dispatch(setTrainingData(JSON.parse(savedTrainingData)));
      } else {
        console.log('Brak zapisanych danych treningowych');
      }
    }
  };
  // end test

  useEffect(() => {
    loadTrainingData();

    const checkActiveTraining = async () => {
      const savedStartTime = await AsyncStorage.getItem('trainingStartTime');
      if (savedStartTime) {
        const startTime = parseInt(savedStartTime, 10);
        setTrainingStartTime(startTime);
        setIsTrainingActive(true);
        startTimer(startTime);
      }
    };

    checkActiveTraining();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [planIdFromRedux, route.params?.trainingHistoryId, dispatch, getPlan]);

  const startTimer = startTime => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    setIntervalId(interval);
  };

  const stopAndResetTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setElapsedTime(0);
  };

  const getPlan = useCallback(
    async planId => {
      try {
        const planDocument = await firestore()
          .collection('trainingPlans')
          .doc(planId)
          .get();

        if (planDocument.exists) {
          const planData = planDocument.data();

          // Konwersja Timestamp na milisekundy
          const createdAtTimestamp = planData.createdAt
            ? planData.createdAt.toMillis() // zmiana z `planData.createdAt.seconds * 1000`
            : Date.now();

          dispatch(
            setTrainingData({...planData, createdAt: createdAtTimestamp}),
          );
          await AsyncStorage.setItem('trainingData', JSON.stringify(planData));
        } else {
          Alert.alert('Błąd', 'Nie znaleziono planu treningowego.');
        }
      } catch (error) {
        console.error('Błąd podczas pobierania planu:', error);
      }
    },
    [dispatch],
  );

  // REST OF THE CODE

  const startTraining = async () => {
    const startTime = Date.now();
    await AsyncStorage.setItem('trainingStartTime', startTime.toString());
    if (planIdFromRedux) {
      await AsyncStorage.setItem('activePlanId', planIdFromRedux.toString());
    }
    setTrainingStartTime(startTime);
    setIsTrainingActive(true);
    startTimer(startTime);
  };

  const endTraining = async () => {
    const duration = elapsedTime;
    saveTrainingHistory(duration);
    await AsyncStorage.removeItem('trainingStartTime');
    await AsyncStorage.removeItem('activePlanId');
    setIsTrainingActive(false);
    stopAndResetTimer();
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

  const handleDuplicateLastSeries = async exerciseIndex => {
    const updatedExercises = trainingData.exercises.map((exercise, index) => {
      if (index === exerciseIndex) {
        const lastSeries = exercise.series[exercise.series.length - 1];
        const newSeries = {...lastSeries};
        return {...exercise, series: [...exercise.series, newSeries]};
      }
      return exercise;
    });

    const updatedTrainingData = {...trainingData, exercises: updatedExercises};
    dispatch(setTrainingData(updatedTrainingData));
    await AsyncStorage.setItem(
      'trainingData',
      JSON.stringify(updatedTrainingData),
    );
  };

  const handleRemoveLastSeries = async exerciseIndex => {
    const updatedExercises = trainingData.exercises.map((exercise, index) => {
      if (index === exerciseIndex && exercise.series.length > 1) {
        return {
          ...exercise,
          series: exercise.series.slice(0, exercise.series.length - 1),
        };
      }
      return exercise;
    });

    const updatedTrainingData = {...trainingData, exercises: updatedExercises};
    dispatch(setTrainingData(updatedTrainingData));
    await AsyncStorage.setItem(
      'trainingData',
      JSON.stringify(updatedTrainingData),
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
      duration, // Czas trwania treningu
      planName: trainingData.planName,
    };

    try {
      await firestore().collection('trainingHistory').add(trainingHistoryData);
      Alert.alert('Sukces', 'Historia treningu została zapisana.');
      await AsyncStorage.removeItem('trainingData');
      dispatch(resetTrainingData());
      dispatch(resetPlanId());
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

  const formatTime = seconds => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.planNameStyle}>{trainingData.planName}</Text>
      <ScrollView horizontal pagingEnabled style={styles.scrollView}>
        {trainingData.exercises.map((exercise, exerciseIndex) => (
          <View key={exerciseIndex} style={[styles.exerciseContainer, {width}]}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <FastImage source={exercise.image} style={styles.image} />
            <Text style={styles.timerText}>
              Czas treningu: {formatTime(elapsedTime)}
            </Text>

            <View style={styles.buttonContainerSeriesAdd}>
              <TouchableOpacity
                style={styles.addSeriesButton}
                onPress={() => handleRemoveLastSeries(exerciseIndex)}>
                <Text style={styles.addSeriesButtonText}>USUN</Text>
              </TouchableOpacity>
            </View>

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
            {/* Dodaj serie */}
            <View style={styles.buttonContainerSeriesAdd}>
              <TouchableOpacity
                style={styles.addSeriesButton}
                onPress={() => handleDuplicateLastSeries(exerciseIndex)}>
                <Text style={styles.addSeriesButtonText}>DODAJ</Text>
              </TouchableOpacity>
            </View>
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
  // HEADER BUTTON
  headerButton: {
    backgroundColor: '#e4b04e',
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  headerButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  //
  detailContainer: {
    backgroundColor: '#e4b04e',
    borderRadius: 3,
    margin: 5,
    // padding: 1,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },

  buttonContainerSeriesAdd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
    width: '80%',
  },
  addSeriesButton: {
    backgroundColor: '#00B37E',
    padding: 3,
    margin: 3,

    borderRadius: 5,
  },
  addSeriesButtonText: {
    color: '#121214',
    fontSize: 12,
    fontWeight: 'bold',
  },
  //
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
    // textAlign: 'center',
    marginLeft: 20,
    marginVertical: 10,
  },
  exerciseContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#121214',
    borderRadius: 10,
  },
  exerciseName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    // marginBottom: 10,
  },
  serieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#29292E',
    paddingHorizontal: 40,
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
