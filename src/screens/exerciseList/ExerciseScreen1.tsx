import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';
import { addExercise } from '../../redux/actions/exerciseActions';

const exercises = [
  { id: '1', name: 'Push-up', series: [{ reps: '', weight: '' }], image: require('../../img/exercises/klatka/PushUp.gif') },
  { id: '2', name: 'Pike Push-up', series: [{ reps: '', weight: '' }], image: require('../../img/exercises/klatka/PikePushUp.gif') },
  { id: '3', name: 'Decline Chest Press Machine', series: [{ reps: '', weight: '' }], image: require('../../img/exercises/klatka/DeclineChestPressMachine.gif') },
  { id: '4', name: 'Chest Dips', series: [{ reps: '', weight: '' }], image: require('../../img/exercises/klatka/ChestDips.gif') },
  // Add more exercises here
];

import { useNavigation } from '@react-navigation/native';

const ExerciseScreen1 = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handlePress = (exercise) => {
    dispatch(addExercise(exercise));
    navigation.navigate('NewPlan');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.button} onPress={() => handlePress(item)}>
      <FastImage source={item.image} style={styles.image} />
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        data={exercises}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 5,
    marginBottom: 5,
  },
  image: {
    width: 50, // 1cm is approximately 40 pixels
    height: 50,
    marginRight: 10,
    marginLeft: 10,
  },
});

export default ExerciseScreen1;
