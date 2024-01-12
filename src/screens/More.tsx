// More.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const More = () => {
  return (
    <View style={styles.background}>
      <Text>More Screen</Text>
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

export default More;
