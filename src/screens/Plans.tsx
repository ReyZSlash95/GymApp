import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';


const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [expandedPlanId, setExpandedPlanId] = useState(null); // Stan dla śledzenia rozwiniętego planu
  const navigation = useNavigation();

  useEffect(() => {
    const subscriber = firestore()
      .collection('trainingPlans')
      .onSnapshot(querySnapshot => {
        const plansArray = [];

        querySnapshot.forEach(documentSnapshot => {
          plansArray.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setPlans(plansArray);
      }, error => {
        // Obsługa błędów
        console.error(error);
      });

    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => navigation.navigate('NewPlan')}
          title="Stwórz plan"
          color="#000"
        />
      ),
    });

    return () => subscriber();
  }, [navigation]);

  const handleExpand = (planId) => {
    setExpandedPlanId(expandedPlanId === planId ? null : planId); // Rozwijanie/zwijanie planu
  };

  const handleStartTraining = (planId) => {
    // Logika nawigacji do ekranu treningu
    navigation.navigate('TrainingScreen', { planId });
  };

  const renderSeriesDetails = (series) => {
    return series.map((serie, index) => (
      <Text key={index}>Seria {index + 1}: {serie.reps} powtórzeń, {serie.weight} kg</Text>
    ));
  };
  
  const renderExerciseList = (exercises) => {
    return exercises.map((exercise, index) => (
      <View key={index} style={styles.exerciseItem}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        {renderSeriesDetails(exercise.series)}
      </View>
    ));
  };
  

  const handleDeletePlan = (planId) => {
    Alert.alert(
      "Potwierdzenie",
      "Czy na pewno chcesz usunąć ten plan?",
      [
        {
          text: "Anuluj",
          onPress: () => console.log("Usuwanie anulowane"),
          style: "cancel"
        },
        { text: "Usuń", onPress: () => handleDeletePlanConfirmed(planId) } // Zmienione z deletePlan na handleDeletePlanConfirmed
      ]
    );
  };
  
  const handleDeletePlanConfirmed = async (planId) => {
    try {
      await firestore().collection('trainingPlans').doc(planId).delete();
      Alert.alert("Sukces", "Plan został usunięty.");
    } catch (error) {
      console.error("Error deleting plan:", error);
      Alert.alert("Błąd", "Wystąpił błąd podczas usuwania planu.");
    }
  };  
  
  const renderPlanDetails = (plan) => {
    if (expandedPlanId === plan.key) {
      return (
        <View>
          {renderExerciseList(plan.exercises)}
          <TouchableOpacity onPress={() => handleStartTraining(plan.key)}>
            <Text style={styles.startTrainingButton}>Rozpocznij trening</Text>
          </TouchableOpacity>
          <Button
            title="Usuń plan"
            onPress={() => handleDeletePlan(plan.key)}
            color="red"
          />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={plans}
        renderItem={({ item }) => (
          <View style={styles.planItem}>
            <TouchableOpacity onPress={() => handleExpand(item.key)}>
              <View style={styles.planItemRow}>
                <Text style={styles.planName}>{item.planName}</Text>
                {/* Tutaj możesz dodać kolejne elementy tekstowe lub przyciski obok nazwy planu */}
              </View>
            </TouchableOpacity>
            {renderPlanDetails(item)}
          </View>
        )}
        keyExtractor={item => item.key}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  planItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  planItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between' // Dostosuj według potrzeb
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10 // Dostosuj według potrzeb
  },
  exerciseItem: {
    paddingLeft: 20,
    paddingTop: 5,
  },
  startTrainingButton: {
    marginTop: 10,
    color: 'blue',
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 10,
    color: 'red',
  },
  // D
  // Dodaj więcej stylów według potrzeb
});

export default Plans;
