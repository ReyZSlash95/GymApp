import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faDumbbell,
  faClock,
  faRepeat,
  faWeightHanging,
  faRankingStar,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';

import {
  countExercises,
  countSeriesAndReps,
  calculateTotalAndMaxWeight,
} from './TrainingDetail/TrainingUtils';

import FastImage from 'react-native-fast-image';

import MuscleIllustration from '../bodyParts/MuscleIllustration';

const TrainingDetail = ({route}) => {
  const {planId} = route.params;
  const [planData, setPlanData] = useState(null);
  const [bodyPartColors, setBodyPartColors] = useState({});

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
    console.log(newColors);
    setBodyPartColors(newColors);
  };

  const getColorBasedOnCount = count => {
    if (count >= 3) return '#ff0000';
    if (count === 2) return '#ff5252';
    if (count === 1) return '#ff7b7b';
    return 'transparent';
  };

  useEffect(() => {
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
        }
      } catch (error) {
        console.error('Error fetching training data:', error);
      }
    };

    fetchPlanData();
  }, [planId]);

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
});

export default TrainingDetail;
