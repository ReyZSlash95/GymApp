import React, {useState} from 'react';
import {Menu, IconButton} from 'react-native-paper';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEllipsisVertical} from '@fortawesome/free-solid-svg-icons';
import {TouchableOpacity} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const DropDown = ({onRemoveExercise, exerciseIndex, onAddNote}) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const navigation = useNavigation();

  return (
    <Menu
      visible={visible}
      style={{marginTop: 50}}
      onDismiss={closeMenu}
      anchor={
        <TouchableOpacity onPress={openMenu}>
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            size={24}
            color="#7C7C8A"
          />
        </TouchableOpacity>
      }>
      <Menu.Item
        onPress={() => {
          onRemoveExercise();
          closeMenu();
        }}
        title="Usuń ćwiczenie"
      />
      <Menu.Item
        onPress={() => {
          //   onChangeExercise(newExercise);
          navigation.navigate('BodyParts', {changingExercise: exerciseIndex});
          closeMenu();
        }}
        title="Zmień ćwiczenie"
      />
      <Menu.Item
        onPress={() => {
          onAddNote();
          closeMenu();
        }}
        title="Dodaj notatkę"
      />
    </Menu>
  );
};

export default DropDown;
