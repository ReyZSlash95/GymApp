import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CreatePlanForm from './CreatePlanScreen'; // Upewnij się, że ścieżka jest poprawna

const TrainingPlansScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plany Treningowe</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CreatePlan')}
      >
        <Text style={styles.buttonText}>Dodaj nowy plan</Text>
      </TouchableOpacity>
      {/* Wyświetlanie istniejących planów */}
    </View>
  );
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
