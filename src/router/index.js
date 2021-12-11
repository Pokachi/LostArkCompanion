import Vue from 'vue'
import Router from 'vue-router'
import GameMap from '@/components/GameMap'
import DailyTracker from "@/components/DailyTracker";
import MokokoTracker from "@/components/Collectibles/MokokoTracker";

Vue.use(Router)

export default new Router({
    //mode: 'history',
    base: __dirname,
    routes: [
        { path: '/map', name: 'Home', component: GameMap },
        { path: '/collectibles/mokoko', name: 'Mokoko Bean Tracker', component: MokokoTracker },
        { path: '/daily', name: 'Daily', component: DailyTracker }
    ]
})
