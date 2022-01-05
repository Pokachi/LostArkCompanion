import Vue from 'vue'
import Router from 'vue-router'
import GameMap from '@/components/GameMap'
import DailyTracker from "@/components/DailyTracker";
import ToDo from "@/components/ToDo/ToDo";
import MokokoTracker from "@/components/Collectibles/MokokoTracker";
import IgneaTracker from "@/components/Collectibles/IgneaTracker";

Vue.use(Router)

export default new Router({
    //mode: 'history',
    base: __dirname,
    routes: [
        { path: '/map', name: 'Home', component: GameMap },
        { path: '/collectibles/mokoko', name: 'Mokoko Bean Tracker', component: MokokoTracker },
        { path: '/collectibles/ignea', name: 'Ignea Tracker', component: IgneaTracker },
        { path: '/daily', name: 'Daily', component: DailyTracker },
        { path: '/tasks', name: 'Tasks', component: ToDo }
    ]
})
