// App.tsx
import React, {useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {Provider} from 'react-redux';
import store from './src/redux/store/configureStore';

import NewPlan from './src/screens/NewPlan';
import BodyParts from './src/screens/BodyParts';

import Klatka from './src/screens/exerciseList/ExerciseScreen1';
import TrainingDetail from './src/screens/TrainingDetail';
import Biceps from './src/screens/exerciseList/ExerciseScreen2';
import Triceps from './src/screens/exerciseList/ExerciseScreen3';
import Shoulders from './src/screens/exerciseList/ExerciseScreen4';
import Back from './src/screens/exerciseList/ExerciseScreen5';

import ExerciseScreen6 from './src/screens/exerciseList/ExerciseScreen6';
import ExerciseScreen7 from './src/screens/exerciseList/ExerciseScreen7';

import TrainingSummary from './src/screens/TrainingSummary';

import HomeTabs from './src/MenuTab/BottomTabNavigator';
import {Provider as PaperProvider} from 'react-native-paper';

import Training from './src/screens/Training';

import {StyleSheet} from 'react-native';

type PlansStackParamList = {
  HomeTabs: undefined;
  NewPlan: undefined;
  BodyParts: undefined;
  Klatka: undefined;
  TrainingDetail: undefined;
  TrainingSummary: undefined;
  Biceps: undefined;
  Triceps: undefined;
  Shoulders: undefined;
  Back: undefined;

  Training: undefined;

  ExerciseScreen6: undefined;
  ExerciseScreen7: undefined;
};

const PlansStack = createStackNavigator<PlansStackParamList>();

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <PlansStack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: '#202024',
              },
              headerTintColor: '#00B37E',
              headerTitleStyle: {
                color: '#00B37E',
                fontWeight: 'bold',
              },

              headerMode: 'screen',
              presentation: 'transparentModal',
              cardStyle: {backgroundColor: 'black'}, // Apply globally
            }}>
            <PlansStack.Screen
              name="HomeTabs"
              component={HomeTabs}
              options={{headerShown: false}}
            />
            <PlansStack.Screen name="NewPlan" component={NewPlan} />

            <PlansStack.Screen name="BodyParts" component={BodyParts} />

            <PlansStack.Screen name="Klatka" component={Klatka} />
            <PlansStack.Screen
              name="TrainingDetail"
              component={TrainingDetail}
            />
            <PlansStack.Screen
              name="TrainingSummary"
              component={TrainingSummary}
            />
            <PlansStack.Screen name="Biceps" component={Biceps} />
            <PlansStack.Screen name="Triceps" component={Triceps} />
            <PlansStack.Screen name="Shoulders" component={Shoulders} />
            <PlansStack.Screen name="Back" component={Back} />
            <PlansStack.Screen
              name="ExerciseScreen6"
              component={ExerciseScreen6}
            />
            <PlansStack.Screen
              name="ExerciseScreen7"
              component={ExerciseScreen7}
            />
            <PlansStack.Screen name="Training" component={Training} />
          </PlansStack.Navigator>
          {/* <Navbar /> */}
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;
