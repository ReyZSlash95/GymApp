// NewPlan.tsx
import React, { useEffect } from 'react';
import { Button, View, StyleSheet, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const NewPlan: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const exercise = route.params?.exercise;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Szablon treningu',
      headerRight: () => (
        <View style={styles.saveButtonContainer}>
          <Button
            onPress={() => {
              // Call your save function here
            }}
            title="Zapisz"
          />
        </View>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {exercise && <Text>{exercise.name}</Text>} 
      <View style={styles.addButtonContainer}>
        <Button title="Dodaj ćwiczenie" onPress={() => navigation.navigate('BodyParts')} />
      </View>
    </View>
  );
};


// STYLES //

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  addButtonContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  saveButtonContainer: {
    marginRight: 10, // Add this line
  },
});

export default NewPlan;