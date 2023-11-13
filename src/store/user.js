import { defineStore} from 'pinia'
import { ref, computed } from 'vue'
// importo estos dos métodos de firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification, updateEmail, updateProfile } from 'firebase/auth'
import { auth, db, storage } from '../firebaseConfig'
import { useRouter }  from 'vue-router'
import { useDataBase } from './dataBase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref as storeRef, uploadBytes } from "firebase/storage";


export const useUserStore = defineStore('userStore', () => {

    
//route
//vue router tiene un método para empujar el usuario registrado a la HOME
// useRouter tiene el método push
//inicializamos -> const router = useRouter()

 const router = useRouter()

 const userData = ref(null)
 const isLoading = ref(false)
 //loading que usamos para esperar los datos de si el usuario esta registrado
 const loadingSession = ref(false)

 //no tenemos email y passwors, son los parametros que nos vendran de la vista de register
 const registerUser = async (email, password) => {
    isLoading.value = true
    try {
        //en vez de hacer const response = await... la documentacion nos dice que la 
        // la respuesta es userCredentials con una propiedad llamada user --> usersCredentials.user
        // por tanto podemos hacer destructuring de ese objeto y esa propiedad que encesitamos
        // uso el método createUserWithEmailAndPassword con sus 3 parametros, auth que viene de firebase
        // email y password
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        //metemos en user data el emil y el uid que viene del user
        userData.value = {email: user.email, uid: user.uid}
        await sendEmailVerification(auth.currentUser)
         // una vez el usuario se ha registrado pusheamos a la ruta home 
         // llamando a la variable router con el metodo push
         // router.push('/')
        router.push('/login')
    
    } catch (error) {
        console.log("register error:", error.code)
        return error.code
        
    } finally{
        isLoading.value = false
    }
 }

 
const updateUserProfile = async (displayName, image) =>{
  isLoading.value = true
  try {
    if(image){
   //segundo parametro nombre de carpeta de la pagina de storage
    //tengo una carpeta perfiles y dentro las uid del usuario
    //1 carpeta por cada usuario, le paso el id del usuario
    const storageRef = storeRef(storage, `perfiles/${userData.value.uid}`)
    //le pasamos la imagen y OriginFileObjt que lopuedo ver en el inspect, es donde dice que es tipo File
    await uploadBytes(storageRef, image.originFileObj)
    const imageUrl = await getDownloadURL(storageRef)
    await updateProfile(auth.currentUser, {
      photoURL:imageUrl
    })
    }
    await updateProfile(auth.currentUser, {displayName: displayName})
    setUser(auth.currentUser)
  } catch (error) {
    return error.code
  } finally {
    isLoading.value= false
  }
}



const setUser = async(user)=>{
  try {
        //existe coleecion de usuarios? si no la creo
        //hacemos referencia
        //hacemos coleeccion user, y en este caso el id unico del user
        const docRef = doc(db, 'users', user.uid)
        //actualizo
           userData.value = {
             email: user.email, 
             uid: user.uid, 
             displayName: user.displayName, 
             photoUrl: user.photoURL
          }
        //guardamos con lo actualizado
        await setDoc(docRef, userData.value)
        
     } catch (error) {
       console.log(error.code)
       return error.code
      }
}


//chequeamos el metodo signInWithEmailAndPassword en la web y lo aplicamos
//retornamos esta función para poder llamarla en mis componentes
 const signInUser = async ( email, password ) => {
    //asigno valor true a isloading, para deshabilitar el boton cuando  estoy esperando la info
    isLoading.value=true
    try {
       const {user} = await signInWithEmailAndPassword (auth, email, password)
       await setUser(user)
        router.push('/')

    } catch (error) {
      console.log(error.code)
      return error.code
    
    } finally{
        //cuando ya tengo la info, asigno valor false, para voler a utilizar el boton
        isLoading.value = false
    }
 }
// usamos el metodo signOut de firebase
// segun la documentación este no conlleva respuesta por tanto si falla, tirará directamente el error
 const logOut = async () => {
  //RESET STORE Y COMUNICACIÓN ENTRE STORES
  //necesito resetear la info de la bbdd cuando hago logout
  //Importo la store donde llamo a la bbdd y l ainicializo aqui dentro
  //si tengo que usar esta store en otro action, tengo que inicilizarlo dentro de cada action
  const dataBaseStore = useDataBase()
  const { $reset } = dataBaseStore
  //$reset() metodo de pinia no funciona para setup
  //creo mi propio metodo en database store
  $reset()
    try {
      router.push('/login')
        await signOut(auth)
        //le agregamos la ruta push login, en caso de que hagamos log out nos redirija a login
       
    } catch (error) {
        console.log("log out eerror:", error)
    }
 }

//cada vez que se actualiza, logeamos, etc, trae la info del usuario
//onAuthStateChanged es de firebase - no es promesa, y esto da errores
//por eso lo convertimos en promesa
const currentUser = () => {
  return new Promise((resolve, reject) => {
    // iniciamos onAuthStateChanged -> se utilia para observar cambios en el
    //estado de autenticacion del usuario
    //2 parametros, auth y callback que se llama cada vez que el estado de 
    //auteticacion cambia
    //en el callback user es el objeto del usuario
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
      //si user existe, es decir que está autenticado
      //actualizamos el valor de userData
      if (user) {
        console.log(user)
        userData.value = {
          email: user.email, 
          uid: user.uid, 
          displayName: user.displayName, 
          photoUrl: user.photoURL
       }
        resolve(user);
      } else {
        //reinicimos sesion del usuario
        userData.value = null;
        //aqui tabn reseteo bbdd
        const dataBaseStore = useDataBase()
        dataBaseStore.$reset()
        resolve(null);
      }(error) => {
        reject(error);
      },  
      unsubscribe();
    });
 });
};




    return { userData, registerUser, signInUser, logOut, isLoading, currentUser, loadingSession, setUser, updateUserProfile}

})