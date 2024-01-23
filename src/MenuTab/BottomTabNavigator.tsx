import React, {useEffect, useRef} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as Animatable from 'react-native-animatable';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faList,
  faCalendar,
  faDumbbell,
  faEllipsisVertical,
  faD,
} from '@fortawesome/free-solid-svg-icons';
import Plans from '../screens/Plans'; // Zaimportuj swoje komponenty
import History from '../screens/History';
import Training from '../screens/Training';
import More from '../screens/More';

import {TouchableOpacity, StyleSheet, View} from 'react-native';

const Tab = createBottomTabNavigator();

const TabBarIcon = props => {
  const {icon, onPress, accessibilityState} = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const color = focused ? '#00B37E' : '#e4b04e';

  useEffect(() => {
    if (focused) {
      viewRef.current.animate({
        0: {scale: 0.8},
        1: {scale: 1.5},
      });
    } else {
      viewRef.current.animate({
        0: {scale: 1.5},
        1: {scale: 1},
      });
    }
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}>
      <Animatable.View
        ref={viewRef}
        duration={400}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <FontAwesomeIcon icon={icon} size={24} color={color} />
      </Animatable.View>
    </TouchableOpacity>
  );
};

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 60,
          backgroundColor: '#202024',
        },
        headerStyle: {
          backgroundColor: '#202024',
        },
        headerTintColor: '#00B37E',

        // tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        name="Plans"
        component={Plans}
        options={{
          tabBarShowLabel: false,
          tabBarButton: props => <TabBarIcon icon={faList} {...props} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarShowLabel: false,
          tabBarButton: props => <TabBarIcon icon={faCalendar} {...props} />,
        }}
      />
      <Tab.Screen
        name="Training"
        component={Training}
        options={{
          tabBarShowLabel: false,
          tabBarButton: props => <TabBarIcon icon={faDumbbell} {...props} />,
        }}
      />
      <Tab.Screen
        name="More"
        component={More}
        options={{
          tabBarShowLabel: false,
          tabBarButton: props => (
            <TabBarIcon icon={faEllipsisVertical} {...props} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeTabs;
