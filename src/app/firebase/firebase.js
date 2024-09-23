import firebase from 'firebase';

// const firebaseConfig = {
//   apiKey: 'AIzaSyCaFOP1X0-XSA_rgT1qE4C5p7itbcOAkAY',
//   authDomain: 'fastbuild-1823d.firebaseapp.com',
//   databaseURL: 'https://fastbuild-1823d.firebaseio.com',
//   projectId: 'fastbuild-1823d',
//   storageBucket: 'fastbuild-1823d.appspot.com',
//   messagingSenderId: '604331351140',
//   appId: '1:604331351140:web:cbe0d6ed7d02bf86e51371',
//   measurementId: 'G-Z4RRWFWBQV',
// }; 
  const firebaseConfig = {
    apiKey: "AIzaSyAp8_edSR0OLHOrdBYidUOD03tNrcXoe_0",
    authDomain: "qbuild-console.firebaseapp.com",
    databaseURL: "https://qbuild-console-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "qbuild-console",
    storageBucket: "qbuild-console.appspot.com",
    messagingSenderId: "613955431352",
    appId: "1:613955431352:web:8274eec28aad49159bbd4d",
    measurementId: "G-FF528ZYDK8"
  };
firebase.initializeApp(firebaseConfig);

export default firebase;
