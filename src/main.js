import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/scss/custom.scss'; 
import io from 'socket.io-client';

// 1. Assign app to a variable
let app = createApp(App)

// 2. Assign the global variable before mounting
// Local
app.config.globalProperties.socket = io("127.0.0.1:3000");

// prod
// app.config.globalProperties.socket = io("wss://pacific-alive-wasabi.glitch.me/", {
//     headers:{
//         "user-agent": "Brice"
//     }
// });



// 3. Use router and mount app
app.use(router).mount('#app')



