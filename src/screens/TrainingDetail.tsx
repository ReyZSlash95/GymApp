import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Button,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faDumbbell,
  faClock,
  faRepeat,
  faWeightHanging,
  faRankingStar,
  faCheck,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

import {
  countExercises,
  countSeriesAndReps,
  calculateTotalAndMaxWeight,
} from './TrainingDetail/TrainingUtils';

import FastImage from 'react-native-fast-image';
import {LineChart} from 'react-native-chart-kit';

import MuscleIllustration from '../bodyParts/MuscleIllustration';
import {TouchableOpacity} from 'react-native-gesture-handler';

const TrainingDetail = ({route}) => {
  const {planId} = route.params;
  const [planData, setPlanData] = useState(null);
  const [bodyPartColors, setBodyPartColors] = useState({});
  const [chartData, setChartData] = useState(null);

  const [expandedExercise, setExpandedExercise] = useState(null);

  const toggleExerciseDetail = index => {
    setExpandedExercise(expandedExercise === index ? null : index);
  };

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

  // New state variable for the selected time range
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');

  // Function to handle time range selection
  const handleTimeRangeChange = timeRange => {
    setSelectedTimeRange(timeRange);
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

  useEffect(() => {
    const fetchAllTrainingsByPlanId = async planId => {
      try {
        const querySnapshot = await firestore()
          .collection('trainingHistory')
          .where('planId', '==', planId)
          .get();

        let trainings = [];
        querySnapshot.forEach(doc => {
          trainings.push(doc.data());
        });

        // console.log('Trainings:', trainings);
        // Przetworzenie danych dla wykresu
        const processedChartData = processDataForChart(
          trainings,
          selectedTimeRange,
        );
        setChartData(processedChartData);
      } catch (error) {
        console.error('Error fetching all trainings by planId:', error);
      }
    };

    const fetchPlanData = async () => {
      try {
        const documentSnapshot = await firestore()
          .collection('trainingHistory')
          .doc(planId)
          .get();

        if (documentSnapshot.exists) {
          // setPlanData(documentSnapshot.data());
          const data = documentSnapshot.data();
          setPlanData(data);
          updateBodyPartColors(data.exercises);

          console.log('Plan id:', data.planId);
          // Po pobraniu danych pierwszego treningu, pobierz wszystkie treningi o tym samym planId
          fetchAllTrainingsByPlanId(data.planId);
        }
      } catch (error) {
        console.error('Error fetching training data:', error);
      }
    };

    fetchPlanData();

    // every training with planId
  }, [planId, selectedTimeRange]);

  if (!planData) {
    return <Text>Loading...</Text>;
  }

  const numberOfExercises = countExercises(planData.exercises);
  const {totalSeries, totalReps} = countSeriesAndReps(planData.exercises);
  const {totalWeight, maxWeight} = calculateTotalAndMaxWeight(
    planData.exercises,
  );

  const formatDuration = duration => {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / 1000 / 60) % 60);
    const hours = Math.floor(duration / 1000 / 3600);

    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedHours = hours < 10 ? `0${hours}` : hours;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  if (chartData) {
    console.log(
      'Rendering chart with data:',
      // chartData.labels,
      // chartData.datasets,
    );
    console.log('chartData:', chartData.datasets[0]);
    console.log('data labels:', chartData.labels[0]);
    console.log('data', chartData.labels);
    // Komponent LineChart
  }

  const Legend = ({datasets}) => {
    return (
      <View style={styles.legend}>
        {datasets.map((dataset, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[
                styles.legendIndicator,
                {backgroundColor: dataset.color(1)},
              ]}
            />
            <Text style={styles.legendText}>{dataset.label}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.section1}>
        <Text style={styles.planName}>{planData.planName}</Text>
        <View style={styles.gridContainer}>
          <View style={styles.gridColumn}>
            <View style={styles.gridItem}>
              <FontAwesomeIcon icon={faDumbbell} size={24} color={'black'} />
              <View style={styles.textColumn}>
                <Text style={styles.labelText}>EXERCISES</Text>
                <Text style={styles.valueText}>{numberOfExercises}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <FontAwesomeIcon icon={faCheck} size={24} color={'black'} />
              <View style={styles.textColumn}>
                <Text style={styles.labelText}>SERIES</Text>
                <Text style={styles.valueText}>{totalSeries}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <FontAwesomeIcon icon={faRepeat} size={24} color={'black'} />
              <View style={styles.textColumn}>
                <Text style={styles.labelText}>REPS</Text>
                <Text style={styles.valueText}>{totalReps}</Text>
              </View>
            </View>
          </View>
          <View style={styles.gridColumn}>
            <View style={styles.gridItem}>
              <FontAwesomeIcon icon={faRankingStar} size={24} color={'black'} />
              <View style={styles.textColumn}>
                <Text style={styles.labelText}>MAX WEIGHT</Text>
                <Text style={styles.valueText}>{maxWeight}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <FontAwesomeIcon
                icon={faWeightHanging}
                size={24}
                color={'black'}
              />
              <View style={styles.textColumn}>
                <Text style={styles.labelText}>WEIGHT</Text>
                <Text style={styles.valueText}>{totalWeight}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <FontAwesomeIcon icon={faClock} size={24} color={'black'} />
              <View style={styles.textColumn}>
                <Text style={styles.labelText}>DURATION</Text>
                <Text style={styles.valueText}>
                  {formatDuration(planData.duration)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.section2}>
        <Text style={styles.planName}>EXERCISES</Text>
        {/* SEKCJA 2 */}
        {planData.exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseItem}>
            <View style={styles.imageContainer}>
              <FastImage source={exercise.image} style={styles.image} />
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <TouchableOpacity
                style={styles.buttonDetails}
                onPress={() => toggleExerciseDetail(index)}>
                <FontAwesomeIcon icon={faChartLine} size={24} color={'black'} />
              </TouchableOpacity>
            </View>

            <View style={styles.serieRow}>
              <View style={styles.serieColumn}>
                <Text>SERIES</Text>
                {exercise.series.map((serie, sIndex) => (
                  <Text key={sIndex} style={styles.numberText}>
                    {sIndex + 1}:
                  </Text>
                ))}
              </View>
              <View style={styles.repsColumn}>
                <Text>REPS</Text>
                {exercise.series.map((serie, sIndex) => (
                  <View key={sIndex} style={styles.numberRow}>
                    <Text style={styles.numberText}>{serie.reps}</Text>
                    <Text> reps</Text>
                  </View>
                ))}
              </View>
              <View style={styles.weightColumn}>
                <Text>WEIGHT</Text>
                {exercise.series.map((serie, sIndex) => (
                  <View key={sIndex} style={styles.numberRow}>
                    <Text style={styles.numberText}>{serie.weight}</Text>
                    <Text> kg</Text>
                  </View>
                ))}
              </View>
            </View>
            {/* Dodanie wykresu dla ćwiczenia */}
            {expandedExercise === index && (
              <View>
                {chartData &&
                  chartData.datasets &&
                  chartData.datasets[index] && (
                    <View style={styles.exerciseChart}>
                      <LineChart
                        data={{
                          labels: chartData.labels,
                          datasets: [chartData.datasets[index]],
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
            )}
          </View>
        ))}
      </View>
      {/* SEKCJA 3 */}
      <View style={styles.section3}>
        <Text style={styles.planName}>MUSCLE PARTS INVOLVED</Text>
        {/* SEKCJA 2 */}
        <View style={styles.bodyPartsImage}>
          <MuscleIllustration bodyPartColors={bodyPartColors} />
        </View>
      </View>

      <View style={styles.sectionChart}>
        <View
          style={{
            flexDirection: 'row',

            justifyContent: 'space-between',
            marginHorizontal: 60,
            marginVertical: 10,
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => handleTimeRangeChange('month')}>
            <FontAwesomeIcon icon={faChartLine} size={24} color={'black'} />
            <Text
              style={
                selectedTimeRange === 'month'
                  ? {fontWeight: 'bold'}
                  : {fontWeight: 'normal'}
              }>
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => handleTimeRangeChange('year')}>
            <FontAwesomeIcon icon={faChartLine} size={24} color={'black'} />
            <Text
              style={
                selectedTimeRange === 'year'
                  ? {fontWeight: 'bold'}
                  : {fontWeight: 'normal'}
              }>
              Year
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => handleTimeRangeChange('all')}>
            <FontAwesomeIcon icon={faChartLine} size={24} color={'black'} />
            <Text
              style={
                selectedTimeRange === 'all'
                  ? {fontWeight: 'bold'}
                  : {fontWeight: 'normal'}
              }>
              All time
            </Text>
          </TouchableOpacity>
          {/* <Button
            title="Month"
            onPress={() => handleTimeRangeChange('month')}
          /> */}
          {/* <Button title="Year" onPress={() => handleTimeRangeChange('year')} /> */}
          {/* <Button
            title="All Time"
            onPress={() => handleTimeRangeChange('all')}
          /> */}
        </View>
        {chartData && (
          <>
            <LineChart
              data={chartData}
              width={Dimensions.get('window').width - 40} // Jak wcześniej
              height={220}
              chartConfig={{
                backgroundColor: '#e4b04e',
                backgroundGradientFrom: '#e4b04e',
                backgroundGradientTo: '#e4b04e',
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
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
              legend={chartData.datasets.map(dataset => dataset.label)} // Dodanie legendy
            />
            <Legend datasets={chartData.datasets} />
          </>
        )}
      </View>

      {/* Pozostałe sekcje jeśli są potrzebne */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#121214',
  },
  section1: {
    backgroundColor: '#e4b04e',
    flex: 1,
    margin: 20,
    borderRadius: 5,
    padding: 10,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  gridColumn: {
    width: '45%', // Szerokość kolumny
  },
  gridItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  textColumn: {
    marginLeft: 10,
  },
  labelText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
  },
  valueText: {
    fontSize: 16,
    color: 'black',
  },
  // Stylowanie pozostałych sekcji
  // SEKCJA 2

  exerciseChart: {
    paddingHorizontal: 10, // Dodaje wewnętrzny odstęp po obu stronach
    paddingTop: 10, // Dodaje wewnętrzny odstęp od góry
    overflow: 'hidden', // Zapobiega wychodzeniu zawartości poza kontener
    alignItems: 'center', // Wyśrodkowanie wykresu w poziomie
  },

  section2: {
    backgroundColor: '#e4b04e',
    flex: 1,
    margin: 20,
    borderRadius: 5,
    padding: 10,
  },
  exerciseItem: {
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 10,

    flexShrink: 1,
  },
  serieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serieColumn: {
    width: '30%',
    alignItems: 'center',
  },
  repsColumn: {
    width: '30%',
    alignItems: 'center',
  },
  weightColumn: {
    width: '30%',
    alignItems: 'center',
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageContainer: {
    flexDirection: 'row', // Dodaj to
    justifyContent: 'space-between', // Dodaj to
    backgroundColor: '#e4b04e',
    alignItems: 'center',
    // justifyContent: 'center',
    borderRadius: 5,
    borderBottomWidth: 5,
    borderBottomColor: 'black',
    borderTopColor: 'black',
  },
  image: {
    alignContent: 'center',
    width: 40,
    height: 40,
    borderTopStartRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 2, // Dodaj cień z prawej strony
      height: 0, // Usuń cień z góry i dołu
    },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 5,
  },

  buttonDetails: {},
  // SEKCJA 3
  section3: {
    backgroundColor: '#e4b04e',
    flex: 1,
    margin: 20,
    borderRadius: 5,
    padding: 10,
  },

  bodyPartsImage: {
    marginLeft: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // SEKCJA 4
  sectionChart: {
    backgroundColor: '#e4b04e', // Tło sekcji wykresu
    flex: 1,
    margin: 20,
    borderRadius: 5,
  },
  legend: {
    // flexDirection zmienione z 'row' na 'column'
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 10,
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5, // Dodano odstęp pionowy między elementami legendy
  },
  legendIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  legendText: {
    fontWeight: 'bold',
  },
});

export default TrainingDetail;
