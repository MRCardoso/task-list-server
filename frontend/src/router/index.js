import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home/home.vue'

import { userKey } from '@/utils/index'

const Signin = () => import(/* webpackChunkName: "auth" */'@/views/auth/signin.vue')
const Signup = () => import(/* webpackChunkName: "auth" */'@/views/auth/signup.vue')
const Logged = () => import(/* webpackChunkName: "user" */'@/views/auth/logged.vue')

const Task = () => import(/* webpackChunkName: "task" */'@/views/task/index.vue')
const TaskSave = () => import(/* webpackChunkName: "task" */'@/views/task/save.vue')

Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/signin', component: Signin },
        { path: '/signup', component: Signup },
        { path: '/logged', component: Logged, meta: { requiresLogin: true } },
        { path: '/', component: Home },
        { path: '/tasks', component: Task, meta: { requiresLogin: true } },
        { path: '/tasks/new', component: TaskSave, meta: { requiresLogin: true } },
        { path: '/tasks/:id/edit', component: TaskSave, meta: { requiresLogin: true }, props: true },
    ]
});

router.beforeEach( (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresLogin)) {
        const json = localStorage.getItem(userKey)
        const user = JSON.parse(json)
        user ? next() : next({ path: '/' })
    } else {
        next()
    }
})

export default router