// src/redux/reducers/index.js



import { combineReducers } from 'redux';
import exerciseReducer from './exerciseReducer';

const rootReducer = combineReducers({
  exercise: exerciseReducer,
  // Dodaj tutaj inne reducery, jeśli są potrzebne.
});

export default rootReducer;
