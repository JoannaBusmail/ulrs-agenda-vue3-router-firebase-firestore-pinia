import { defineStore} from 'pinia'
import { ref } from 'vue'
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
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
//$reset de pinia no funciona para setip, tengo que crear mi propio metodo reset e importar
    const $reset = () =>{
    documents.value = []
    loadingDoc.value = false
    }

    const getUrls = async () => {
        try {
            //tengo que resetear documents, sino cuando llamo a esta funcion y ya tiene docs cargados
            //puede mostrar los anteriores y los nuevos
            // reseteo en logout, pero esta bien mantener esto para no hacer sobreconsumos en la bbdd
            if(documents.value.length !==0) {
                return
            }
            loadingDoc.value = true
            //documentacion de firebase
            //hago query, llamo a mi coleccion, 2 argumentos db -> de firebaseConfig
            // nombre de nuestra coleccion, el where de la documentacion es para filtrar
            //filtro que sea mi usuario actual, el que esta logeado
            const q = query(collection(db, "urls"), where("user", "==", auth.currentUser.uid))
            //sacado de la documentacion, usamos metodo getDocs para hacer consumo de la bbdd
            //getDocs recibe la query
            //usamos await porque e suna consulta a bbdd y tarda
            const querySnapshot = await getDocs(q);
            //tenemos que recorrerl lo que nos trae la bbdd
            querySnapshot.forEach((doc) => {
                console.log(doc.id, doc.data())
                //subimos a documents lo que nos trae la base de datos
                //doc.id y doc.data son propiedades de doc, solo que id 
                //es el id de cada objeto data, por eso va fuera
                //data es un objeto por eso podemos hacer spread(name, user, short)
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

    const addUrl = async (name) => {
        loadingUrl.value = true
    
    try {
        const objectDoc = {
            //name viene de la vista de nuestro formulario en home
            name: name,
            //nanoid es una libreria que nos da caracteres aleatorios, le pasamos como argumento la cantidad de caracteres que queremos
            short: nanoid(6),
            // el usuario actual, el autenticado por firebase
            user: auth.currentUser.uid
    
        }
        //usamos add poruque me genera un ID de cada doc
        const docRef = await addDoc (collection(db, "urls"), objectDoc)
        documents.value.push({
         ...objectDoc,
         id:docRef.id
        })

    } catch (error) {
        console.log(error.code)
        
    } finally {
        loadingUrl.value=false
    }

    }

    //le pasamos el id, ya que necesitamos saber qué documento estamos viendo
    const readUrl = async (id) => {
        loadingDoc.value = true
        try {
            const docRef = doc(db, 'urls', id)
            //usamos getDoc para coger un unico documento
            const docSnap  = await getDoc(docRef)

            if(!docSnap.exists()){
                throw new Error ("no existe el doc")
            }
       
            if(docSnap.data().user !== auth.currentUser.uid){
                throw new Error ("no le pertenece ese documento")
            }
            //del documento necesitamos la url, en este caso el name
            return docSnap.data().name

        } catch (error) {
            console.log(error)
        } finally {
            loadingDoc.value =false

        }
    }

    // necesitamos el id del documento que queremos actualizar y la url (name)
    const updateUrl = async(id, name) => {
        try {
            const docRef = doc(db, 'urls', id)
            const docSnap  = await getDoc(docRef)
            if(!docSnap.exists()){
                throw new Error ("no existe el doc")
            }
        //si es el usuario autenticado podemos actualizar la url, en este caso naem
        // usamos map, para recorrer el array y hacer una funcion sobre cada elemento
        //si el id del item es igual al id que le pasemos, entonces devolvemos todo el objeto de item y el name cambiado
        //si no coincide el id, devolvemos todo item
        //usamos map porque debe devolver todos los elementos de mi array, filter en cambio puede eliminar objetos del array
            if(docSnap.data().user === auth.currentUser.uid){
                await updateDoc(docRef, {
                    name:name
                })
                documents.value = documents.value.map((item) =>{
                   return item.id === id ? {...item, name:name} : item
                    //una vez actualizado pusheamos al usuario a la pagina de inicio
                
                })
                router.push('/')
            } else {
                throw new Error ("no eres el autor")
            }
            
            
        } catch (error) {
            console.log(error)
        }finally {

        }
    }
    // le pasamos como argumento el ID de la colleccion
    //el id que hemos agregado en addUrl
    const deleteUrl = async (id) => {
        loadingUrl.value = true
        try {
            //pongo esto en una constante por que lo voy a usar en varios métodos de firestore
            const docRef = doc(db, 'urls', id)
            //hago verificaciones antes de eliminar
            //existe el docSnap ---viene de la documentacion de firestore
            //getDoc es de firestore
            const docSnap  = await getDoc(docRef)
            if(!docSnap.exists()){
                throw new Error ("no existe el doc")
            }
            //es el usuario autenticado
            //data() viene de firebase --- ver getDocs
            if(docSnap.data().user !== auth.currentUser.uid){
                throw new Error ("no le pertenece ese documento")
            }

            //esto lo elimina de la bbdd, por tanto tengo que refrescar la vista para ver los efectos
            await deleteDoc(docRef)
            //esto lo elimina de la vista
            documents.value = documents.value.filter(item=>item.id !==id)
        } catch (error) {
            console.log(error.code)
            return error.message
        }finally {
            loadingUrl.value= false
        }
    }
        return { documents, getUrls, loadingDoc, loadingUrl, addUrl, $reset, deleteUrl, readUrl, updateUrl }
})