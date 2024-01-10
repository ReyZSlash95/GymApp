// firebaseConfig.js
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

// Konfiguracja Firebase, jeśli jest potrzebna

// Włącz buforowanie danych offline
firebase.firestore().settings({persistence: true});

// Eksportuj skonfigurowaną instancję firebase
export default firebase;
