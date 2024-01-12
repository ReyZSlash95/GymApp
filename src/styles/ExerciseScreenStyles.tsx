import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121214',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#29292E',
    padding: 5,
    margin: 3,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    marginLeft: 3,
    borderRadius: 2,
  },

  list: {
    marginTop: 10,
  },

  exerciseText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 3,
  },
});
