import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CreatePlanForm from './CreatePlanScreen'; // Upewnij się, że ścieżka jest poprawna

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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D0D0D', // Ciemne tło
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E0E0E0', // Jasny tekst
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8E44AD', // Purpura
    padding: 15,
    borderRadius: 8,
    elevation: 5, // Cień dla Androida
    shadowColor: '#000', // Cień dla iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF', // Biały tekst
    fontSize: 18,
  },
});

export default TrainingPlansScreen;
