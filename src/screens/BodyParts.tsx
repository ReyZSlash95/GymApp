import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ImageBackground} from 'react-native';

const bodyParts = [
  {
    id: '1',
    name: 'Klatka',
    image: require('../img/exercises/partieMiesniowe/Klatka.png'),
    screen: 'Klatka',
  },
  {
    id: '2',
    name: 'Biceps',
    image: require('../img/exercises/partieMiesniowe/Biceps.png'),
    screen: 'Biceps',
  },
  {
    id: '3',
    name: 'Triceps',
    image: require('../img/exercises/partieMiesniowe/Triceps.png'),
    screen: 'Triceps',
  },
  {
    id: '4',
    name: 'Shoulders',
    image: require('../img/exercises/partieMiesniowe/Barki.png'),

    screen: 'Shoulders',
  },
  {
    id: '5',
    name: 'Back',
    image: require('../img/exercises/partieMiesniowe/Plecy.png'),
    screen: 'Back',
  },
  {
    id: '6',
    name: 'Plecy',
    image: require('../img/exercises/partieMiesniowe/Plecy.png'),
    screen: 'ExerciseScreen6',
  },
  {
    id: '7',
    name: 'Nogi',
    image: require('../img/exercises/partieMiesniowe/Nogi.png'),
    screen: 'ExerciseScreen7',
  },
];

const BodyParts = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {changingExercise} = route.params || {};
  console.log('changingExercise index 1:', changingExercise);

  const renderItem = ({item}) => {
    console.log(
      'Navigating to:',
      item.screen,
      'with changingExercise:',
      changingExercise,
    );
    return (
      <TouchableOpacity
        style={styles.exerciseItem}
        onPress={() => navigation.navigate(item.screen, {changingExercise})}>
        <ImageBackground source={item.image} style={styles.exerciseImage}>
          <Text style={styles.exerciseText}>{item.name}</Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.backgroundContainer}>
      <FlatList
        data={bodyParts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3} // Display 3 columns
      />
    </View>
  );
};

export default BodyParts;

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#121214',
  },
  exerciseItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 10,
    borderRadius: 3,
    overflow: 'hidden',
  },
  exerciseImage: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },

  exerciseText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 3,
  },
});
