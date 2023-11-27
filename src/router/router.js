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

// RUTAS PROTEGIDAS
const requireAuth = async (to, from, next) =>{
    //using store out of a component: it must be used inside function
    const userStore = useUserStore()
    const { loadingSession} = storeToRefs(userStore)
    const { currentUser } = userStore
    loadingSession.value = true
   // verify if user is logged in then can go to profile
   const user = await currentUser()
   if(user){
    next()
   }else{
    next('/login')
   }
   loadingSession.value = false

}

//REDIRECTION SHORT URL TO ORIGINAL URL
const redirection = async(to, from, next) =>{
    //store
    const userStore = useUserStore()
    const { loadingSession} = storeToRefs(userStore)
    const dataBaseStore = useDataBase()
    const { getUrl } = dataBaseStore


    loadingSession.value = true
    //get url from firebase
    const name =  await getUrl(to.params.pathMatch[0])
    //if url does not exist, redirect to not found
    if(!name) {
        next()
        loadingSession.value = false
    //if url exist, redirect to original url
    } else {
        window.location.href = name
        loadingSession.value = true
        next()
    }
    
}

//ROUTES
const routes = [
    // breforeEnter vue router hook, requires authentification before entering to home, edit, profile
    {path: '/', component: Home, beforeEnter: requireAuth, name: 'home'},
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