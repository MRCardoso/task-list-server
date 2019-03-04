import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home/home.vue'

import store from '@/store/index'
import { userKey } from '@/utils/index'

const Signin = () => import(/* webpackChunkName: "auth" */'@/views/auth/signin.vue')
const Signup = () => import(/* webpackChunkName: "auth" */'@/views/auth/signup.vue')
const Forgot = () => import(/* webpackChunkName: "auth" */'@/views/auth/forgot.vue')
const Reset = () => import(/* webpackChunkName: "auth" */'@/views/auth/reset.vue')
const Logged = () => import(/* webpackChunkName: "user" */'@/views/auth/logged.vue')

const Task = () => import(/* webpackChunkName: "task" */'@/views/task/index.vue')
const TaskSave = () => import(/* webpackChunkName: "task" */'@/views/task/save.vue')
const TaskDetail = () => import(/* webpackChunkName: "task" */'@/views/task/detail.vue')

const User = () => import(/* webpackChunkName: "user" */'@/views/user/index.vue')
const UserSave = () => import(/* webpackChunkName: "user" */'@/views/user/save.vue')
const UserDetail = () => import(/* webpackChunkName: "user" */'@/views/user/detail.vue')

Vue.use(Router)

const router = new Router({
    routes: [
        { path: '*', redirect: '/' },
        { path: '/', component: Home },
        { path: '/signin', component: Signin },
        { path: '/signup', component: Signup },
        { path: '/forgot', component: Forgot },
        { path: '/reset/:token', component: Reset, props: true},
        { path: '/logged', component: Logged, meta: { requiresLogin: true } },
        /*
        | ------------------------------------------------------------------------------------------
        | Task Routes
        | ------------------------------------------------------------------------------------------
        */
        { path: '/tasks', component: Task, meta: { requiresLogin: true } },
        { path: '/tasks/new', component: TaskSave, meta: { requiresLogin: true } },
        { path: '/tasks/:id/edit', component: TaskSave, meta: { requiresLogin: true }, props: true },
        { path: '/tasks/:id/detail', component: TaskDetail, meta: { requiresLogin: true }, props: true },
        /*
        | ------------------------------------------------------------------------------------------
        | User Routes
        | ------------------------------------------------------------------------------------------
        */
        { path: '/users', component: User, meta: { requiresLogin: true, requiresAdmin: true } },
        { path: '/users/new', component: UserSave, meta: { requiresLogin: true, requiresAdmin: true } },
        { path: '/users/:id/edit', component: UserSave, meta: { requiresLogin: true, requiresAdmin: true }, props: true },
        { path: '/users/:id/detail', component: UserDetail, meta: { requiresLogin: true, requiresAdmin: true }, props: true },
    ]
});

router.beforeEach( (to, from, next) => {
    store.state.hashTime = Date.now()
    if (to.matched.some(record => record.meta.requiresLogin)) {
        const json = localStorage.getItem(userKey)
        const user = JSON.parse(json)
        if (user){
            if (to.matched.some(record => record.meta.requiresAdmin) && !user.admin){
                return next({ path: '/' })
            }
        } else{
            return next({ path: '/' })
        }
        next()
    } else {
        next()
    }
})

export default router