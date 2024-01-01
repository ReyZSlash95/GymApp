import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const TrainingPlansScreen = ({ navigation }) => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('trainingPlans')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const plans = [];
        querySnapshot.forEach(documentSnapshot => {
          plans.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setPlans(plans);
      });

    return () => subscriber();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plany Treningowe</Text>
      <FlatList
        data={plans}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <View>
            <Text>{item.planName}</Text>
            {/* Tutaj możesz dodać więcej szczegółów planu */}
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CreatePlan')}
      >
        <Text style={styles.buttonText}>Dodaj nowy plan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D0D0D',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8E44AD',
    padding: 15,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default TrainingPlansScreen;
