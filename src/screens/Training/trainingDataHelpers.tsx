// trainingDataHelpers.ts
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dispatch} from 'redux';
import {
  setTrainingData,
  resetTrainingData,
  resetPlanId,
} from '../../redux/actions/exerciseActions';

// Możesz zdefiniować typy dla danych treningowych, jeśli są skomplikowane
type TrainingData = {
  // Struktura twoich danych treningowych
};

// Możesz także zdefiniować typy dla funkcji, jeśli są potrzebne
export const fetchTrainingDataFromFirebase = async (
  id: string,
  type: string,
  dispatch: Dispatch,
  resetTimer: () => void,
  setIsTrainingActive: (isActive: boolean) => void,
): Promise<void> => {
  try {
    console.log('fetchTrainingDataFromFirebase');

    const savedTrainingData = await AsyncStorage.getItem('trainingData');
    if (savedTrainingData) {
      const parsedData = JSON.parse(savedTrainingData);
      if (parsedData.id === id) {
        console.log('Dane treningowe są już zapisane w AsyncStorage.');
        dispatch(setTrainingData(parsedData));
        return; // Zakończ funkcję, jeśli dane są już załadowane
      }
    }

    console.log('Ładowanie danych z Firebase...');

    let planData;

    if (type === 'History') {
      const doc = await firestore().collection('trainingHistory').doc(id).get();

      if (doc.exists) {
        planData = {
          ...doc.data(),
          completedDate: doc.data().completedDate.toMillis(),
          id: doc.id,
        };
      }
    } else if (type === 'Plans') {
      const doc = await firestore().collection('trainingPlans').doc(id).get();

      if (doc.exists) {
        planData = {
          ...doc.data(),
          createdAt: doc.data().createdAt.toMillis(),
          id: doc.id,
        };
      }
    }
    if (planData) {
      console.log('planData', planData);

      resetTimer();
      setIsTrainingActive(false);
      dispatch(setTrainingData(planData));
      await AsyncStorage.setItem('trainingData', JSON.stringify(planData));
    } else {
      console.log('No data found for this ID');
    }
  } catch (error) {
    console.error('Error fetching training data from Firebase:', error);
  }
};

// jeszcze do ogarniecia

export const loadTrainingDataFromAsyncStorage = async (
  dispatch: Dispatch,
): Promise<void> => {
  try {
    const savedTrainingData = await AsyncStorage.getItem('trainingData');
    if (savedTrainingData) {
      dispatch(setTrainingData(JSON.parse(savedTrainingData)));
    }
  } catch (error) {
    console.error('Error loading training data from AsyncStorage:', error);
  }
};
