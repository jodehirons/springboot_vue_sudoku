import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import VueAxios from 'vue-axios'


const app = createApp(App)
app.use(router).use(VueAxios)
app.mount('#new')


