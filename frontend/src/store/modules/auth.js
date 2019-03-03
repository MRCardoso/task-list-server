import axios from 'axios'
import { userKey, browserData } from '@/utils/index'

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
    },
    actions: {
        async redoLogin({state}) {
            try {
                let user = state.user
                let { name, version } = browserData()

                let res = await axios.post(`refrashToken`, {
                    id: user.id,
                    PlatformName: name,
                    PlatformVersion: version,
                    keepLogin: user.keepLogin
                })

                if (res.data.updated) {
                    return res.data.updated
                }
            } catch (error) {
                /* Has error in refrash re-auth, set logout */
            }
            return false
        }
    }
}