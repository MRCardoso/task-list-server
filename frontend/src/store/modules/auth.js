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
        // Make a ajax to request logout
        logout({state}) {
            let user = state.user
            if (user && user.authToken){
                return axios.get(`api/signout/${user.id}/${user.authToken.apiId}`)
            }
            return Promise.resolve()
        },
        // Make a ajax to create a new account
        createAccount(_, payload){
            return axios.post("api/signup", payload)
        },
        // Make a ajax to request login
        login(_, payload) {
            return axios.post("api/signin", payload)
        },
        // Make a ajax for send email to reset password
        forgot(_, email) {
            return axios.post(`api/forgot`, { email })
        },
        // Make a ajax for reset password to user
        reset(_, payload) {
            return axios.patch(`api/reset/${payload.token}`, payload.user)
        },
        // Make a ajax to validate the to toke to logged user
        verifyToken(_, token) {
            return axios.post(`api/validateToken`, { token })
        },
        // Make a ajax to reset the login to user
        async redoLogin({state}) {
            try {
                let user = state.user

                let res = await axios.post('api/refrashToken', {
                    id: user.id,
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