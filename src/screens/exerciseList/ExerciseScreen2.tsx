import React from 'react';
import { View, Text, FlatList } from 'react-native';

const exercises = [
  { id: '1', name: 'Ćwiczenie 1' },
  { id: '2', name: 'Ćwiczenie 2' },
  // Add more exercises here
];

const ExerciseScreen2 = () => {
  return (
    <View>
      <FlatList
        data={exercises}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    </View>
  );
};

export default ExerciseScreen2;