import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../store/user'


const requireAuth = async (to, from, next) =>{
    //si usamos store fuera de un comoponente debe ir dentro de una funcion
    const userStore = useUserStore()
    const { loadingSession} = storeToRefs(userStore)
    const { currentUser } = userStore
    loadingSession.value = true
    //RUTAS PROTEGIDAS
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

const routes = [
    //agegamos el beforeEnter -> significa que antes de entrar en esta ruta siemper tiene que
    //chequear la funcion requireAuth
    {path: '/', component: Home, beforeEnter: requireAuth},
    {path: '/login', component: Login},
    {path: '/register', component: Register}
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router