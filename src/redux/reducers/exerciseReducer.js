// src/redux/reducers/exerciseReducer.js

const initialState = {
  selectedExercises: [],
  savedPlans: [], // Przechowuje zapisane plany treningowe
  planName: '', // Przechowuje nazwę aktualnego planu treningowego
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
    case 'SAVE_PLAN':
      return {
        ...state,
        savedPlans: [...state.savedPlans, action.payload],
        selectedExercises: [], // Opcjonalnie, czyścić wybrane ćwiczenia po zapisaniu planu
      };

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

    default:
      return state;
  }
};

export default exerciseReducer;
