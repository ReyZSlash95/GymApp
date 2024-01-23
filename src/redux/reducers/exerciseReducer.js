// src/redux/reducers/exerciseReducer.js

const initialState = {
  trainingData: null,
  selectedExercises: [],
  savedPlans: [],
  planName: '',
};

const exerciseReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_EXERCISE':
      return {
        ...state,
        selectedExercises: [...state.selectedExercises, action.payload],
      };

    case 'REMOVE_EXERCISE':
      return {
        ...state,
        selectedExercises: state.selectedExercises.filter(
          exercise => exercise.id !== action.payload,
        ),
      };

    case 'REPLACE_EXERCISE':
      const {index, newExercise} = action.payload;
      return {
        ...state,
        selectedExercises: state.selectedExercises.map((exercise, idx) =>
          idx === index ? {...newExercise} : exercise,
        ),
      };

    // case 'SAVE_PLAN':
    //   return {
    //     ...state,
    //     savedPlans: [...state.savedPlans, action.payload],
    //     selectedExercises: [], // Opcjonalnie, czyścić wybrane ćwiczenia po zapisaniu planu
    //   };

    case 'RESET_PLAN':
      return {
        ...state,
        selectedExercises: [], // Czyści wybrane ćwiczenia
        planName: '', // Czyści nazwę planu
      };

    case 'UPDATE_EXERCISE_SERIES':
      // Logika aktualizacji serii ćwiczenia
      return {
        ...state,
        selectedExercises: state.selectedExercises.map(exercise => {
          if (exercise.id === action.payload.exerciseId) {
            const updatedSeries = [...exercise.series];
            updatedSeries[action.payload.seriesIndex] = {
              ...updatedSeries[action.payload.seriesIndex],
              [action.payload.field]: action.payload.value,
            };
            return {...exercise, series: updatedSeries};
          }
          return exercise;
        }),
      };

    case 'ADD_SERIES_TO_EXERCISE':
      // Logika dodawania nowej serii
      return {
        ...state,
        selectedExercises: state.selectedExercises.map(exercise => {
          if (exercise.id === action.payload.exerciseId) {
            return {
              ...exercise,
              series: [...exercise.series, {reps: '', weight: ''}],
            };
          }
          return exercise;
        }),
      };

    case 'REMOVE_LAST_SERIES_FROM_EXERCISE':
      // Logika usuwania ostatniej serii
      return {
        ...state,
        selectedExercises: state.selectedExercises.map(exercise =>
          exercise.id === action.payload
            ? {...exercise, series: exercise.series.slice(0, -1)}
            : exercise,
        ),
      };

    case 'SET_PLAN_NAME':
      return {
        ...state,
        planName: action.payload,
      };

      case 'SET_TRAINING_DATA':
        return {
          ...state,
          trainingData: action.payload,
        };
  
      case 'UPDATE_SERIES_DATA': {
        const { exerciseIndex, serieIndex, field, value } = action.payload;
        const updatedExercises = state.trainingData.exercises.map((exercise, index) => {
          if (index === exerciseIndex) {
            const updatedSeries = exercise.series.map((serie, index) => {
              if (index === serieIndex) {
                return { ...serie, [field]: value };
              }
              return serie;
            });
            return { ...exercise, series: updatedSeries };
          }
          return exercise;
        });
  
        return {
          ...state,
          trainingData: { ...state.trainingData, exercises: updatedExercises },
        };
      }
  
      case 'RESET_TRAINING_DATA':
        return {
          ...state,
          trainingData: null,
        };
  

      default:
      return state;
  }
};

export default exerciseReducer;
