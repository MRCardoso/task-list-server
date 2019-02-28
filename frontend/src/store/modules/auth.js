import axios from 'axios'
import { userKey } from '@/utils/index'

export default {
    state: {
        user: null
    },
    getters: {
        leggeding(state) {
            return state.user ? true : false
        },
    },
    mutations: {
        refrashImage(state, payload){
            if(state.user){
                if(Array.isArray(payload) && payload.length > 0){
                    state.user.image = payload[0].url
                    localStorage.setItem(userKey, JSON.stringify(state.user))
                }
            }
        },
        addUser(state, payload) {
            state.user = payload
            if (payload) {
                localStorage.setItem(userKey, JSON.stringify(payload))
                axios.defaults.headers.common['Authorization'] = `bearer ${payload.token}`
            } else {
                delete axios.defaults.headers.common['Authorization']
                localStorage.removeItem(userKey)
            }
        }
    }
}