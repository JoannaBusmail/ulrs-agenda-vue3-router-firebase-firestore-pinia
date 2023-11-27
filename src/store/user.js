import { defineStore} from 'pinia'
import { ref } from 'vue'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification, updateProfile } from 'firebase/auth'
import { auth, db, storage } from '../firebaseConfig'
import { useRouter }  from 'vue-router'
import { useDataBase } from './dataBase'
import { doc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref as storeRef, uploadBytes } from "firebase/storage";


export const useUserStore = defineStore('userStore', () => {

    
//route
 const router = useRouter()

 //state
 const userData = ref(null)
 const isLoading = ref(false)
 const loadingSession = ref(false)

//actions - firebase
 const registerUser = async (email, password) => {
    isLoading.value = true
    try {
      //firebase methos to create user with email and password
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        userData.value = {email: user.email, uid: user.uid}
        // firebase method to send email verification
        await sendEmailVerification(auth.currentUser)
       // once registered, we redirect to login
        router.push('/login')
    
    } catch (error) {
        console.log("register error:", error.code)
        return error.code
        
    } finally{
        isLoading.value = false
    }
 }

 // firebase method to update displayName and image
const updateUserProfile = async (displayName, image) =>{
  isLoading.value = true
  try {
    if(image){
   // create a reference to the storage bucket location
    const storageRef = storeRef(storage, `perfiles/${userData.value.uid}`)
    // upload image to storage bucket
    await uploadBytes(storageRef, image.originFileObj)
    const imageUrl = await getDownloadURL(storageRef)
    //update profile
    await updateProfile(auth.currentUser, {
      photoURL:imageUrl
    })
    }
    await updateProfile(auth.currentUser, {displayName: displayName})
    //update user data
    setUser(auth.currentUser)

  } catch (error) {
    return error.code

  } finally {
    isLoading.value= false
  }
}



const setUser = async(user)=>{
  try {
       //create a reference to the user document in the database
        const docRef = doc(db, 'users', user.uid)
        //update user data
           userData.value = {
             email: user.email, 
             uid: user.uid, 
             displayName: user.displayName, 
             photoUrl: user.photoURL
          }
        // save user data in the database
        await setDoc(docRef, userData.value)
        
     } catch (error) {
       console.log(error.code)
       return error.code
      }
}


// firebase method to sign in user with email and password
 const signInUser = async ( email, password ) => {
    isLoading.value=true
    try {
       const {user} = await signInWithEmailAndPassword (auth, email, password)
       await setUser(user)
        router.push('/')

    } catch (error) {
      console.log(error.code)
      return error.code
    
    } finally{
        isLoading.value = false
    }
 }

// firebase method to sign out user
  const logOut = async () => {
// reset bbdd
    const dataBaseStore = useDataBase()
    const { $reset } = dataBaseStore

   $reset()
      try {
        router.push('/login')
        await signOut(auth)
      
       
      } catch (error) {
        console.log("log out eerror:", error)
      }
 }

// firebase method to get current user(need to convert to promise)
  const currentUser = () => {
     return new Promise((resolve, reject) => {
 
        const unsubscribe = onAuthStateChanged(auth, async(user) => {
   // if user exists, we set userData to user data
        if (user) {
         userData.value = {
          email: user.email, 
          uid: user.uid, 
          displayName: user.displayName, 
          photoUrl: user.photoURL
          }
         resolve(user);
        } else {
        // if user does not exist, we set userData to null
          userData.value = null;
          // reset bbdd
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