import {createRouter,createWebHashHistory} from 'vue-router'
import myRules from '../components/myRules.vue'
import HelloWorld from '../components/HelloWorld.vue'

const routes =[
    {
        path:'/',
        name:'welcome',
        component:HelloWorld
    },
    {
        path:'/game',
        name:'game',
        component:myRules
    }
]
const router =createRouter({
    history:createWebHashHistory(),
    routes
})
export default router;