import { defineStore} from 'pinia'
import { ref } from 'vue'
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { auth, db } from '../firebaseConfig'
import { nanoid } from 'nanoid'
import { useRouter }  from 'vue-router'


export const useDataBase = defineStore('dataBaseStore', () => {

//router
    const router = useRouter()

//state
    const documents = ref([])
    const loadingDoc = ref(false)
    const loadingUrl = ref(false)


//actions
//$reset pinia does not work, create reset method
    const $reset = () =>{
    documents.value = []
    loadingDoc.value = false
    }

//get url
    const getUrl = async (id) => {
        loadingDoc.value = true
        try {
            const docRef = doc(db, 'urls', id)
            //getDoc firebase method
            const docSnap  = await getDoc(docRef)
            if(!docSnap.exists()){
                return false
            }
            return docSnap.data().name

        } catch (error) {
            console.log(error)
            return false

        } finally {
            loadingDoc.value =false

        }
    }

    //get all urls
    const getUrls = async () => {
        try {
            
            if(documents.value.length !==0) {
                return
            }
            loadingDoc.value = true
            //query to get all documents from collection urls where user is equal to auth.currentUser.uid
            const q = query(collection(db, "urls"), where("user", "==", auth.currentUser.uid))
             //getDocs firebase method
            const querySnapshot = await getDocs(q);
            //querySnapshot is an array of documents
            querySnapshot.forEach((doc) => {
                console.log(doc.id, doc.data())
                //push all documents to documents.value
                documents.value.push({
                    id: doc.id,
                    ...doc.data()
                })
            })

        } catch (error) {
            console.log(error)
        } finally {
            loadingDoc.value = false
        }
    }

    //add url
    const addUrl = async (name) => {
        loadingUrl.value = true
    
         try {
            const objectDoc = {
            name: name,
            //nanoid library to generate a random character string(pass 6 characters)
            short: nanoid(6),
            //auth.currentUser.uid is the user id
            user: auth.currentUser.uid
    
            }
            //setDoc firebase method
            //if we have specified id we use setDoc, if not we use addDoc
            await setDoc(doc(db, "urls", objectDoc.short), objectDoc)
                documents.value.push({
                ...objectDoc,
                id: objectDoc.short
             })

         } catch (error) {
            console.log(error.code)
        
         } finally {
            loadingUrl.value=false
         }

    }

    //read url
    const readUrl = async (id) => {
        loadingDoc.value = true
        try {
            const docRef = doc(db, 'urls', id)
            //getDoc firebase method
            const docSnap  = await getDoc(docRef)

            if(!docSnap.exists()){
                throw new Error ("no existe el doc")
            }
       
            if(docSnap.data().user !== auth.currentUser.uid){
                throw new Error ("no le pertenece ese documento")
            }
            //need to return the url
            return docSnap.data().name

        } catch (error) {
            console.log(error)
        } finally {
            loadingDoc.value =false

        }
    }

    //update url
    //need id and name(url) to update
    const updateUrl = async(id, name) => {
        try {
            const docRef = doc(db, 'urls', id)
            const docSnap  = await getDoc(docRef)
            if(!docSnap.exists()){
                throw new Error ("no existe el doc")
            }
            //check if the user is the author
            if(docSnap.data().user === auth.currentUser.uid){
                await updateDoc(docRef, {
                    name:name
                })
                documents.value = documents.value.map((item) =>{
                   return item.id === id ? {...item, name:name} : item
                })
                //redirect to home
                router.push('/')
            } else {
                throw new Error ("no eres el autor")
            }
            
            
        } catch (error) {
            console.log(error)
        } finally {

        }
    }
  
    //delete url
    const deleteUrl = async (id) => {
        loadingUrl.value = true
        try {
            //docRef is a reference to the document
            const docRef = doc(db, 'urls', id)
            //getDoc firebase method
            // do verification exits?, auth.currentUser.uid is the user id
            const docSnap  = await getDoc(docRef)
            if(!docSnap.exists()){
                throw new Error ("no existe el doc")
            }
        
            if(docSnap.data().user !== auth.currentUser.uid){
                throw new Error ("no le pertenece ese documento")
            }

            //delete from ddbb
            await deleteDoc(docRef)
            //delete from documents.value in views
            documents.value = documents.value.filter(item=>item.id !==id)

        } catch (error) {
            console.log(error.code)
            return error.message
        } finally {
            loadingUrl.value= false
        }
    }
        return { documents, getUrls, loadingDoc, loadingUrl, addUrl, $reset, deleteUrl, readUrl, updateUrl, getUrl }
})