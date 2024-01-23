import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';
import {addExercise} from '../../redux/actions/exerciseActions';

import styles from '../../styles/ExerciseScreenStyles';

const exercises = [
  {
    id: '1',
    name: 'Asisted Triceps Dips',
    type: 'triceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/triceps/AsistedTricepsDips.gif'),
  },
  {
    id: '2',
    name: 'Barbell Triceps Dips',
    type: 'triceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/triceps/BarbellTricepsExtension.gif'),
  },
  {
    id: '3',
    name: 'Cable Concentration Extension On Knee',
    type: 'triceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/triceps/CableConcentrationExtensiononknee.gif'),
  },
  {
    id: '4',
    name: 'Cable Rear Drive',
    type: 'triceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/triceps/CableRearDrive.gif'),
  },
  {
    id: '5',
    name: 'Cable Rope Overhead Triceps Extension',
    type: 'triceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/triceps/CableRopeOverheadTricepsExtension.gif'),
  },
  {
    id: '6',
    name: 'Dumbbell Kickback',
    type: 'triceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/triceps/DumbbellKickback.gif'),
  },
  {
    id: '7',
    name: 'High Pulleyy Overhead Tricep Extension',
    type: 'triceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/triceps/HighPulleyOverheadTricepExtension.gif'),
  },
  {
    id: '8',
    name: 'Lever Overhand Triceps Dip',
    type: 'triceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/triceps/LeverOverhandTricepsDip.gif'),
  },
  {
    id: '9',
    name: 'Push Down',
    type: 'triceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/triceps/Pushdown.gif'),
  },
  {
    id: '10',
    name: 'Seated EZ Bar Overhead Triceps Extension',
    type: 'triceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/triceps/SeatedEZBarOverheadTricepsExtension.gif'),
  },
  // Add more exercises here
];

import {useNavigation} from '@react-navigation/native';

const Triceps = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handlePress = exercise => {
    dispatch(addExercise(exercise));
    navigation.navigate('NewPlan');
  };

  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.button} onPress={() => handlePress(item)}>
      <FastImage source={item.image} style={styles.image} />
      <Text style={styles.exerciseText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={exercises}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Triceps;
