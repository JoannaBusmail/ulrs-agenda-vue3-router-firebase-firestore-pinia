import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Editar from '../views/Editar.vue'
import Profile from '../views/Profile.vue'
import NotFound from '../views/NotFound.vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../store/user'
import { useDataBase } from '../store/dataBase'

    //RUTAS PROTEGIDAS
const requireAuth = async (to, from, next) =>{
    //si usamos store fuera de un comoponente debe ir dentro de una funcion
    const userStore = useUserStore()
    const { loadingSession} = storeToRefs(userStore)
    const { currentUser } = userStore
    loadingSession.value = true
    //vemos qien es el usuario actual
    // si el usuario esta autenticado podemos ir a home
    //sino nos redirije a login
   const user = await currentUser()
   if(user){
    next()
   }else{
    next('/login')
   }
   loadingSession.value = false

}

const redirection = async(to, from, next) =>{
    const userStore = useUserStore()
    const { loadingSession} = storeToRefs(userStore)
    const dataBaseStore = useDataBase()
    const { getUrl } = dataBaseStore
    console.log(to.params.pathMatch[0])

    loadingSession.value = true
    const name =  await getUrl(to.params.pathMatch[0])
    //si es falso, vamos a not found //el falso lo hemos sacado de geturl
    if(!name) {
        next()
        loadingSession.value = false
    }else {
        window.location.href = name
        loadingSession.value = true
        next()
    }
    
}

const routes = [

    //agegamos el beforeEnter -> significa que antes de entrar en esta ruta siemper tiene que
    //chequear la funcion requireAuth
    {path: '/', component: Home, beforeEnter: requireAuth, name: 'home'},
    //ruta protegida para editar- solo los autenticados pueden acceder
    // necesito que la url sea dinamica para pintar el id del usuario
    //este id, necesito consumirlo en la vista
    {path: '/login', component: Login, name: 'login'},
    {path: '/register', component: Register, name: 'register'},
    {path: '/profile', component: Profile, beforeEnter: requireAuth, name: 'profile'},
    {path: '/editar/:id', component: Editar, beforeEnter: requireAuth, name: 'editar'},
    {path: '/:pathMatch(.*)*', component: NotFound, beforeEnter:redirection, name: 'redirection'},

]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router