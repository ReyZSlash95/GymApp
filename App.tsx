// App.tsx
import React, {useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {Provider} from 'react-redux';
import store from './src/redux/store/configureStore';

import NewPlan from './src/screens/NewPlan';
import BodyParts from './src/screens/BodyParts';

import ExerciseScreen1 from './src/screens/exerciseList/ExerciseScreen1';
import ExerciseScreen2 from './src/screens/exerciseList/ExerciseScreen2';
import ExerciseScreen3 from './src/screens/exerciseList/ExerciseScreen3';
import ExerciseScreen4 from './src/screens/exerciseList/ExerciseScreen4';
import ExerciseScreen6 from './src/screens/exerciseList/ExerciseScreen6';
import ExerciseScreen7 from './src/screens/exerciseList/ExerciseScreen7';

import HomeTabs from './src/MenuTab/BottomTabNavigator';

type PlansStackParamList = {
  HomeTabs: undefined;
  NewPlan: undefined;
  BodyParts: undefined;
  ExerciseScreen1: undefined;
  ExerciseScreen2: undefined;
  ExerciseScreen3: undefined;
  ExerciseScreen4: undefined;
  ExerciseScreen6: undefined;
  ExerciseScreen7: undefined;
};

const PlansStack = createStackNavigator<PlansStackParamList>();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <PlansStack.Navigator>
          <PlansStack.Screen
            name="HomeTabs"
            component={HomeTabs}
            options={{headerShown: false}}
          />
          <PlansStack.Screen name="NewPlan" component={NewPlan} />
          <PlansStack.Screen name="BodyParts" component={BodyParts} />
          <PlansStack.Screen
            name="ExerciseScreen1"
            component={ExerciseScreen1}
          />
          <PlansStack.Screen
            name="ExerciseScreen2"
            component={ExerciseScreen2}
          />
          <PlansStack.Screen
            name="ExerciseScreen3"
            component={ExerciseScreen3}
          />
          <PlansStack.Screen
            name="ExerciseScreen4"
            component={ExerciseScreen4}
          />
          <PlansStack.Screen
            name="ExerciseScreen6"
            component={ExerciseScreen6}
          />
          <PlansStack.Screen
            name="ExerciseScreen7"
            component={ExerciseScreen7}
          />
        </PlansStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
