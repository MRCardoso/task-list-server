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
            if (state.user && (state.user.id == payload.id)){
                if(Array.isArray(payload.images) && payload.images.length > 0){
                    state.user.image = payload.images[0].url
                } else{
                    state.user.image = null
                }
                localStorage.setItem(userKey, JSON.stringify(state.user))
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