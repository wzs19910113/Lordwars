import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Start from '@/pages/Start'
import Canvas from '@/pages/Canvas'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/home',
            name: 'Home',
            component: Home
        },
        {
            path: '/',
            name: 'Start',
            component: Start
        },
        {
            path: '/canvas',
            name: 'Canvas',
            component: Canvas
        },
    ]
})
