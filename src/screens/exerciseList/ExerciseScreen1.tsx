import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';

import FastImage from 'react-native-fast-image'


const exercises = [
  { id: '1', name: 'Push-up', image: require('../../img/exercises/klatka/PushUp.gif') },
  { id: '2', name: 'Pike Push-up', image: require('../../img/exercises/klatka/PikePushUp.gif') },
  { id: '3', name: 'Decline Chest Press Machine', image: require('../../img/exercises/klatka/DeclineChestPressMachine.gif') },
  { id: '4', name: 'Chest Dips', image: require('../../img/exercises/klatka/ChestDips.gif') },


  // Add more exercises here
];



import { useNavigation } from '@react-navigation/native'; // Dodaj ten import

const ExerciseScreen1 = () => {
  const navigation = useNavigation(); // Użyj hooka useNavigation

  const handlePress = (exercise) => {
    console.log(`Dodano ćwiczenie: ${exercise.name}`);
    navigation.navigate('NewPlan', { exercise }); // Dodaj nawigację do NewPlan
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <Text>{item.name}</Text>
      <FastImage source={item.image} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        data={exercises}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.button} onPress={() => handlePress(item)}>
            <FastImage source={item.image} style={styles.image} />
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
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