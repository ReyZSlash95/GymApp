import React, {useState, useEffect} from 'react';
import {
  Animated,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';

import {useDispatch} from 'react-redux';
import {setPlanId} from '../redux/actions/exerciseActions';

import DraggableFlatList from 'react-native-draggable-flatlist';

import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

import FastImage from 'react-native-fast-image';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [expandedPlanId, setExpandedPlanId] = useState(null); // Stan dla śledzenia rozwiniętego planu
  const navigation = useNavigation();

  const dispatch = useDispatch();

  useEffect(() => {
    const subscriber = firestore()
      .collection('trainingPlans')
      .orderBy('order')
      .onSnapshot(
        querySnapshot => {
          const plansArray = [];
          querySnapshot.forEach(documentSnapshot => {
            plansArray.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
          setPlans(plansArray);
        },
        error => {
          console.error(error);
        },
      );

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('NewPlan')}
          style={styles.headerButton}>
          <Text style={styles.headerButtonText}>CREATE PLAN</Text>
        </TouchableOpacity>
      ),
    });

    return () => subscriber();
  }, [navigation]);

  const handleExpand = planId => {
    setExpandedPlanId(expandedPlanId === planId ? null : planId); // Rozwijanie/zwijanie planu
  };

  const handleStartTraining = planId => {
    dispatch(setPlanId(planId));

    navigation.navigate('Training');
    console.log(planId);
  };

  const handleDeletePlan = planId => {
    Alert.alert('Potwierdzenie', 'Czy na pewno chcesz usunąć ten plan?', [
      {
        text: 'Anuluj',
        onPress: () => console.log('Usuwanie anulowane'),
        style: 'cancel',
      },
      {text: 'Usuń', onPress: () => handleDeletePlanConfirmed(planId)}, // Zmienione z deletePlan na handleDeletePlanConfirmed
    ]);
  };

  const handleDeletePlanConfirmed = async planId => {
    try {
      await firestore().collection('trainingPlans').doc(planId).delete();
      Alert.alert('Sukces', 'Plan został usunięty.');
    } catch (error) {
      console.error('Error deleting plan:', error);
      Alert.alert('Błąd', 'Wystąpił błąd podczas usuwania planu.');
    }
  };

  const renderSeriesDetails = series => {
    return series.map((serie, index) => (
      <Text key={index}>
        Seria {index + 1}: {serie.reps} powtórzeń, {serie.weight} kg
      </Text>
    ));
  };

  const renderExerciseList = exercises => {
    return exercises.map((exercise, index) => (
      <View key={index} style={styles.exerciseItem}>
        <FastImage source={exercise.image} style={styles.image} />

        <Text style={styles.exerciseName}>{exercise.name}</Text>
        {/* {renderSeriesDetails(exercise.series)} */}
      </View>
    ));
  };

  const onDragEnd = async ({data}) => {
    setPlans(data); // Aktualizacja stanu lokalnego

    // Przejście przez każdy plan i aktualizacja jego kolejności w bazie danych
    const batch = firestore().batch();
    data.forEach((plan, index) => {
      const planRef = firestore().collection('trainingPlans').doc(plan.key);
      batch.update(planRef, {order: index});
    });

    await batch.commit();
  };

  const renderItem = ({item, drag, isActive}) => {
    return (
      <View style={styles.detailContainer}>
        <TouchableOpacity
          onLongPress={drag}
          delayLongPress={500}
          onPress={() => handleExpand(item.key)}>
          <View
            style={[styles.planItem, isActive ? styles.activeItemStyle : null]}>
            <Text style={styles.planName}>{item.planName}</Text>
          </View>
          {expandedPlanId === item.key && (
            // Renderowanie szczegółów planu, jeśli jest rozwinięty
            <>
              {renderExerciseList(item.exercises)}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => handleDeletePlan(item.key)}
                  style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Usuń Plan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleStartTraining(item.key)}
                  style={styles.startTrainingButton}>
                  <Text style={styles.startTrainingButtonText}>
                    Rozpocznij trening
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <DraggableFlatList
        data={plans}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        onDragEnd={onDragEnd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // HEADER BUTTON
  headerButton: {
    backgroundColor: '#e4b04e',
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  headerButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  //
  detailContainer: {
    backgroundColor: '#e4b04e',
    borderRadius: 3,
    margin: 5,
    // padding: 1,
  },

  container: {
    backgroundColor: '#121214',
    flex: 1,
    padding: 10,
  },
  planItem: {
    padding: 10,
    backgroundColor: '#29292E',
    borderRadius: 3,
    // margin: 5,
  },
  activeItemStyle: {
    // Styl dla aktywnego przeciąganego elementu, na przykład:
    borderColor: '#e4b04e',
    borderWidth: 2,
  },
  planItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  exerciseName: {
    color: '#121214',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  exerciseItem: {
    backgroundColor: 'white',
    flexDirection: 'column',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    // paddingLeft: 20,
    borderRadius: 3,
    margin: 3,
  },

  buttonContainer: {
    flexDirection: 'row', // Ustawia przyciski w jednym rzędzie
    justifyContent: 'space-between', // Rozdziela przyciski na obie strony
    margin: 10, // Zewnętrzny margines kontenera przycisków
  },

  startTrainingButton: {
    backgroundColor: '#202024', // Kolor tła przycisku
    padding: 10, // Wewnętrzne marginesy przycisku
    borderRadius: 5, // Zaokrąglenie krawędzi przycisku
    alignItems: 'center', // Wyśrodkowanie tekstu w przycisku
  },

  startTrainingButtonText: {
    color: '#00B37E', // Kolor tekstu
    fontWeight: 'bold', // Pogrubienie tekstu
  },

  deleteButton: {
    backgroundColor: '#202024', // Kolor tła przycisku
    padding: 10, // Wewnętrzne marginesy przycisku
    borderRadius: 5, // Zaokrąglenie krawędzi przycisku
    alignItems: 'center', // Wyśrodkowanie tekstu w przycisku
  },

  deleteButtonText: {
    color: '#00B37E', // Kolor tekstu
    fontWeight: 'bold', // Pogrubienie tekstu
  },

  image: {
    width: 34,
    height: 34,
    marginRight: 6,
    marginLeft: 6,
    marginTop: 1,
    marginBottom: 1,
    borderRadius: 3,
    // borderColor: '#e4b04e',
    // borderWidth: 2,
  },
});

export default Plans;
