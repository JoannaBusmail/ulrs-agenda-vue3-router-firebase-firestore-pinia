// Importamos initializeApp
//Importamos las funciones que contiene firebase, las que necesitemos, getAuth..
//sirve para registrat, crear, enviar mail al usuario..
//chequeamod documentacion
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration, esto nos los da firebase
//una vez hayamos hecho el proyecto en su web, copiamos y pegamos
const firebaseConfig = {
  apiKey: "AIzaSyC8-wjGqmerKNxOgChgB8l7TkPuIIHRwuU",
  authDomain: "fir-1-a7874.firebaseapp.com",
  projectId: "fir-1-a7874",
  storageBucket: "fir-1-a7874.appspot.com",
  messagingSenderId: "719237042718",
  appId: "1:719237042718:web:4f83972a273a62b9ef940f"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// inicializamos getAuth
const auth = getAuth(firebaseApp)
//inicializamos firestore
const db = getFirestore(firebaseApp);
//inicializamos storage
const storage = getStorage(firebaseApp);

//exportamos auth para usarla en otros componentes
export { auth, db, storage }