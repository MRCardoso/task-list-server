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
                state.user.image = payload.image
                localStorage.setItem(userKey, JSON.stringify(state.user))
            }
        },
        addUser(state, payload) {
            state.user = payload
            if (payload) {
                localStorage.setItem(userKey, JSON.stringify(payload))
                axios.defaults.headers.common['Authorization'] = `bearer ${payload.authToken.token}`
            } else {
                delete axios.defaults.headers.common['Authorization']
                localStorage.removeItem(userKey)
            }
        }
    },
    actions: {
        removedToken({state}, payload) {
            return Promise.resolve(
                (
                    payload.id == state.user.id &&
                    payload.apiId == state.user.authToken.apiId
                ) ? true : false
            )
        },
        async redoLogin({state}) {
            try {
                let user = state.user
                let { name, version } = browserData()

                let res = await axios.post(`refrashToken`, {
                    id: user.id,
                    PlatformName: name,
                    PlatformVersion: version,
                    keepLogin: user.authToken.keepLogin
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