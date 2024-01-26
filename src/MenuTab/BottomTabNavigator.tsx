import React from 'react';
import {Dimensions} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Plans from '../screens/Plans';
import History from '../screens/History';
import Training from '../screens/Training';
import More from '../screens/More';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faList,
  faCalendar,
  faDumbbell,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import {StyleSheet, View} from 'react-native';
import {Header} from 'react-native-elements';

const Tab = createMaterialTopTabNavigator();

import {createStackNavigator} from '@react-navigation/stack';

import {SafeAreaView} from 'react-native-safe-area-context';

const PlansStack = createStackNavigator();
const HistoryStack = createStackNavigator();
const TrainingStack = createStackNavigator();
const MoreStack = createStackNavigator();

const PlansStackNavigator = () => (
  <PlansStack.Navigator>
    <PlansStack.Screen
      name="Plans"
      component={Plans}
      options={{headerTitle: 'Plans'}}
    />
    {/* Możesz dodać więcej ekranów, jeśli są */}
  </PlansStack.Navigator>
);

const HistoryStackNavigator = () => (
  <HistoryStack.Navigator>
    <HistoryStack.Screen
      name="History"
      component={History}
      options={{headerTitle: 'History'}}
    />
    {/* Dodatkowe ekrany dla History, jeśli są */}
  </HistoryStack.Navigator>
);

const TrainingStackNavigator = () => (
  <TrainingStack.Navigator>
    <TrainingStack.Screen
      name="Training"
      component={Training}
      options={{headerTitle: 'Training'}}
    />
    {/* Dodatkowe ekrany dla Training, jeśli są */}
  </TrainingStack.Navigator>
);

const MoreStackNavigator = () => (
  <MoreStack.Navigator>
    <MoreStack.Screen
      name="More"
      component={More}
      options={{headerTitle: 'More'}}
    />
    {/* Dodatkowe ekrany dla More, jeśli są */}
  </MoreStack.Navigator>
);

const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialLayout={{width: Dimensions.get('window').width}}
      tabBarPosition="bottom"
      screenOptions={({route}) => ({
        tabBarActiveTintColor: '#e4b04e',
        tabBarInactiveTintColor: '#00B37E',
        tabBarAndroidRipple: {borderless: true, color: '#29292E', radius: 50},

        tabBarStyle: styles.tabBar,
        swipeEnabled: false,
        tabBarIcon: ({focused, color}) => {
          let iconName;

          switch (route.name) {
            case 'PlansTab':
              iconName = faList;
              break;
            case 'HistoryTab':
              iconName = faCalendar;
              break;
            case 'TrainingTab':
              iconName = faDumbbell;
              break;
            case 'MoreTab':
              iconName = faEllipsisVertical;
              break;
            default:
              iconName = null;
              break;
          }

          return iconName ? (
            <FontAwesomeIcon icon={iconName} size={24} color={color} />
          ) : null;
        },
      })}>
      <Tab.Screen name="PlansTab" component={PlansStackNavigator} />
      <Tab.Screen name="HistoryTab" component={HistoryStackNavigator} />
      <Tab.Screen name="TrainingTab" component={TrainingStackNavigator} />
      <Tab.Screen name="MoreTab" component={MoreStackNavigator} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#202024',
    height: 60,
    // Usunięto position: 'absolute'
  },
});

export default HomeTabs;
