import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const bodyParts = [
    { id: '1', name: 'Barki', image: require('../img/exercises/partieMiesniowe/Barki.png'), screen: 'ExerciseScreen1' },
    { id: '2', name: 'Biceps', image: require('../img/exercises/partieMiesniowe/Biceps.png'), screen: 'ExerciseScreen2' },
    { id: '3', name: 'Triceps', image: require('../img/exercises/partieMiesniowe/Triceps.png'), screen: 'ExerciseScreen3' },
    { id: '4', name: 'Klatka piersiowa', image: require('../img/exercises/partieMiesniowe/Klatka.png'), screen: 'ExerciseScreen4' },
    { id: '6', name: 'Plecy', image: require('../img/exercises/partieMiesniowe/Plecy.png'), screen: 'ExerciseScreen6' },
    { id: '7', name: 'Nogi', image: require('../img/exercises/partieMiesniowe/Nogi.png'), screen: 'ExerciseScreen7' },
    
  ];

const BodyParts = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity style={{ flex: 1, aspectRatio: 1 }} onPress={() => navigation.navigate(item.screen)}>
      <Image source={item.image} style={{ width: '100%', height: '100%' }} />
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );


  
  return (
    <View style={{ flex: 1 }}>
      <Text>Wybierz Partie</Text>
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