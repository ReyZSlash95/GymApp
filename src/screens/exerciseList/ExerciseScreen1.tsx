import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {
  addExercise,
  replaceExercise,
} from '../../redux/actions/exerciseActions';
import {useNavigation, useRoute} from '@react-navigation/native';

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

const ExerciseScreen1 = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const changingExercise = route.params?.changingExercise || false;

  const handlePress = exercise => {
    if (changingExercise) {
      console.log('Replacing exercise:', changingExercise, 'with', exercise);
      dispatch(replaceExercise(changingExercise, exercise));
      navigation.navigate('NewPlan');
    } else {
      // Logika dodawania ćwiczenia do planu
      dispatch(addExercise(exercise));
      navigation.navigate('NewPlan');
    }
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

export default ExerciseScreen1;
