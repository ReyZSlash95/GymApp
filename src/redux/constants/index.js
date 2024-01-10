// reducers/index.js
import {ADD_EXERCISE, REMOVE_EXERCISE} from '../actions/exerciseActions';

const initialState = {
  selectedExercises: [],
};

const exerciseReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_EXERCISE:
      return {
        ...state,
        selectedExercises: [...state.selectedExercises, action.payload],
      };
    case REMOVE_EXERCISE:
      return {
        ...state,
        selectedExercises: state.selectedExercises.filter(
          exercise => exercise.id !== action.payload,
        ),
      };
    default:
      return state;
  }
};

export default exerciseReducer;
