import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Start from '@/pages/Start'
import Canvas from '@/pages/Canvas'
import Canvas1 from '@/pages/Canvas1'
import Index from '@/pages/Index'
import Test from '@/pages/Test'
import Rank from '@/pages/Rank'

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
        {
            path: '/index',
            name: 'Index',
            component: Index
        },

        {
            path: '/canvas1',
            name: 'Canvas1',
            component: Canvas1
        },
        {
            path: '/test',
            name: 'Test',
            component: Test
        },
        {
            path: '/rank',
            name: 'Rank',
            component: Rank
        },
    ]
})
