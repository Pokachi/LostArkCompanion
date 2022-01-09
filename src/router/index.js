import Vue from 'vue'
import Router from 'vue-router'
import GameMap from '@/components/GameMap'
import Home from '@/components/Home/Home'
import ToDo from "@/components/ToDo/ToDo";
import MokokoTracker from "@/components/Collectibles/MokokoTracker";
import IgneaTracker from "@/components/Collectibles/IgneaTracker";

Vue.use(Router)

export default new Router({
    //mode: 'history',
    base: __dirname,
    routes: [
        { path: '/home', name: 'Home', component: Home },
        { path: '/map', name: 'Map', component: GameMap },
        { path: '/collectibles/mokoko', name: 'Mokoko Bean Tracker', component: MokokoTracker },
        { path: '/collectibles/ignea', name: 'Ignea Tracker', component: IgneaTracker },
        { path: '/tasks', name: 'Tasks', component: ToDo }
    ]
})
