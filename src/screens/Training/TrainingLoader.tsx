// TrainingHistoryLoader.js
import firestore from '@react-native-firebase/firestore';
import {useDispatch} from 'react-redux';
import {setTrainingDataFromHistory} from '../../redux/actions/exerciseActions';

export const useTrainingHistoryLoader = () => {
  const dispatch = useDispatch();

  const loadTrainingFromHistory = async trainingHistoryId => {
    try {
      const trainingHistoryDoc = await firestore()
        .collection('trainingHistory')
        .doc(trainingHistoryId)
        .get();
      if (trainingHistoryDoc.exists) {
        const trainingHistoryData = trainingHistoryDoc.data();

        // Konwersja completedDate na timestamp
        const completedDateTimestamp = trainingHistoryData.completedDate
          .toDate()
          .getTime();

        // Użycie zmodyfikowanego obiektu z konwertowaną datą
        const modifiedTrainingHistoryData = {
          ...trainingHistoryData,
          completedDate: completedDateTimestamp,
        };

        dispatch(setTrainingDataFromHistory(modifiedTrainingHistoryData));
      } else {
        Alert.alert('Błąd', 'Nie znaleziono historii treningu.');
      }
    } catch (error) {
      console.error('Błąd podczas ładowania historii treningu:', error);
    }
  };

  return {loadTrainingFromHistory};
};
