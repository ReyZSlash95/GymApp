// Plans.tsx
import React, { useEffect } from 'react';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Plans: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => navigation.navigate('NewPlan')}
          title="Stwórz plan"
          color="#000"
        />
      ),
    });
  }, [navigation]);

  // Rest of your code
};

export default Plans;