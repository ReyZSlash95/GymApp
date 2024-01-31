import React, {useRef, useEffect, useState, useCallback} from 'react';
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
import logoGym from '../img/Ui/LogoGym.png';
import {LineChart} from 'react-native-chart-kit';

const {width} = Dimensions.get('window');

// TRAINING IMPORT MODULE

// trainigDataHelpers.tsx import
// import {fetchTrainingDataFromFirebase} from './Training/trainingDataHelpers';
// import {loadTrainingDataFromAsyncStorage} from './Training/trainingDataHelpers';

const Training = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [activePlan, setActivePlan] = useState({id: null, type: null});
  const prevActivePlan = useRef(null);

  const planIdSourceFromRedux = useSelector(
    state => state.exercise.planIdSource,
  );

  const [chartData, setChartData] = useState(null);

  const [planData, setPlanData] = useState(null);
  const [bodyPartColors, setBodyPartColors] = useState({});

  const trainingData = useSelector(state => state.exercise.trainingData);

  const [isTrainingActive, setIsTrainingActive] = useState(false);
  const [trainingStartTime, setTrainingStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  // CHART
  const updateBodyPartColors = exercises => {
    const bodyPartCounts = exercises.reduce((counts, exercise) => {
      if (exercise.type) {
        counts[exercise.type] = (counts[exercise.type] || 0) + 1;
      }
      return counts;
    }, {});

    const newColors = {};
    for (const type in bodyPartCounts) {
      newColors[type] = getColorBasedOnCount(bodyPartCounts[type]);
    }
    setBodyPartColors(newColors);
  };
  const getColorBasedOnCount = count => {
    if (count >= 3) return '#ff0000';
    if (count === 2) return '#ff5252';
    if (count === 1) return '#ff7b7b';

    return 'transparent';
  };

  const processDataForChart = (trainings, selectedTimeRange) => {
    // Filter logic based on selectedTimeRange
    const now = new Date();
    const filteredTrainings = trainings.filter(training => {
      const trainingDate = training.completedDate.toDate();
      switch (selectedTimeRange) {
        case 'month':
          return (
            trainingDate >=
            new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
          );
        case 'year':
          return (
            trainingDate >=
            new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
          );
        default:
          return true; // dla zakresu 'all'
      }
    });

    const dataByExercise = {};
    const labels = new Set(); // Używamy Set do uniknięcia duplikatów

    filteredTrainings.sort((a, b) => {
      const dateA = a.completedDate.toDate();
      const dateB = b.completedDate.toDate();
      return dateA - dateB;
    });

    filteredTrainings.forEach(training => {
      const {exercises, completedDate} = training;

      if (!completedDate || typeof completedDate.toDate !== 'function') {
        console.error('Missing or invalid completedDate:', completedDate);
        return [];
      }

      const formattedCompletedDate = completedDate
        .toDate()
        .toLocaleDateString('en-US');
      labels.add(formattedCompletedDate); // Dodajemy datę do zbioru etykiet

      exercises.forEach(({name, series}) => {
        if (!dataByExercise[name]) {
          dataByExercise[name] = {};
        }

        let total1RM = 0;
        let seriesCount = 0;

        series.forEach(({weight, reps}) => {
          const parsedWeight =
            weight && !isNaN(weight) ? parseFloat(weight) : 0;
          const parsedReps = reps && !isNaN(reps) ? parseInt(reps, 10) : 0;

          // Oblicz 1RM używając wzoru Epleya
          const oneRM = parsedWeight * (1 + 0.0333 * parsedReps);

          if (!isNaN(oneRM)) {
            total1RM += oneRM;
            seriesCount++;
          }
        });

        // Oblicz średnią wartość 1RM dla tego ćwiczenia
        const average1RM = seriesCount > 0 ? total1RM / seriesCount : 0;

        if (!dataByExercise[name][formattedCompletedDate]) {
          dataByExercise[name][formattedCompletedDate] = 0;
        }
        dataByExercise[name][formattedCompletedDate] = average1RM;
      });
    });

    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

    const datasets = Object.keys(dataByExercise).map((key, index) => {
      // Wybór koloru dla zbioru danych na podstawie indexu
      const color = colors[index % colors.length];

      const exerciseData = [];
      labels.forEach(label => {
        exerciseData.push(dataByExercise[key][label] || 0);
      });

      return {
        label: key,
        data: exerciseData,
        color: (opacity = 1) => color, // Stały kolor
        strokeWidth: 2,
      };
    });

    return {
      labels: Array.from(labels),
      datasets,
    };
  };

  const fetchActivePlanId = async () => {
    try {
      const storedData = await AsyncStorage.getItem('activePlan');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setActivePlan({id: parsedData.id, type: parsedData.type});
      } else {
        console.log('Brak zapisanego ID planu');
        // Możesz tutaj dodać logikę, która obsłuży brak planu treningowego
      }
    } catch (error) {
      console.error('Error parsing active plan ID:', error);
    }
  };

  // POBIERANIE DANYCH TRENINGOWYCH Z FIREBASE ==================================
  const fetchTrainingDataFromFirebase = async (id, type): Promise<void> => {
    try {
      console.log('fetchTrainingDataFromFirebase');

      const savedTrainingData = await AsyncStorage.getItem('trainingData');
      if (savedTrainingData) {
        const parsedData = JSON.parse(savedTrainingData);
        if (parsedData.id === id) {
          console.log('Dane treningowe są już zapisane w AsyncStorage.');
          dispatch(setTrainingData(parsedData));
          return; // Zakończ funkcję, jeśli dane są już załadowane
        }
      }

      console.log('Ładowanie danych z Firebase...');

      // Reset timer for new training session
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setElapsedTime(0);

      let planData;

      if (type === 'History') {
        const doc = await firestore()
          .collection('trainingHistory')
          .doc(id)
          .get();

        if (doc.exists) {
          planData = {
            ...doc.data(),
            completedDate: doc.data().completedDate.toMillis(),
            id: doc.id,
          };
        }
      } else if (type === 'Plans') {
        const doc = await firestore().collection('trainingPlans').doc(id).get();

        if (doc.exists) {
          planData = {
            ...doc.data(),
            createdAt: doc.data().createdAt.toMillis(),
            id: doc.id,
          };
        }
      }
      if (planData) {
        console.log('planData', planData);
        console.log(planData.planName);

        fetchAllTrainingsByPlanName(planData.planName);

        await AsyncStorage.removeItem('trainingStartTime');
        setIsTrainingActive(false);

        dispatch(setTrainingData(planData));
        await AsyncStorage.setItem('trainingData', JSON.stringify(planData));
      } else {
        console.log('No data found for this ID');
      }
    } catch (error) {
      console.error('Error fetching training data from Firebase:', error);
    }
  };

  const fetchAllTrainingsByPlanName = async planName => {
    try {
      const querySnapshot = await firestore()
        .collection('trainingHistory')
        .where('planName', '==', planName)
        .get();

      let trainings = [];
      querySnapshot.forEach(doc => {
        trainings.push(doc.data());
      });

      // Przetworzenie danych dla wykresu
      const processedChartData = processDataForChart(trainings);
      console.log('processedChartData:', processedChartData);
      // setChartData(processedChartData);

      // Zapisanie danych do AsyncStorage
      await AsyncStorage.setItem(
        'allTrainingsDataForLineChart',
        JSON.stringify(processedChartData),
      );
    } catch (error) {
      console.error('Error fetching all trainings by planName:', error);
    }
  };

  // USE EFFECTS ================================================================

  useEffect(() => {
    console.log('useeffect1');
    fetchActivePlanId();
  }, [route]);

  useEffect(() => {
    console.log('useeffect2');
    const {id, type} = activePlan;
    if (id && type) {
      fetchTrainingDataFromFirebase(id, type);
    }
  }, [activePlan]);

  useEffect(() => {
    console.log('useeffect3');
    console.log('Aktualny czas treningu 123123123131:', elapsedTime);
  }, [elapsedTime]);

  useEffect(() => {
    console.log('useeffect4');
    const checkActiveTraining = async () => {
      const savedStartTime = await AsyncStorage.getItem('trainingStartTime');
      if (savedStartTime) {
        const startTime = parseInt(savedStartTime, 10);
        setTrainingStartTime(startTime);
        setIsTrainingActive(true);
        startTimer(startTime);
        console.log('start clock 12345');
      }
    };

    const loadChartData = async () => {
      const storedData = await AsyncStorage.getItem(
        'allTrainingsDataForLineChart',
      );
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setChartData(parsedData);
      }
    };

    loadChartData();
    checkActiveTraining();
  }, []);

  // TIMER TIMER TIMER ==========================================================
  const startTimer = startTime => {
    if (intervalId) {
      console.log('Stopping existing timer with intervalId:', intervalId);
      clearInterval(intervalId);
    }
    console.log('Timer started with start time:', startTime);
    const interval = setInterval(() => {
      const currentTime = Math.floor((Date.now() - startTime) / 1000);
      console.log('Aktualny czas treningu:', currentTime);
      console.log('intervalid1', interval);
      setElapsedTime(currentTime);
    }, 1000);
    setIntervalId(interval);
  };

  const stopAndResetTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    console.log('Timer zatrzymany. Końcowy czas treningu:', elapsedTime);
    setElapsedTime(0);
  };

  const formatTime = seconds => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // START END SAVETRAINING  ==========================================================

  const startTraining = async () => {
    const startTime = Date.now();
    console.log('Trening rozpoczęty o czasie:', startTime);

    await AsyncStorage.setItem('trainingStartTime', startTime.toString());
    if (activePlan.id) {
      await AsyncStorage.setItem('activePlan.id', [activePlan.id].toString());
    }
    setTrainingStartTime(startTime);
    setIsTrainingActive(true);
    startTimer(startTime);

    // Dodaj nowy punkt danych (0) do wykresu dla każdego ćwiczenia
    if (chartData) {
      const newChartData = {
        // zapytanie do czatgpt - czy można to jakoś uprościć?
        ...chartData,
        datasets: chartData.datasets.map(dataset => ({
          ...dataset,
          data: [...dataset.data, 0], // Dodaj 0 na końcu każdego zbioru danych
        })),
      };
      setChartData(newChartData);
    }
  };

  const endTraining = async () => {
    const duration = elapsedTime;
    saveTrainingHistory(duration);
    await AsyncStorage.removeItem('trainingStartTime');
    await AsyncStorage.removeItem('activePlan');
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

  const saveTrainingHistory = async duration => {
    console.log('Zapisywanie historii treningu z czasem trwania:', duration);
    const savedPlanId = await AsyncStorage.getItem('activePlan.id');
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

  // ADD REMOVE SERIES =========================================================

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

  // TRAINING SERIES UPDATE =================================================

  // Aktualizacja danych w AsyncStorage

  // Aktualizowana funkcja handleSeriesCheck
  const handleSeriesCheck = async (exerciseIndex, serieIndex) => {
    const storedData = await AsyncStorage.getItem('trainingData');
    const trainingData = storedData ? JSON.parse(storedData) : null;

    if (trainingData) {
      const newChecked =
        !trainingData.exercises[exerciseIndex].series[serieIndex].checked;
      trainingData.exercises[exerciseIndex].series[serieIndex].checked =
        newChecked;

      // Aktualizuj stan Redux
      dispatch(
        updateSeriesData(exerciseIndex, serieIndex, 'checked', newChecked),
      );

      // Aktualizuj AsyncStorage
      await updateTrainingDataInStorage(trainingData);

      // Aktualizuj wykres, jeśli to konieczne
      updateLastChartDataPoint(trainingData);
    }
  };

  // Aktualizowana funkcja handleSeriesUpdate
  const handleSeriesUpdate = async (
    exerciseIndex,
    serieIndex,
    field,
    value,
  ) => {
    let updatedValue = value;
    if (field === 'weight' && value !== '') {
      updatedValue = parseFloat(value);
    } else if (field === 'reps' && value !== '') {
      updatedValue = parseInt(value, 10);
    }

    if (!isNaN(updatedValue)) {
      const storedData = await AsyncStorage.getItem('trainingData');
      const trainingData = storedData ? JSON.parse(storedData) : null;

      if (trainingData) {
        trainingData.exercises[exerciseIndex].series[serieIndex][field] =
          updatedValue;

        // Aktualizuj stan Redux
        dispatch(
          updateSeriesData(exerciseIndex, serieIndex, field, updatedValue),
        );

        // Aktualizuj AsyncStorage
        await updateTrainingDataInStorage(trainingData);

        // Aktualizuj wykres, jeśli to konieczne
        updateLastChartDataPoint(trainingData);
      }
    }
  };

  const updateTrainingDataInStorage = async updatedTrainingData => {
    await AsyncStorage.setItem(
      'trainingData',
      JSON.stringify(updatedTrainingData),
    );
  };

  // LAST CHART DATA POINT ====================================================

  const updateLastChartDataPoint = updatedTrainingData => {
    if (chartData && updatedTrainingData && updatedTrainingData.exercises) {
      let updatedChartData = {...chartData};

      // Logika aktualizacji danych wykresu
      updatedTrainingData.exercises.forEach((exercise, index) => {
        const newExerciseDataPoint = calculateExerciseData(exercise);
        updatedChartData.datasets[index].data[
          updatedChartData.datasets[index].data.length - 1
        ] = newExerciseDataPoint;
      });

      setChartData(updatedChartData);
    }
  };

  // Aktualizowana funkcja calculateExerciseData
  const calculateExerciseData = exercise => {
    const validSeries = exercise.series.filter(
      serie => serie.checked && !isNaN(serie.weight) && !isNaN(serie.reps),
    );

    let total1RM = 0;

    validSeries.forEach(serie => {
      const oneRM =
        parseFloat(serie.weight) * (1 + 0.0333 * parseInt(serie.reps, 10));
      total1RM += oneRM;
    });

    return validSeries.length > 0 ? total1RM / validSeries.length : 0;
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
            <View>
              {chartData &&
                chartData.datasets &&
                chartData.datasets[exerciseIndex] && (
                  <View style={styles.exerciseChart}>
                    <LineChart
                      data={{
                        labels: chartData.labels,
                        datasets: [chartData.datasets[exerciseIndex]],
                      }}
                      width={Dimensions.get('window').width - 40}
                      height={100}
                      chartConfig={{
                        backgroundColor: '#e4b04e',
                        backgroundGradientFrom: '#e4b04e',
                        backgroundGradientTo: '#e4b04e',
                        color: (opacity = 1) =>
                          `rgba(255, 255, 255, ${opacity})`,
                        propsForDots: {
                          r: '6',
                          strokeWidth: '2',
                          stroke: '#ffa726',
                        },
                      }}
                      bezier
                      style={{
                        marginVertical: 8,
                        borderRadius: 16,
                      }}
                    />
                  </View>
                )}
            </View>
          </View>
        ))}
      </ScrollView>
      {/* <View>{renderChart()}</View> */}
      {/* Dodanie wykresu dla ćwiczenia */}
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
