import { defineStore} from 'pinia'
import { ref, computed } from 'vue'
// importo estos dos métodos de firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { useRouter }  from 'vue-router'



export const useUserStore = defineStore('userStore', () => {

    
//route
//vue router tiene un método para empujar el usuario registrado a la HOME
// useRouter tiene el método push
//inicializamos -> const router = useRouter()

 const router = useRouter()

 const userData = ref({})
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
         // una vez el usuario se ha registrado pusheamos a la ruta home 
         // llamando a la variable router con el metodo push
         // router.push('/')
        router.push('/')
        console.log(userData)
    } catch (error) {
        console.log("register error:", error)
        
    } finally{
        isLoading.value = false
    }
 }
//chequeamos el metodo signInWithEmailAndPassword en la web y lo aplicamos
//retornamos esta función para poder llamarla en mis componentes
 const signInUser = async ( email, password ) => {
    //asigno valor true a isloading, para deshabilitar el boton cuando  estoy esperando la info
    isLoading.value=true
    try {
        const { user } = await signInWithEmailAndPassword (auth, email, password)
        userData.value = { email: user.email, uid: user.uid}
        console.log('antes de push')
        router.push('/')
        console.log("sign in:" , userData)
    } catch (error) {
      console.log('sign in error')
    
    } finally{
        //cuando ya tengo la info, asigno valor false, para voler a utilizar el boton
        isLoading.value = false
    }
 }
// usamos el metodo signOut de firebase
// segun la documentación este no conlleva respuesta por tanto si falla, tirará directamente el error
 const logOut = async () => {
    try {
        await signOut(auth)
        //limpiamos userData para que este vacío de nuevo
        userData.value = null
        //le agregamos la ruta push login, en caso de que hagamos log out nos redirija a login
        router.push('/login')
    } catch (error) {
        console.log("log out eerror:", error)
    }
 }
//onAuthStateChanged es de firebase - no es promesa, y esto da errores
//por eso lo convertimos en promesa
const currentUser = () => {
  return new Promise((resolve, reject) => {
    // iniciamos onAuthStateChanged -> se utilia para observar cambios en el
    //estado de autenticacion del usuario
    //2 parametros, auth y callback que se llama cada vez que el estado de 
    //auteticacion cambia
    //en el callback user es el objeto del usuario
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      //si user existe, es decir que está autenticado
      //actualizamos el valor de userData
      if (user) {
        userData.value = {
          email: user.email,
          uid: user.uid
        };
        resolve(user);
      } else {
        userData.value = null;
        resolve(null);
      }(error) => {
        reject(error);
      },  
      unsubscribe();
    });
 });
};




    return { userData, registerUser, signInUser, logOut, isLoading, currentUser, loadingSession }

})