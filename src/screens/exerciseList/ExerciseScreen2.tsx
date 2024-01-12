import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';
import {addExercise} from '../../redux/actions/exerciseActions';

import styles from '../../styles/ExerciseScreenStyles';

const exercises = [
  {
    id: '1',
    name: 'Push-up',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/PushUp.gif'),
  },
  {
    id: '2',
    name: 'Pike Push-up',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/PikePushUp.gif'),
  },
  {
    id: '3',
    name: 'Decline Chest Press Machine',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/DeclineChestPressMachine.gif'),
  },
  {
    id: '4',
    name: 'Chest Dips',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/ChestDips.gif'),
  },
  // Add more exercises here
];

import {useNavigation} from '@react-navigation/native';

const ExerciseScreen2 = () => {
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

export default ExerciseScreen2;
