// App.tsx
import React from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Plans from './src/screens/Plans';
import NewPlan from './src/screens/NewPlan';
import BodyParts from './src/screens/BodyParts';
import History from './src/screens/History';
import Exercises from './src/screens/Exercises';
import More from './src/screens/More';

import ExerciseScreen1 from './src/screens/exerciseList/ExerciseScreen1'; // Add this line
import ExerciseScreen2 from './src/screens/exerciseList/ExerciseScreen2'; // Add this line
import ExerciseScreen3 from './src/screens/exerciseList/ExerciseScreen3'; // Add this line
import ExerciseScreen4 from './src/screens/exerciseList/ExerciseScreen4'; // Add this line
import ExerciseScreen6 from './src/screens/exerciseList/ExerciseScreen6'; // Add this line
import ExerciseScreen7 from './src/screens/exerciseList/ExerciseScreen7'; // Add this line


// Define your navigation parameters
type BottomTabParamList = {
  Plans: undefined;
  History: undefined;
  Exercises: undefined;
  More: undefined;

};

type PlansStackParamList = {
  PlansHome: undefined;
  NewPlan: undefined;
  BodyParts: undefined;
  ExerciseScreen1: undefined;
  ExerciseScreen2: undefined;
  ExerciseScreen3: undefined;
  ExerciseScreen4: undefined;
  ExerciseScreen6: undefined;
  ExerciseScreen7: undefined;

};

// Create the bottom tab navigator
const Tab = createBottomTabNavigator<BottomTabParamList>();

// Create the stack navigator
const PlansStack = createStackNavigator<PlansStackParamList>();

// App.tsx
// Rest of your code

const PlansNavigator = () => {
  return (
    <PlansStack.Navigator>
      <PlansStack.Screen name="PlansHome" component={Plans} />
      <PlansStack.Screen name="NewPlan" component={NewPlan} />
      <PlansStack.Screen name="BodyParts" component={BodyParts} />
      <PlansStack.Screen name="ExerciseScreen1" component={ExerciseScreen1} />
      <PlansStack.Screen name="ExerciseScreen2" component={ExerciseScreen2} />
      <PlansStack.Screen name="ExerciseScreen3" component={ExerciseScreen3} />
      <PlansStack.Screen name="ExerciseScreen4" component={ExerciseScreen4} />
      <PlansStack.Screen name="ExerciseScreen6" component={ExerciseScreen6} />
      <PlansStack.Screen name="ExerciseScreen7" component={ExerciseScreen7} />
    </PlansStack.Navigator>
  );
};

// Rest of your code


const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Plans"
        component={PlansNavigator}
        listeners={({ navigation }) => ({
          tabPress: e => {
            // Prevent default action
            e.preventDefault();

            // Reset the history stack and navigate to PlansHome
            navigation.reset({
              index: 0,
              routes: [{ name: 'Plans' }],
            });
          },
        })}
      />
        <Tab.Screen name="History" component={History} />
        <Tab.Screen name="Exercises" component={Exercises} />
        <Tab.Screen name="More" component={More} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;