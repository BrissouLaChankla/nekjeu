import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RoomView from '../views/RoomView.vue'
import GameView from '../views/GameView.vue'
import EndView from '../views/EndView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    props:true
  },
  {
    path: '/room/:id',
    name: 'Room',
    component: RoomView,
    props:true
  },
  {
    path: '/game/:id',
    name: 'Game',
    component: GameView,
    props:true
  },
  {
    path:'/end',
    name:'End',
    component:EndView,
    props:true
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
