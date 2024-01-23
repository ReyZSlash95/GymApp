import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';
import {addExercise} from '../../redux/actions/exerciseActions';

import styles from '../../styles/ExerciseScreenStyles';

const exercises = [
  {
    id: '1',
    name: 'Alternating Dumbbell Front Raise',
    type: 'shoulders',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/shoulders/AlternatingDumbbellFrontRaise.gif'),
  },
  {
    id: '2',
    name: 'Arnold Press',
    type: 'shoulders',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/shoulders/ArnoldPress.gif'),
  },
  {
    id: '3',
    name: 'Barbell Standing Military Press',
    type: 'shoulders',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/shoulders/BarbellStandingMilitaryPress.gif'),
  },
  {
    id: '4',
    name: 'Bent Over Lateral Raise',
    type: 'shoulders',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/shoulders/BentOverLateralRaise.gif'),
  },
  {
    id: '5',
    name: 'Cable Upright Row',
    type: 'shoulders',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/shoulders/CableUprightRow.gif'),
  },
  {
    id: '6',
    name: 'Dumbbell Chest Supported Lateral Raises',
    type: 'shoulders',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/shoulders/DumbbellChestSupportedLateralRaises.gif'),
  },
  {
    id: '7',
    name: 'Dumbbell Cuban External Rotation',
    type: 'shoulders',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/shoulders/DumbbellCubanExternalRotation.gif'),
  },
  {
    id: '8',
    name: 'Dumbbell Lateral Raise',
    type: 'shoulders',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/shoulders/DumbbellLateralRaise.gif'),
  },
  {
    id: '9',
    name: 'Dumbbell Shoulder Press',
    type: 'shoulders',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/shoulders/DumbbellShoulderPress.gif'),
  },
  {
    id: '10',
    name: 'Face Pull',
    type: 'shoulders',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/shoulders/FacePull.gif'),
  },
  {
    id: '11',
    name: 'Half Kneeling High Cable Row Rope',
    type: 'shoulders',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/shoulders/HalfKneelingHighCableRowRope.gif'),
  },
  {
    id: '12',
    name: 'Lever Shoulder Press',
    type: 'shoulders',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/shoulders/LeverShoulderPress.gif'),
  },
  {
    id: '13',
    name: 'Rear Delt Machine Flys',
    type: 'shoulders',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/shoulders/RearDeltMachineFlys.gif'),
  },
  {
    id: '14',
    name: 'Seated Rear Lateral Dumbbell Raise',
    type: 'shoulders',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/shoulders/SeatedRearLateralDumbbellRaise.gif'),
  },
  {
    id: '15',
    name: 'Standing Dumbbell Overhead Press',
    type: 'shoulders',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/shoulders/StandingDumbbellOverheadPress.gif'),
  },
  {
    id: '16',
    name: 'Two Arm Dumbbell Front Raise',
    type: 'shoulders',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/shoulders/TwoArmDumbbellFrontRaise.gif'),
  },
  // Add more exercises here
];

import {useNavigation} from '@react-navigation/native';

const Shoulders = () => {
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

export default Shoulders;
