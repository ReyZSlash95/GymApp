import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Witaj w GymApp!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('TrainingPlans')}
      >
        <Text style={styles.buttonText}>Przejdź do Planów Treningowych</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D0D0D', // Ciemny tło
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E0E0E0', // Jasny tekst
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8E44AD', // Purpura
    padding: 15,
    borderRadius: 8,
    elevation: 5, // Dodaje cień dla Androida
    shadowColor: '#000', // Cień dla iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#FFFFFF', // Biały tekst
    fontSize: 18,
  },
});

export default HomeScreen;
