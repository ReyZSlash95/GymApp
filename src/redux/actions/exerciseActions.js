// src/redux/actions/exerciseActions.js

export const addExercise = exercise => ({
  type: 'ADD_EXERCISE',
  payload: exercise,
});

export const removeExercise = exerciseId => ({
  type: 'REMOVE_EXERCISE',
  payload: exerciseId,
});

export const replaceExercise = (oldExerciseId, newExercise) => ({
  type: 'REPLACE_EXERCISE',
  payload: {oldExerciseId, newExercise},
});

export const savePlan = exercises => ({
  type: 'SAVE_PLAN',
  payload: exercises,
});

export const updateExerciseSeries = (
  exerciseId,
  seriesIndex,
  field,
  value,
) => ({
  type: 'UPDATE_EXERCISE_SERIES',
  payload: {exerciseId, seriesIndex, field, value},
});

// Akcja do dodawania nowej serii
export const addSeriesToExercise = exerciseId => ({
  type: 'ADD_SERIES_TO_EXERCISE',
  payload: {exerciseId},
});

// Akcja usuwania ostatniej serii

export const removeLastSeriesFromExercise = exerciseId => {
  return {
    type: 'REMOVE_LAST_SERIES_FROM_EXERCISE',
    payload: exerciseId,
  };
};

export const setPlanName = name => {
  return {
    type: 'SET_PLAN_NAME',
    payload: name,
  };
};

export const resetPlan = () => ({
  type: 'RESET_PLAN',
});
