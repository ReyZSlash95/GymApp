import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import TrainingPlansScreen from './src/screens/TrainingPlansScreen';
import MuscleGroupSelectionScreen from './src/screens/MuscleGroupSelectionScreen';
import ExercisesScreen from './src/screens/ExercisesScreen';
import CreatePlanScreen from './src/screens/CreatePlanScreen';


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TrainingPlans" component={TrainingPlansScreen} />
        
        <Stack.Screen name="MuscleGroupSelection" component={MuscleGroupSelectionScreen} />
        <Stack.Screen name="Exercises" component={ExercisesScreen} />
        <Stack.Screen name="CreatePlan" component={CreatePlanScreen} />

      </Stack.Navigator>
      
    </NavigationContainer>
  );
}

export default App;