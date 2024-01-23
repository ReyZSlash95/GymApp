import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import FastImage from 'react-native-fast-image';
import {CheckBox} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

const TrainingSummary = ({route}) => {
  const {plan} = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Podsumowanie treningu</Text>
      {/* Wyświetl szczegóły treningu */}
    </View>
  );
};

const styles = StyleSheet.create({});

export default TrainingSummary;
