import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';
import {addExercise} from '../../redux/actions/exerciseActions';

import styles from '../../styles/ExerciseScreenStyles';

const exercises = [
  {
    id: '1',
    name: 'Barbell Curl',
    type: 'biceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/biceps/BarbellCurl.gif'),
  },
  {
    id: '2',
    name: 'Cable Reverse Grip Bar Biceps Curl',
    type: 'biceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/biceps/CableReverseGripBarBicepsCurl.gif'),
  },
  {
    id: '3',
    name: 'Double Arm Dummbell Curl',
    type: 'biceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/biceps/DoubleArmDumbbellCurl.gif'),
  },
  {
    id: '4',
    name: 'Dumbbell Curl',
    type: 'biceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/biceps/DumbbellCurl.gif'),
  },
  {
    id: '5',
    name: 'Dumbbell Preacher Curl',
    type: 'biceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/biceps/DumbbellPreacherCurl.gif'),
  },
  {
    id: '6',
    name: 'Hammer Curl',
    type: 'biceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/biceps/HammerCurl.gif'),
  },
  {
    id: '7',
    name: 'High Cable Single Arm Bicep Curl',
    type: 'biceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/biceps/HighCableSingleArmBicepCurl.gif'),
  },
  {
    id: '8',
    name: 'Lever Preacher Curl',
    type: 'biceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/biceps/LeverPreacherCurl.gif'),
  },
  {
    id: '9',
    name: 'One Arm Cable Curl',
    type: 'biceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/biceps/OneArmCableCurl.gif'),
  },
  {
    id: '10',
    name: 'Overhead Cable Curl',
    type: 'biceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/biceps/overheadCableCurl.gif'),
  },
  {
    id: '11',
    name: 'Prone Incline Biceps Curl',
    type: 'biceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/biceps/ProneInclineBicepsCurl.gif'),
  },
  {
    id: '12',
    name: 'Seated Hammer Curl',
    type: 'biceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/biceps/SeatedHammerCurl.gif'),
  },
  {
    id: '13',
    name: 'Seated Zottman Curl',
    type: 'biceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/biceps/SeatedZottmanCurl.gif'),
  },
  {
    id: '14',
    name: 'Z Bar Preacher Curl',
    type: 'biceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/biceps/ZBarPreacherCurl.gif'),
  },
  {
    id: '15',
    name: 'Zottman Curl',
    type: 'biceps',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/biceps/zottmanCurl.gif'),
  },
  // Add more exercises here
];

import {useNavigation} from '@react-navigation/native';

const Biceps = () => {
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

export default Biceps;
