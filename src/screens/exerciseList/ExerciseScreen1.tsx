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
    type: 'chest',
    name: 'Barebell Bench Press',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/BarbellBenchPress.gif'),
  },
  {
    id: '2',
    type: 'chest',
    name: 'Cable Crossover',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/CableCrossover.gif'),
  },
  {
    id: '3',
    type: 'chest',
    name: 'Chest Dips',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/ChestDips.gif'),
  },
  {
    id: '4',
    type: 'chest',
    name: 'Decline Chest Press Machine',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/DeclineChestPressMachine.gif'),
  },
  {
    id: '5',
    type: 'chest',
    name: 'Decline Dummbell Fly',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/DeclineDumbbellFly.gif'),
  },
  {
    id: '6',
    type: 'chest',
    name: 'Decline Dummbell Press',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/DeclineDumbbellPress.gif'),
  },
  {
    id: '7',
    type: 'chest',
    name: 'Dumbbell Fly',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/DumbbellFly.gif'),
  },
  {
    id: '8',
    type: 'chest',
    name: 'Dumbbell Press',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/DumbbellPress.gif'),
  },
  {
    id: '9',
    type: 'chest',
    name: 'Dumbbell Pullover',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/DumbbellPullover.gif'),
  },
  {
    id: '10',
    type: 'chest',
    name: 'High Cable Crossover',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/HighCableCrossover.gif'),
  },
  {
    id: '11',
    type: 'chest',
    name: 'Incline Chest Press Machine',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/InclineChestPressMachine.gif'),
  },
  {
    id: '12',
    type: 'chest',
    name: 'Incline Dumbbell Fly',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/InclineDumbbellFly.gif'),
  },
  {
    id: '13',
    type: 'chest',
    name: 'Incline Dumbbell Press',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/InclineDumbbellPress.gif'),
  },
  {
    id: '14',
    type: 'chest',
    name: 'Low Cable Crossover',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/LowCableCrossover.gif'),
  },
  {
    id: '15',
    type: 'chest',
    name: 'Lying Cable Fly',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/LyingCableFly.gif'),
  },
  {
    id: '16',
    type: 'chest',
    name: 'Pec Deck Fly',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/PecDeckFly.gif'),
  },
  {
    id: '17',
    type: 'chest',
    name: 'Pike Push Up',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/PikePushUp.gif'),
  },
  {
    id: '18',
    type: 'chest',
    name: 'Push Up',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/PushUp.gif'),
  },
  {
    id: '19',
    type: 'chest',
    name: 'Smith Machine Bench Press',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/SmithMachineBenchPress.gif'),
  },
  {
    id: '20',
    type: 'chest',
    name: 'Smith Machine Decline Press',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/SmithMachineDeclineBenchPress.gif'),
  },
  {
    id: '21',
    type: 'chest',
    name: 'Smith Machine Incline Press',
    series: [{reps: '', weight: ''}],
    image: require('../../img/exercises/klatka/SmithMachineInclineBenchPress.gif'),
  },

  // Add more exercises here
];

const Klatka = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const route = useRoute();
  const changingExercise = route.params?.changingExercise ?? null;
  console.log('changingExercise index 2:', changingExercise);

  const handlePress = exercise => {
    if (changingExercise !== null) {
      console.log('Replacing exercise:', changingExercise, 'with', exercise);
      dispatch(replaceExercise(changingExercise, exercise));
      navigation.navigate('NewPlan');
    } else {
      console.log('Adding exercise:', exercise);
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

export default Klatka;
