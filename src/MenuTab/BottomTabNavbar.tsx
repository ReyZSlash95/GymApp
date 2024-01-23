import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // Importuj useNavigation

const Navbar = () => {
  const navigation = useNavigation(); // Użyj useNavigation do uzyskania dostępu do nawigacji

  return (
    <View
      style={{
        height: 60,
        backgroundColor: '#202024',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <TouchableOpacity onPress={() => navigation.navigate('Plans')}>
        <Text style={{color: 'white', paddingHorizontal: 16}}>Plans</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('History')}>
        <Text style={{color: 'white', paddingHorizontal: 16}}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Training')}>
        <Text style={{color: 'white', paddingHorizontal: 16}}>Training</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('More')}>
        <Text style={{color: 'white', paddingHorizontal: 16}}>More</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;
