import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import FastImage from 'react-native-fast-image';

import {useNavigation} from '@react-navigation/native';

const History = () => {
  const [groupedPlans, setGroupedPlans] = useState([]);
  const [expandedMonth, setExpandedMonth] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const subscriber = firestore()
      .collection('trainingHistory')
      .orderBy('completedDate', 'desc')
      .onSnapshot(querySnapshot => {
        const plans = [];
        querySnapshot.forEach(documentSnapshot => {
          const data = documentSnapshot.data();
          let date = new Date();
          let monthYear = '';

          if (data.completedDate && data.completedDate.seconds) {
            date = new Date(data.completedDate.seconds * 1000);
            monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
          }

          plans.push({
            ...data,
            key: documentSnapshot.id,
            completedDate: date,
            monthYear,
          });
        });

        const grouped = plans.reduce((groups, plan) => {
          (groups[plan.monthYear] = groups[plan.monthYear] || []).push(plan);
          return groups;
        }, {});

        setGroupedPlans(Object.entries(grouped));
      });

    return () => subscriber();
  }, []);

  const handleExpand = monthYear => {
    setExpandedMonth(expandedMonth === monthYear ? null : monthYear);
  };

  const openTrainingDetails = planId => {
    navigation.navigate('TrainingDetail', {planId});
  };

  const renderPlanDetails = plan => (
    <View key={plan.key} style={styles.planItem}>
      <TouchableOpacity
        onPress={() => openTrainingDetails(plan.key)}
        style={styles.detailContainer}>
        <Text style={styles.planName}>{plan.planName}</Text>
        <Text style={styles.planDate}>
          {plan.completedDate
            ? `${plan.completedDate.getDate()}/${plan.completedDate.getMonth() + 1}/${plan.completedDate.getFullYear()}`
            : ''}
        </Text>
        {/* Miejsce na inne elementy planu */}
      </TouchableOpacity>
    </View>
  );

  const MonthSection = ({item}) => (
    <View>
      <TouchableOpacity onPress={() => handleExpand(item[0])}>
        <Text style={styles.monthHeader}>{item[0]}</Text>
      </TouchableOpacity>
      {expandedMonth === item[0] &&
        item[1] &&
        Array.isArray(item[1]) && // Sprawdza, czy item[1] jest tablicą
        item[1].map(
          plan => renderPlanDetails(plan),

          // <View key={plan.key} style={styles.planItem}>
          //   <Text style={styles.planName}>{plan.planName}</Text>
          //   <Text style={styles.planDate}>
          //     {plan.completedDate
          //       ? `${plan.completedDate.getDate()}/${plan.completedDate.getMonth() + 1}/${plan.completedDate.getFullYear()}`
          //       : ''}
          //   </Text>
          //   {/* Miejsce na inne elementy planu */}
          // </View>
        )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={groupedPlans}
        renderItem={({item}) => <MonthSection item={item} />}
        keyExtractor={(item, index) => 'month-' + index} // Unikalny klucz dla każdego elementu listy
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121214',
    padding: 10,
  },
  monthHeader: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  planItem: {
    backgroundColor: '#29292E',
    borderRadius: 3,
    padding: 10,
    marginBottom: 5,
  },
  planName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  planDate: {
    color: 'white',
    fontSize: 14,
  },
  // Możesz dodać więcej stylów tutaj
});

export default History;
