import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Exercises = () => {
  return (
    <View style={styles.background}>
      <Text>Exercises Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121214',
  },
});

export default Exercises;
