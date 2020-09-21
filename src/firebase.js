import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyC-tnTCZboYrcxdTPc-HQVEncBXOWhsFUA",
    authDomain: "instagram-clone-ef59f.firebaseapp.com",
    databaseURL: "https://instagram-clone-ef59f.firebaseio.com",
    projectId: "instagram-clone-ef59f",
    storageBucket: "instagram-clone-ef59f.appspot.com",
    messagingSenderId: "115771779891",
    appId: "1:115771779891:web:86485c9b6ebdfa151d2c46",
    measurementId: "G-S1B9GEX4N2"
});

const db = firebaseApp.firestore();

const auth = firebaseApp.auth();

const storage = firebase.storage();

export {db,auth,storage};