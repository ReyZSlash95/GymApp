import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';
import {addExercise} from '../../redux/actions/exerciseActions';

import styles from '../../styles/ExerciseScreenStyles';

const exercises = [
  {
    id: '1',
    name: 'Barbell Bent Over Row',
    type: 'back',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/back/BarbellBentOverRow.gif'),
  },
  {
    id: '2',
    name: 'Barbell Deadlift',
    type: 'back',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/back/BarbellDeadlift.gif'),
  },
  {
    id: '3',
    name: 'Bent Over Dumbbell Row',
    type: 'back',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/back/BentOverDumbbellRow.gif'),
  },
  {
    id: '4',
    name: 'Cable Rear Pulldown',
    type: 'back',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/back/CableRearPulldown.gif'),
  },
  {
    id: '5',
    name: 'Cable Straight Arm Pulldown',
    type: 'back',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/back/CableStraightArmPulldown.gif'),
  },
  {
    id: '6',
    name: 'Close Grip Cable Row',
    type: 'back',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/back/closegripcablerow.gif'),
  },
  {
    id: '7',
    name: 'Dumbbell Bent Over Reverse Row',
    type: 'back',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/back/DumbbellBentOverReverseRow.gif'),
  },
  {
    id: '8',
    name: 'Dumbbell Row',
    type: 'back',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/back/DumbbellRow.gif'),
  },
  {
    id: '9',
    name: 'Front Pulldown',
    type: 'back',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/back/FrontPulldown.gif'),
  },
  {
    id: '10',
    name: 'Half Kneeling Lat Pulldown',
    type: 'back',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/back/HalfKneelingLatPulldown.gif'),
  },
  {
    id: '11',
    name: 'Lat Pulldown',
    type: 'back',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/back/LatPulldown.gif'),
  },
  {
    id: '12',
    name: 'Lever Reverse T-Bar Row',
    type: 'back',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/back/LeverReverseTBarRow.gif'),
  },
  {
    id: '13',
    name: 'Pull Up',
    type: 'back',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/back/Pullup.gif'),
  },
  {
    id: '14',
    name: 'Rope Straight Arm Pulldown',
    type: 'back',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/back/RopeStraightArmPulldown.gif'),
  },
  {
    id: '15',
    name: 'Seated Cable Row',
    type: 'back',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/back/SeatedCableRow.gif'),
  },
  {
    id: '16',
    name: 'Single Arm Twisting Seated Cable Row',
    type: 'back',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/back/SingleArmTwistingSeatedCableRow.gif'),
  },
  {
    id: '17',
    name: 'Weighted Pull Up',
    type: 'back',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/back/WeightedPullup.gif'),
  },

  // Add more exercises here
];

import {useNavigation} from '@react-navigation/native';

const Back = () => {
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

export default Back;
