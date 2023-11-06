import { defineStore} from 'pinia'
import { ref } from 'vue'
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebaseConfig'
import { nanoid } from 'nanoid'


export const useDataBase = defineStore('dataBaseStore', () => {
//state
    const documents = ref([])
    const loadingDoc = ref(false)

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
        console.log(docRef.id)
        documents.value.push({
         ...objectDoc,
         id:docRef.id
        })

    } catch (error) {
        console.log(error)
        
    } finally {

    }

    }

    // le pasamos como argumento el ID de la colleccion
    //e lid que hemos agregado en addUrl
    const deleteUrl = async (id) => {
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
            console.log(error)
        }finally {

        }
    }
        return { documents, getUrls, loadingDoc, addUrl, $reset, deleteUrl }
})