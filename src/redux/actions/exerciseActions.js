// src/redux/actions/exerciseActions.js

export const addExercise = exercise => ({
  type: 'ADD_EXERCISE',
  payload: {...exercise},
});

// TEST udpate exercise
export const updateExerciseOrder = newOrder => ({
  type: 'UPDATE_EXERCISE_ORDER',
  payload: newOrder,
});

export const removeExercise = exerciseId => ({
  type: 'REMOVE_EXERCISE',
  payload: exerciseId,
});

export const replaceExercise = (index, newExercise) => ({
  type: 'REPLACE_EXERCISE',
  payload: {index, newExercise},
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

// Trening

export const setTrainingData = trainingData => ({
  type: 'SET_TRAINING_DATA',
  payload: trainingData,
});

export const updateSeriesData = (exerciseIndex, serieIndex, field, value) => ({
  type: 'UPDATE_SERIES_DATA',
  payload: {exerciseIndex, serieIndex, field, value},
});

export const resetTrainingData = () => ({
  type: 'RESET_TRAINING_DATA',
});

export const setPlanId = planId => ({
  type: 'SET_PLAN_ID',
  payload: planId,
});

export const resetPlanId = () => ({
  type: 'RESET_PLAN_ID',
});

export const resetPlan = () => ({
  type: 'RESET_PLAN',
});
