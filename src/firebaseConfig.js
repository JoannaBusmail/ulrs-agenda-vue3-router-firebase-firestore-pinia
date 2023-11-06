// Importamos initializeApp
//Importamos las funciones que contiene firebase, las que necesitemos, getAuth..
//sirve para registrat, crear, enviar mail al usuario..
//chequeamod documentacion
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


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
const app = initializeApp(firebaseConfig);
// inicializamos getAuth
const auth = getAuth(app)

//exportamos auth para usarla en otros componentes
export { auth }